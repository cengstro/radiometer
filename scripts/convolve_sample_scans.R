# radiometer convolutions 

# goal is to do all the heavy lifting with the tidied radiometer data here
# so I don't have to import the raw data into downstream scripts



library(tidyverse)
library(here)
library(readxl)
library(janitor)
library(zoo) # for interpolation
library(broom)


# read in data ----------------------------------------

# my data
rad <- read_csv(here("data/radiometer/sample_scans.csv"))
biomass <- read_csv(here("data/biomass/tidy_biomass.csv"))
cellcount <- read_csv(here("data/cellcount/final_cell.csv"))

# RSRs
s2_rsr_raw <- read_excel(here("data/satellite_rsr/S2-SRF_COPE-GSEG-EOPG-TN-15-0007_3.0.xlsx"), sheet = "Spectral Responses (S2A)") # downloaded from https://sentinels.copernicus.eu/documents/247904/685211/S2-SRF_COPE-GSEG-EOPG-TN-15-0007_3.0.xlsx
planet_rsr_raw <- read_csv(here("data/satellite_rsr/PlanetScope_RSR_SatID_0c_0d.csv"))
l8_path <- here("data/satellite_rsr/L8_OLI_RSR.xlsx")
l8_tabs <- excel_sheets(path = l8_path)[2:10]
l8_rsr_raw <- map_df(l8_tabs, ~read_excel(path = l8_path, sheet = .x))
terra_rsr_raw <- read_table(here("data/satellite_rsr/HMODIST_RSRs.txt"),
             col_names = c("wavelength", "RSR_412", "RSR_443", "RSR_469", "RSR_488", "RSR_531", "RSR_551", "RSR_555", "RSR_645", "RSR_667", "RSR_678", "RSR_748", "RSR_859", "RSR_869", "RSR_1240", "RSR_1640", "RSR_2130"),
             skip = 8)

# approx bands (for plotting)
s2_bands_raw <- read_excel(here("data/satellite_rsr/sentinel-2_approx_bands.xlsx"), skip = 1)





# initial plot ---------------------------------------------


rad %>% 
  # filter(wvl<1340) %>% 
  filter(sample_id == "bdw21.06") %>% # uncomment to plot only one scan
  ggplot(aes(x = wvl, y = tgt_ref_ratio)) +
  geom_line(aes(group = scan_id)) +
  geom_text(aes(label = sample_id), data = rad %>% filter(wvl==350))




# QC -----------------------------------------------------

# compare the two replicate scans
replicate_comparison <- rad %>% 
  filter(wvl<1340) %>% 
  group_by(sample_id, wvl) %>% 
  summarise(dif = abs(tgt_ref_ratio[1] - tgt_ref_ratio[2])) 

# by wavelength
replicate_comparison %>% 
  filter(dif>0.055) %>% 
  distinct(sample_id)

# on average
replicate_comparison %>% 
  group_by(sample_id) %>% 
  summarise(mean_dif = mean(dif, na.rm = TRUE)) %>% 
  arrange(-mean_dif)

# all scans within 10% except for tri21.13: scan 2 is 17 % higher than scan1 on average, remove this




# compare the raw data to a smoothed spline; compute mean diff from spline

# test
test_data <- rad %>%
  filter(scan_id=="20210803_00181", wvl<1340)

smooth.spline(test_data$wvl, test_data$tgt_ref_ratio, nknots = 30) %>%
  augment(test_data) %>%
  ggplot(aes(x = wvl)) +
  geom_line(aes(y = tgt_ref_ratio)) +
  geom_line(aes(y = .fitted), color = "red")
# end test

nk <- 60

splines <- rad %>%
  # filter(wvl<1340) %>% # only spline smooth 350-1340 nm
  drop_na() %>% # smooth spline function dosen't like NA
  group_by(scan_id) %>%
  nest() %>%
  ungroup() %>%
  mutate(mod = map(data, ~smooth.spline(x=.x$wvl, y=.x$tgt_ref_ratio, nknots = nk)),
         aug = map(mod, broom::augment))

# plot a sample
set.seed(123)
splines %>%
  slice_sample(n=10) %>%
  unnest(cols = c(aug)) %>%
  ggplot(aes(x = x)) +
  geom_line(aes(y = y, group = scan_id)) +
  geom_line(aes(y = .fitted, group = scan_id), color = "red") 

# plot all
spl_plt_dat <- splines %>%
  unnest(cols = c(aug, data)) %>%
  mutate(site = sample_id %>% str_sub(1,3),
         no = sample_id %>% str_sub(7,8) %>% as.numeric(),
         sid = sample_id %>% str_remove("21.")) %>% 
  relocate(sid) %>% 
  filter(!(sample_id %in% c("tri21.13"))) %>% 
  group_by(sample_id, sid, wvl, site, no) %>% 
  summarise(tgt_ref_ratio = mean(tgt_ref_ratio), .fitted = mean(.fitted)) %>% 
  ungroup()

spl_plt_lab <- spl_plt_dat %>% 
  filter(wvl==350)

spl_plt_dat %>% 
  filter(wvl<1500) %>% 
  ggplot(aes(x = wvl)) +
  geom_line(aes(y = tgt_ref_ratio, group = sample_id), size = 1, alpha = 1, color = "blue") +
  geom_line(aes(y = .fitted, group = sample_id), alpha = 1, size = 0.5, color = "red") +
  facet_grid(rows = vars(site)) +
  theme_dark() +
  labs(y = "Spectral albedo", x = "Wavelength (nm)") +
  # annotate sample IDs on x axis
  ggrepel::geom_text_repel(aes(x = 350, y = tgt_ref_ratio, label = sid), data = spl_plt_lab, size = 3, nudge_x = -10)
# the chlorophyll 680 feature closely matches the orginal, but we have successfully filtered out the high frequency noise (except for tri 7 and tri8)

#ggsave(here("figs/smooth.pdf"), height = 8, width = 7)

# measure difference from smooth spline
splines %>% 
  unnest(cols = c(aug, data)) %>% 
  group_by(sample_id) %>% 
  summarise(resid = mean(abs(.resid))) %>% 
  arrange(-resid) # %>% view()
# tri21.08 has the highest sd by far, remove this


# filter out noisy scans tri7 and tri8, and the one where a cloud mustve passed over between dups tri13
rad_clean <- splines %>% 
  unnest(cols = c(aug, data)) %>% 
  select(scan_id, sample_id, wvl, rad_ref, rad_target, .fitted) %>% 
  rename(smooth_ratio = .fitted) %>% 
  filter(!(sample_id %in% c("tri21.13", "tri21.08", "tri21.07")))

# %>% 
#   group_by(sample_id, scan_id, wvl) %>% 
#   summarise(rad_ref = mean(rad_ref), rad_target = mean(rad_target), smooth_ratio = mean(smooth_ratio)) %>% 
#   ungroup()

# use the raw ref/target values for broadband albedo colvolution,
# use the smoothed ratio for band SR convolutions  

# add back in the SWIR bands (used for NDSI computation)

swir <- rad %>% 
  filter(!(sample_id %in% c("tri21.13", "tri21.08", "tri21.07"))) %>% # still excluding these samples
  filter(wvl>1550, wvl<1650)

swir %>%
  left_join(cellcount) %>% 
  ggplot(aes(x = wvl, y = tgt_ref_ratio, color = frac_red)) +
  geom_line(aes(group = scan_id)) +
  facet_grid(rows = vars(date)) +
  scale_colour_gradient(low = "white", high = "red") +
  theme_dark() 
# all have low SWIR values as would be expected for snow, regardless of date or algae


# add back in the swir to the rad_clean,
# rename tgt_ref_ratio to smooth ratio, even if it hacn't been smoothed

swir2 <- swir %>% 
  select(-date) %>% 
  rename(smooth_ratio = tgt_ref_ratio) 

rad_clean_plus <- rad_clean %>% 
  bind_rows(swir2)
  


# plot reflectance spectra colored by algae abundance --------------------------

cellcount_mean <- cellcount %>% 
  group_by(sample_id) %>% 
  summarise(frac_red_mean = mean(frac_red)) %>% 
  select(sample_id, frac_red_mean)

joined <- rad_clean %>% 
  left_join(cellcount_mean) %>% 
  left_join(biomass)

# check for missing metadata
joined %>% 
  filter(is.na(toc_g_per_m2) | is.na(frac_red_mean)) %>% 
  distinct(sample_id, sample_id, toc_g_per_m2, frac_red_mean)
# missing carbon for whi21.04 (exploded), and missing cellcount+carbon for bdw21.06 (sample exploded)

joined_w_cellct <- joined %>% 
  drop_na(frac_red_mean)

p1 <- joined_w_cellct %>% 
  ggplot(aes(x = wvl, y = smooth_ratio, colour = frac_red_mean)) +
  geom_line(aes(group = sample_id)) +
  scale_colour_gradient(low = "white", high = "red") +
  theme_dark() 
p1


# 2 add sample labels
label_dat <- joined_w_cellct %>%
  mutate(sample_id = sample_id %>% str_remove("21.0"),
         sample_id = sample_id %>% str_remove("21.")) %>% # remove the 21 and unpad 0 for simplicity 
  filter(wvl == 350) %>% # get albedo at 350
  group_by(sample_id) %>% # for each scan pair choose the highest albedo so there are not duplicate labels
  filter(smooth_ratio == max(smooth_ratio))
sample_lab_layer <- geom_text(aes(x = 350, y = smooth_ratio, label = sample_id), 
                              data = label_dat, nudge_x = -30, size = 3)
p1 + sample_lab_layer

# 3 with band overlays
s2_band_geoms <- s2_bands_raw %>% 
  clean_names() %>% 
  rename(band = sentinel_2_bands) %>% 
  select(1:3) %>% # select S2A bands, not B
  separate(band, sep = " – ", into = c("band", "name")) %>% 
  # compute the start and end nm based on bandwidth
  mutate(xmin = central_wavelength_nm_2 - (bandwidth_nm_3/2),
         xmax = central_wavelength_nm_2 + (bandwidth_nm_3/2),
         band = band %>% str_remove("and "),
         .keep = "unused")
  
s2_band_plot_data <- s2_band_geoms %>% 
  slice(2:4) %>% # only show visible and NIR bands for simplicity in this plot
  # mutate(name = if_else(name %in% c("Red","Green","Blue"), str_sub(name, 1, 1), name)) %>%
  # add y values, specify colors for each rectangle
  add_column(ymin = 0,
             ymax = .05,
             color = c("blue", "green", "darkred"))#, rep("darkgrey",4)))

band_geoms <- geom_rect(s2_band_plot_data, mapping = aes(xmin=xmin, xmax=xmax, ymin=ymin, ymax=ymax), fill = s2_band_plot_data$color, inherit.aes = FALSE, show.legend = FALSE)
band_text <- geom_text(s2_band_plot_data, mapping = aes(xmin+15, ymin+0.025, label = band), size = 4, color = "white", inherit.aes = FALSE)

# final plot (fig 1)
p1 + 
  sample_lab_layer +
  band_geoms +
  band_text +
  scale_x_continuous(minor_breaks = seq(400 , 1300, 100), breaks = seq(400, 1300, 200)) +
  theme(legend.position = c(0.9, 0.8)) +
  labs(x = "Wavelength (nm)", y = "Spectral reflectance", color = "Snow algae \ncell area \n% coverage", tag = "A")
ggsave(here("figs/f1A.png"), height = 7, width = 9)



# convolve to S-2 RGND -----------------------------------------

# tidy
s2_rsr <- s2_rsr_raw %>% 
  janitor::clean_names() %>% 
  rename(wvl = sr_wl) %>% 
  pivot_longer(-wvl, names_to = "band", values_to = "rsr") %>% 
  mutate(band = band %>% str_split_n("_", 4))

convolve_to_band <- function(rad = rad_clean_plus, rsr){
  # compute max possible value for each band
  # by taking discrete integral
  # use this for scaling later
  # this is the Spectral Radiance for a given sensor
  band_max <- rsr %>% 
    group_by(band) %>% 
    summarise(max_band_val = sum(rsr)) %>% 
    ungroup()
  
  # convolve to bands:
  # 1) multiply (smoothed) spectral albedo by the RSR
  # ie if the RSR is 1 for a given wavelength it will be contribute to the satellite
  # signal 100%
  # 2) Then we take the sum for each sensor on the satellite
  # 3) and scale it out of 1 by the max potential signal for that band
  rad %>% 
    inner_join(rsr) %>% 
    mutate(weighted_reflectance = smooth_ratio * rsr, .keep = "unused") %>% # 1
    group_by(scan_id, band, sample_id) %>% # keep sample id to keep this grouping variable
    summarise(sum = sum(weighted_reflectance)) %>% # 2
    ungroup() %>% 
    left_join(band_max) %>% #3
    mutate(refl = (sum/max_band_val), .keep="unused") %>% # convert to reflectance
    pivot_wider(names_from = "band", values_from = refl) %>% 
    arrange(sample_id)
}

rad_as_s2 <- rad_clean_plus %>% convolve_to_band(s2_rsr)

# check that this makes sense for a random sample
set.seed(123)
test <- rad_clean_plus %>% 
  nest_by(scan_id) %>% 
  ungroup() %>% 
  slice_sample(n=1) %>% 
  unnest(cols=c(data))
# specs for plotting the convolved bands
test_bands_s2 <- rad_as_s2 %>% 
  filter(scan_id == test$scan_id[1]) %>% 
  pivot_longer(-scan_id:-sample_id, names_to = "band", values_to = "refl") %>% 
  mutate(band = band %>% toupper()) %>% 
  left_join(s2_band_geoms)
# plot it
test %>% 
  ggplot(aes(x = wvl, y = smooth_ratio)) + 
  geom_line() + # the spectral data
  geom_rect(data = test_bands_s2, mapping = aes(xmin=xmin, xmax=xmax, ymin=refl-0.005, ymax=refl+0.005), inherit.aes = FALSE, alpha = 0.5) + # the spec data convolved to bands
  xlim(350, 1350)

# write the result
rad_as_s2 %>% write_csv(here("data/radiometer/as_s2.csv"))


# plot the bands: 
simple_cell <- cellcount %>% 
  select(sample_id, frac_red) %>% 
  group_by(sample_id) %>% 
  summarise(frac_red = mean(frac_red))

rad_as_s2_band %>% 
  select(-scan_id, -b1, -b9) %>% # remove 60 m bands
  pivot_longer(-sample_id) %>% 
  group_by(sample_id, name) %>% 
  summarise(mean = mean(value), sd = sd(value)) %>% 
  ungroup() %>% 
  mutate(name = name %>% fct_relevel(c("b2", "b3", "b4", "b5","b6", "b7", "b8a", "b8"))) %>% 
  left_join(simple_cell) %>% 
  drop_na() %>% 
  ggplot(aes(y = mean, x = name, color = frac_red)) +
  geom_line(aes(group = sample_id)) +
  scale_colour_gradient(low = "white", high = "red") +
  theme_dark() #+ #this gets messy 
  # geom_linerange(aes(ymin = mean - sd, # sd bars between the duplicate scans
  #                   ymax = mean + sd))



  
# convolve to Planet ---------------

planet_rsr <- planet_rsr_raw %>% 
  mutate(wvl = `Wavelength [µm]` * 1000, .keep = "unused", .before = 1) %>% 
  clean_names() %>% 
  pivot_longer(-wvl, names_to = "band", values_to = "rsr")

# since the planet RSR is in 10 nm increments, 
# fill in the missing values with linear interpolation 
planet_rsr_interp <- expand_grid(wvl = min(planet_rsr$wvl):max(planet_rsr$wvl), 
            band = distinct(planet_rsr, band) %>% pull()) %>% 
  left_join(planet_rsr) %>% 
  group_by(band) %>% 
  mutate(rsr_interp = rsr %>% zoo::na.approx(na.rm = FALSE)) %>% # linear interpolation
  ungroup() %>% 
  select(-rsr) %>% 
  rename(rsr = rsr_interp)
# convolve
rad_as_planet <- rad_clean_plus %>% convolve_to_band(planet_rsr_interp)

# write
rad_as_planet %>% write_csv(here("data/radiometer/as_planet.csv"))




# convolve to landsat 8 --------------------------

# tidy
l8_rsr <- l8_rsr_raw %>% 
  clean_names() %>% 
  select(-stdev) %>% 
  rename(wvl = wavelength) %>% 
  pivot_longer(-wvl, names_to = "band", values_to = "rsr", values_drop_na = TRUE)
# convolve
rad_as_l8 <- rad_clean_plus %>% convolve_to_band(l8_rsr)
# write
rad_as_l8 %>% write_csv(here("data/radiometer/as_l8.csv"))


# convolve to modis terra --------------------------

# tidy
terra_rsr <- terra_rsr_raw %>%
  rename(wvl = wavelength) %>% 
  pivot_longer(-wvl, names_to = "band", values_to = "rsr")
# I'm confused by the RSR band annotations
# from https://modis.gsfc.nasa.gov/about/specifications.php
# We know the range of each band
# plot each range to match the RSR to the band name
terra_rsr %>% 
  mutate(band_ctr_wvl = band %>% parse_number()) %>% 
  filter((band_ctr_wvl >620 & band_ctr_wvl<670) | # red B1
         (band_ctr_wvl >841 & band_ctr_wvl<876) | # nir B2
         (band_ctr_wvl >459 & band_ctr_wvl<479) | # blue B3
         (band_ctr_wvl >545 & band_ctr_wvl<565)| # green B4
         (band_ctr_wvl >1628 & band_ctr_wvl<1652)) %>% # swir B6
  ggplot(aes(x = wvl, y = rsr, color = band)) +
  geom_line() +
  xlim(500,1000)
# The narrower bands are the ocean bands (1km res)
# using the land bands for my study
# ie RSR_555 = green, RSR_645=red, RSR_859=nir


# convolve
rad_as_terra <- rad_clean_plus %>% convolve_to_band(terra_rsr)
# write
rad_as_terra %>% write_csv(here("data/radiometer/as_terra.csv"))






# Convolute to albedo  ---------------------------------

# Take the Riemann sum across range of radiometer 350-1340 nm, as a discrete integral

albedo <- rad_clean %>% 
  group_by(scan_id, sample_id) %>% # keep sample id as grouping variable
  # BB albedo compuated as the ratio of total upwelling to total downwelling radiance
  # where total radiance is the discrete integral from 350-1350 nm
  summarise(sum_ref = sum(rad_ref), sum_tgt = sum(rad_target)) %>% 
  mutate(albedo = sum_tgt/sum_ref, .keep="unused") %>% 
  ungroup()

# check the variation in albedo between scans
albedo %>% 
  group_by(sample_id) %>% 
  summarise(sd = sd(albedo)) %>% 
  arrange(-sd)

albedo %>%
  write_csv(here("data/radiometer/as_bb_albedo.csv"))


# visible albedo ----------------------------------------------------------
# 300-700 nm, like Lutz 2016

viz_albedo <- rad_clean %>% 
  filter(wvl>400, wvl<700) %>% 
  group_by(scan_id, sample_id) %>% 
  summarise(sum_ref = sum(rad_ref), sum_tgt = sum(rad_target)) %>% 
  mutate(albedo = sum_tgt/sum_ref, .keep="unused")

viz_albedo %>%
  write_csv(here("data/radiometer/as_viz_albedo.csv"))


# NIR albedo --------------------------------------------------------------

nir_albedo <- rad_clean %>% 
  filter(wvl>700, wvl<1300) %>% 
  group_by(scan_id, sample_id) %>% 
  summarise(sum_ref = sum(rad_ref), sum_tgt = sum(rad_target)) %>% 
  mutate(albedo = sum_tgt/sum_ref, .keep="unused")

nir_albedo %>%
  write_csv(here("data/radiometer/as_nir_albedo.csv"))



