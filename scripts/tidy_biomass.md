Biomass wrangle
================

``` r
library(tidyverse)
```

    ## ── Attaching packages ─────────────────────────────────────── tidyverse 1.3.1 ──

    ## ✓ ggplot2 3.3.5          ✓ purrr   0.3.4     
    ## ✓ tibble  3.1.5          ✓ dplyr   1.0.7     
    ## ✓ tidyr   1.1.4          ✓ stringr 1.4.0.9000
    ## ✓ readr   2.0.2          ✓ forcats 0.5.1

    ## ── Conflicts ────────────────────────────────────────── tidyverse_conflicts() ──
    ## x dplyr::filter() masks stats::filter()
    ## x dplyr::lag()    masks stats::lag()

``` r
library(here)
```

    ## here() starts at /home/cengstro/ownCloud/proj/radiometer

``` r
library(readxl)
library(janitor)
```

    ## 
    ## Attaching package: 'janitor'

    ## The following objects are masked from 'package:stats':
    ## 
    ##     chisq.test, fisher.test

``` r
biomass_raw <- read_excel(here("data/biomass/toc.xlsx"), skip = 4)
epi <- read_csv(here("data/field_sample_meta/tidy_epicollect.csv"))
```

    ## Rows: 66 Columns: 6

    ## ── Column specification ────────────────────────────────────────────────────────
    ## Delimiter: ","
    ## chr (3): sample_id, container_type, scan_id
    ## dbl (3): lon, lat, weight_g

    ## 
    ## ℹ Use `spec()` to retrieve the full column specification for this data.
    ## ℹ Specify the column types or set `show_col_types = FALSE` to quiet this message.

Tidy the data

``` r
biomass_tidy <- biomass_raw %>% 
  janitor::clean_names() %>% 
  select(-ubc_id) %>% 
  rename(dry_wt_mg = dried_sample,
         wt_for_cn = for_cn_mg, 
         percent_tic = percent_carbonate_c_or_tic,
         wt_for_tic = tic_mg)
glimpse(biomass_tidy)
```

    ## Rows: 27
    ## Columns: 8
    ## $ sample_id       <chr> "whi21.03", "whi21.05", "whi21.06", "whi21.07", "whi21…
    ## $ dry_wt_mg       <dbl> 37.47, 31.75, 28.42, 23.72, 43.09, 5.54, 283.79, 51.35…
    ## $ percent_total_n <dbl> 1.5578732, 0.7382788, 0.7769854, 0.5182193, 0.6999095,…
    ## $ percent_total_c <dbl> 63.297091, 15.227415, 21.440673, 11.585469, 13.382452,…
    ## $ wt_for_cn       <dbl> 1.604, 2.321, 2.254, 2.036, 4.110, 0.851, 9.487, 2.585…
    ## $ percent_tic     <chr> "1.1671087533156493E-2", "2.3708920187793428E-2", "9.2…
    ## $ wt_for_tic      <dbl> 11.31, 10.65, 14.38, 6.83, 9.84, NA, 33.81, 9.12, 3.15…
    ## $ percent_org_c   <dbl> 63.285420, 15.203706, 21.431424, 11.545425, 13.361313,…

Scale the dry sample weight to account for the 600 uL aliquot used for
cellcounts

``` r
water_vol <- epi %>% 
  distinct(sample_id, weight_g) %>% # remove duplicate entries
  rename(vol_mL = weight_g) # assume 1 g water = 1 mL


biomass_removed <- biomass_tidy %>% 
  left_join(water_vol, by = "sample_id") %>% 
  mutate(frac_removed = .6/vol_mL,
         dry_wt_2 = dry_wt_mg + frac_removed*dry_wt_mg) %>% 
  select(sample_id, dry_wt_2, percent_total_n, percent_total_c, percent_tic, percent_org_c)
```

Convert the units to mg per square meter

``` r
sample_area <- pi*0.05^2 # sampling area, in square meters

get_mg_per_sq_m <- function(element_percent){
  frac_element <- as.numeric(element_percent)/100
  mg_elt_per_sample <- biomass_removed$dry_wt_2 * frac_element
  mg_per_sq_m <- mg_elt_per_sample / sample_area 
  return(mg_per_sq_m)
}

biomass_units <- biomass_removed %>% 
  mutate(tn_mg_per_m2 = get_mg_per_sq_m(percent_total_n), 
         tc_g_per_m2 = get_mg_per_sq_m(percent_total_c)/1000, # convert to g
         tic_mg_per_m2 = get_mg_per_sq_m(percent_tic), # Warning: NAs introduced by coercion
         toc_g_per_m2 = get_mg_per_sq_m(percent_org_c)/1000, # convert to g
         mass_g_per_m2 = (dry_wt_2/1000)/sample_area, # convert to g
         .keep = "unused")
```

    ## Warning in get_mg_per_sq_m(percent_tic): NAs introduced by coercion

``` r
biomass_units
```

    ## # A tibble: 27 × 6
    ##    sample_id tn_mg_per_m2 tc_g_per_m2 tic_mg_per_m2 toc_g_per_m2 mass_g_per_m2
    ##    <chr>            <dbl>       <dbl>         <dbl>        <dbl>         <dbl>
    ##  1 whi21.03         74.7        3.03          0.560        3.03          4.79 
    ##  2 whi21.05         30.0        0.619         0.964        0.618         4.07 
    ##  3 whi21.06         28.3        0.781         0.337        0.780         3.64 
    ##  4 whi21.07         15.7        0.352         1.22         0.351         3.04 
    ##  5 whi21.08         38.6        0.739         1.17         0.737         5.52 
    ##  6 whi21.09          6.43       0.100        NA            0.100         0.709
    ##  7 whi21.10        281.         3.48          4.16         3.47         36.4  
    ##  8 tri21.03        131.         4.19          2.21         4.18          6.57 
    ##  9 tri21.04         26.4        0.869         0.300        0.868         2.25 
    ## 10 tri21.05          4.63       0.116         0.226        0.116         0.800
    ## # … with 17 more rows

``` r
biomass_units %>% 
  pivot_longer(-sample_id) %>% 
  ggplot(aes(value)) +
  geom_histogram() +
  facet_wrap(vars(name), scales="free")
```

    ## `stat_bin()` using `bins = 30`. Pick better value with `binwidth`.

    ## Warning: Removed 3 rows containing non-finite values (stat_bin).

![](tidy_biomass_files/figure-gfm/unnamed-chunk-6-1.png)<!-- -->

``` r
biomass_units %>% 
  arrange(-toc_g_per_m2)
```

    ## # A tibble: 27 × 6
    ##    sample_id tn_mg_per_m2 tc_g_per_m2 tic_mg_per_m2 toc_g_per_m2 mass_g_per_m2
    ##    <chr>            <dbl>       <dbl>         <dbl>        <dbl>         <dbl>
    ##  1 bdw21.04         226.        10.4          0.929        10.4          19.0 
    ##  2 bdw21.03         104.         4.96         0.847         4.96          9.01
    ##  3 tri21.14         164.         4.45         0.791         4.45         11.2 
    ##  4 tri21.03         131.         4.19         2.21          4.18          6.57
    ##  5 tri21.06         113.         3.66         1.83          3.66          6.13
    ##  6 whi21.10         281.         3.48         4.16          3.47         36.4 
    ##  7 tri21.15         130.         3.44         0.594         3.44          7.89
    ##  8 whi21.03          74.7        3.03         0.560         3.03          4.79
    ##  9 bdw21.09         120.         1.97         0.808         1.97          9.39
    ## 10 bdw21.02          42.8        1.96         0.242         1.96          3.37
    ## # … with 17 more rows

bdw21.04 has highest organics

``` r
biomass_units %>% 
  arrange(-tic_mg_per_m2)
```

    ## # A tibble: 27 × 6
    ##    sample_id tn_mg_per_m2 tc_g_per_m2 tic_mg_per_m2 toc_g_per_m2 mass_g_per_m2
    ##    <chr>            <dbl>       <dbl>         <dbl>        <dbl>         <dbl>
    ##  1 whi21.10         281.        3.48          4.16         3.47         36.4  
    ##  2 tri21.08          13.8       0.193         2.57         0.190         0.989
    ##  3 tri21.03         131.        4.19          2.21         4.18          6.57 
    ##  4 tri21.06         113.        3.66          1.83         3.66          6.13 
    ##  5 tri21.10          50.0       1.25          1.38         1.25          3.86 
    ##  6 tri21.12          54.8       1.53          1.29         1.53          3.90 
    ##  7 whi21.07          15.7       0.352         1.22         0.351         3.04 
    ##  8 whi21.08          38.6       0.739         1.17         0.737         5.52 
    ##  9 whi21.05          30.0       0.619         0.964        0.618         4.07 
    ## 10 bdw21.08          55.0       1.14          0.953        1.14          7.04 
    ## # … with 17 more rows

whi21.10, the dirty snow sample, has highest inorganics, as well as
highest nitrogen

``` r
biomass_units %>% 
  arrange(-mass_g_per_m2)
```

    ## # A tibble: 27 × 6
    ##    sample_id tn_mg_per_m2 tc_g_per_m2 tic_mg_per_m2 toc_g_per_m2 mass_g_per_m2
    ##    <chr>            <dbl>       <dbl>         <dbl>        <dbl>         <dbl>
    ##  1 whi21.10         281.        3.48          4.16         3.47          36.4 
    ##  2 bdw21.04         226.       10.4           0.929       10.4           19.0 
    ##  3 tri21.14         164.        4.45          0.791        4.45          11.2 
    ##  4 bdw21.09         120.        1.97          0.808        1.97           9.39
    ##  5 bdw21.03         104.        4.96          0.847        4.96           9.01
    ##  6 tri21.15         130.        3.44          0.594        3.44           7.89
    ##  7 bdw21.08          55.0       1.14          0.953        1.14           7.04
    ##  8 tri21.03         131.        4.19          2.21         4.18           6.57
    ##  9 tri21.06         113.        3.66          1.83         3.66           6.13
    ## 10 whi21.08          38.6       0.739         1.17         0.737          5.52
    ## # … with 17 more rows

``` r
biomass_units %>% write_csv(here("data/biomass/tidy_biomass.csv"))
```
