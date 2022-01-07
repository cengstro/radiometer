





## compare with multvariate regression 

Compare the model competition results using joined stats, and joined no outliers. 

```{r}
area_df <- joined_stats %>% 
  select(contains("mean")) %>% 
  select(frac_red_mean, 1:6)
biomass_df <- joined_stats %>% 
  select(contains("mean")) %>% 
  select(organic_carbon_mg_mean, 1:6)

set.seed(123) # although this shouldnt impact LOOCV results, it will affect the order for each fold, set seed for fold-specific metrics 
area_folds <- vfold_cv(area_df)
mass_folds <- vfold_cv(biomass_df)

my_metrics <- metric_set(rmse) 

area_wf <- workflow() %>% 
  add_model(linear_reg()) %>% 
  add_formula(frac_red_mean ~ .)

mass_wf <- workflow() %>% 
  add_model(linear_reg()) %>% 
  add_formula(organic_carbon_mg_mean ~ .)

set.seed(4256)
area_fits <- area_wf %>% 
  fit_resamples(area_folds, metrics = my_metrics)
mass_fits <- mass_wf %>% 
  fit_resamples(mass_folds, metrics = my_metrics)

collect_metrics(area_fits)
collect_metrics(mass_fits)
```


#### Compare with LASSO
```{r}
lasso_spec <- linear_reg(penalty = 0.1, mixture = 1) %>%
  set_engine("glmnet")

wf <- workflow() %>%
  add_formula(office_rec)

lasso_fit <- wf %>%
  
  fit(data = office_train)

lasso_fit %>%
  pull_workflow_fit() %>%
  tidy()
```


```{r}
# issue w leakage
tune_spec <- linear_reg(penalty = tune(), mixture = 1) %>%
  set_engine("glmnet")

tune_lasso_area_wf <- workflow() %>% 
  add_model(tune_spec) %>% 
  add_formula(frac_red_mean ~ .)

lambda_grid <- grid_regular(penalty(), levels = 70)

set.seed(345)
tune_res <- tune_grid(
  tune_lasso_area_wf,
  resamples = area_folds,
  metrics = my_metrics,
  grid = 20
) # many convergence failure

tune_res %>%
  collect_metrics() %>%
  select(mean, penalty, std_err) %>%
  ggplot(aes(x=penalty, y=mean)) +
  geom_point() +
  geom_errorbar(aes(ymax = mean + std_err, ymin = mean - std_err))
# lambda ~0.02 minimizes RMSE

tuned_lasso <- tune_lasso_area_wf %>% 
  finalize_workflow(select_best(tune_res))

library(vip)

tuned_lasso %>% 
  fit(area_df) %>% 
  extract_fit_parsnip() %>% 
  vi()
```








## AIC model competition 


### all data, n= 26, Frac red

We have 6 variables, all possible combinations yields 6 + 15 + 20 + 6 + 1 = 48 candidate models

```{r}
# # test
# mod_dat_1 <- joined_stats %>% 
#   select(frac_red_mean, ndvi_mean, rgnd_mean, b6b5_mean, b5b3_mean, b6b3_mean, b6b4_mean) %>% 
#   drop_na()
# 
# mod <- lm(frac_red_mean ~ ., data = mod_dat_1,  na.action = "na.fail") # must include na.fail
# mod_compare <- MuMIn::dredge(mod)
# mod_results <- mod_compare %>% 
#   as_tibble(rownames='mod_id') %>% 
#   janitor::clean_names() %>% 
#   pivot_longer(intercept:rgnd_mean) %>% 
#   group_by(mod_id) %>% 
#   mutate(nterm = sum(!is.na(value))) %>%  # n terms in model
#   ungroup() %>% 
#   pivot_wider()
# # end test

my_mod_compare <- function(df, response){
  form_response <- deparse( substitute( response) )
  response <- enquo(response)
  
  mod_dat <- df %>% 
    select(!!response, ndvi_mean, rgnd_mean, b6b5_mean, b5b3_mean, b6b3_mean, b6b4_mean) %>% 
    drop_na()
  # annoying workaround for pasting a formula together
  mod <- lm(as.formula(paste(form_response, " ~ ndvi_mean+ rgnd_mean+ b6b5_mean+ b5b3_mean+ b6b3_mean+ b6b4_mean")), data = mod_dat,  na.action = "na.fail") # must include na.fail
  
  mod_compare <- MuMIn::dredge(mod)
  
  mod_results <- mod_compare %>%
    as_tibble(rownames='mod_id') %>%
    janitor::clean_names() %>%
    pivot_longer(intercept:rgnd_mean) %>%
    group_by(mod_id) %>%
    mutate(nterm = sum(!is.na(value))) %>%  # n terms in model
    ungroup() %>%
    pivot_wider()
  mod_results %>% 
    relocate(nterm, delta)
}

all_cc <- my_mod_compare(joined_stats, frac_red_mean)
all_toc <- my_mod_compare(joined_stats, organic_carbon_mg_mean)
select_cc <- my_mod_compare(joined_no_outliers, frac_red_mean)
select_toc <- my_mod_compare(joined_no_outliers, organic_carbon_mg_mean)
all_cc;all_toc;select_cc;select_toc
```




```{r}
my_filt <- function(df, n) df %>% filter(nterm==n)
my_filt(all_cc, 2);my_filt(all_toc, 2);my_filt(select_cc, 2);my_filt(select_toc, 2)

```
in the full dataset, the best one term model for cell count was b6b4, 
for toc was b6b5, 
in the select dataset, " " cc was ndvi, 
the best for toc was b6 b5


```{r}
my_filt(all_cc, 3);my_filt(all_toc, 3);my_filt(select_cc, 3);my_filt(select_toc, 3)
```