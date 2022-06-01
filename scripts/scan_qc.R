# check time since last calibration for each scan

library(tidyverse)
library(fs)
library(here)
library(lubridate)
library(janitor)
library(broom)
library(ggpubr)

sed_paths <- dir_ls(here("data/radiometer/raw/"), recurse = TRUE, regexp = ".sed$")
rad <- read_csv(here("data/radiometer/sample_scans.csv"))
spec_meta <- sed_paths %>% # SLOW
  map_df(read_tsv, n_max=10, show_col_types = FALSE, id = "filename")
rgnd <- read_csv(here("data/radiometer/as_s2.csv")) %>% 
  mutate(rgnd = (b4-b3)/(b4+b3)) %>% 
  select(sample_id, rgnd)
albedo <- read_csv(here("data/radiometer/as_bb_albedo.csv"))


get_scan_id = function(string){
  sed_num <- string %>% basename() %>% str_split_i("_", 3) %>% str_split_i("\\.", 1)
  date <- string %>% str_extract("2021_[:alpha:]{3}_[:digit:]{2}") %>% ymd() %>% str_remove_all("-")
  return(paste(date, sed_num, sep = "_"))
}

spec_named <- spec_meta %>% ## SLOW
  mutate(scan_id = filename %>% get_scan_id(), .keep="unused", .before=1) %>% 
  arrange(scan_id) # for convenience

qc <- spec_named %>% 
  separate(2, into = c("name", "value"), sep=": ") %>% # include whitespace
  filter(name %in%c("Time", "Temperature (C)")) %>%
  pivot_wider(names_from = "name", values_from = "value") %>% 
  clean_names() %>% 
  mutate(calibration_time = time %>% str_split_i(",", 1) %>% parse_date_time("HMS"),
         measurement_time = time %>% str_split_i(",", 2) %>% parse_date_time("HMS"),
         delta_time_min = difftime(measurement_time, calibration_time, units="mins") %>% as.numeric()
         ) %>% 
  separate(temperature_c, sep =",", into = c("t1", "t2", "t3", "t4", "t5", "t6")) %>% ##HERE--- what do the temperature sensors mean?
  dplyr::select(scan_id, t1:t6, delta_time_min, measurement_time) %>%
  mutate(delta_t1 = as.numeric(t1) -as.numeric(t4), # the temp difference 
         delta_t2 = as.numeric(t2) - as.numeric(t5),
         delta_t3 = as.numeric(t3)-as.numeric(t6),
         measurement_time = measurement_time %>% str_sub(9,16) %>% parse_time(),
         .keep="unused")
  # write_csv(here("data/radiometer/scan_qc.csv"))

# total energy arriving on ground per steridian
rad %>% group_by(scan_id) %>% summarise(sum = sum(rad_ref)) %>% arrange(-sum)
# roughly a quarter of the solar constant (irradiance, around 1000 W/m2)
# https://en.wikipedia.org/wiki/Solar_irradiance#Irradiance_on_Earth's_surface


# view plot of incoming vs reflected radiance
rad %>% 
  filter(sample_id %in% c("tri21.07")) %>% 
  pivot_longer(rad_ref:rad_target) %>% 
  ggplot(aes(y = value, x = wvl, color = name)) +
  geom_line()

# test
test_data <- rad %>%
  filter(scan_id=="20210803_00181", wvl<1340)

nk=60

smooth.spline(test_data$wvl, test_data$tgt_ref_ratio, nknots = nk) %>%
  broom::augment(test_data) %>%
  ggplot(aes(x = wvl)) +
  geom_line(aes(y = tgt_ref_ratio)) +
  geom_line(aes(y = .fitted), color = "red")
# end test

splines <- rad %>%
  drop_na() %>% # smooth spline function dosen't like NA
  group_by(scan_id) %>%
  nest() %>%
  ungroup() %>%
  mutate(mod = map(data, ~smooth.spline(x=.x$wvl, y=.x$tgt_ref_ratio, nknots = nk)),
         aug = map(mod, broom::augment))

# plot a sample
splines %>%
  # slice_sample(n=10) %>%
  unnest(cols = c(aug)) %>%
  ggplot(aes(x = x)) +
  geom_line(aes(y = y, group = scan_id)) #+
  # geom_line(aes(y = .fitted, group = scan_id), color = "red") 


# measure difference from smooth spline
dd <- splines %>% 
  unnest(cols = c(aug, data)) %>% 
  group_by(scan_id, sample_id) %>% 
  summarise(resid = mean(abs(.resid))) %>% 
  ungroup() %>% 
  arrange(-resid) %>% 
  left_join(qc) %>% 
  mutate(site = sample_id %>% str_sub(1,3)) %>% 
  group_by(sample_id, site, measurement_time) %>%
  summarise(resid = mean(resid), delta_time_min = mean(delta_time_min), delta_t1 =mean(delta_t1), delta_t2 =mean(delta_t2), delta_t3 =mean(delta_t3)) %>%
  ungroup() %>%
  mutate(no = sample_id %>% str_sub(7,8) %>% as.numeric()) %>% 
  # filter(!(sample_id %in% c("tri21.07", "tri21.08"))) %>% 
  mutate(sid = sample_id %>% str_remove("21."))


p2 <- dd %>% 
  ggplot(aes(x = delta_time_min, y = resid, color = site)) +
  geom_point() +
  ggrepel::geom_text_repel(aes(label =sid), size =3.5, data = dd %>% filter(resid > 0.0014)) +
  labs(y = "Mean spline residual", x="Time since last reference panel scan (minutes)", tag = "B")
p2
ggsave(here("figs/smooth_v_time.png"))

# temperature dependence
dd %>% 
  pivot_longer(cols = delta_t1:delta_t3) %>% 
  ggplot(aes(x = value, y = resid, color = site)) +
  facet_wrap(vars(name), scales = "free") +
  geom_point()

# time of day depends

p1 <- dd %>% 
  ggplot(aes(x = measurement_time, y =  resid, color = site)) +
  geom_point(guides=FALSE) + 
  ggrepel::geom_text_repel(aes(label =sid), size =3.5, data = dd %>% filter(resid > 0.0014)) +
  # facet_grid(rows=vars(site)) +
  labs(y = "Mean spline residual", x="Time of day", tag="A") +
  theme(legend.position="none")
p1





# does time of day impact RGND?
mean_rg <- rgnd %>% 
  group_by(sample_id) %>% 
  summarise(rgnd = mean(rgnd))


dd2 <- dd %>% 
  left_join(mean_rg)

p3 <- dd2 %>% 
  ggplot(aes(x = measurement_time, y = rgnd, color = site)) +
  geom_point() +
  labs(y = "RGND", x="Time of day", tag="C") +
  theme(legend.position="none") +
  ggrepel::geom_text_repel(aes(label = sid), size =3.5, data = dd2 %>% filter(site=="tri"))
p3

legend <- cowplot::get_legend(p2)
ggarrange(p1, p2 +
            theme(legend.position="none"), p3, legend)


