# wrangle the transect data

library(tidyverse)
library(sf)
library(here)
library(fs)
library(janitor)
library(lubridate)
library(zoo) # for interp

scans <- read_csv(here("data/radiometer/transect_scans.csv")) # with misc scans already removed
rsr_raw <- read_csv(here("data/satellite_rsr/PlanetScope_RSR_SatID_0c_0d.csv"))

# convolve to Planet band ratios --------------------
rsr <- rsr_raw %>% 
  mutate(wvl = `Wavelength [µm]` * 1000, .keep = "unused", .before = 1) %>% 
  clean_names() 

rsr %>% 
  pivot_longer(-wvl) %>% 
  mutate(name = name %>% as.factor() %>% fct_relevel(c("blue", "green", "red", "nir"))) %>% # for plotting
  ggplot(aes(x = wvl, y = value, color = name)) +
  geom_point() +
  geom_line() +
  scale_colour_manual(values = c("blue", "green", "red", "darkred"))

# lienar interpolate to nm
interp <- tibble(wvl = min(rsr$wvl):max(rsr$wvl)) %>% # wavelength range in 1 nm increments
  left_join(rsr) %>% 
  mutate(across(blue:nir, ~zoo::na.approx(.x, na.rm =FALSE))) # linear interpolation
interp %>% 
  pivot_longer(-wvl) %>% 
  mutate(name = name %>% as.factor() %>% fct_relevel(c("blue", "green", "red", "nir"))) %>% 
  ggplot(aes(x = wvl, y = value, color = name)) +
  geom_point() +
  geom_line() +
  scale_colour_manual(values = c("blue", "green", "red", "darkred")) +
  xlim(400,900)

# compute max potential value for each band
band_max <- interp %>%
  pivot_longer(-wvl) %>% 
  group_by(name) %>% 
  summarise(band_max = sum(value)) # discrete integral, if the sum equals this than it should be the max, or 1 

set.seed(123)
test <- scans %>% 
  group_by(scan_id) %>% 
  nest() %>% 
  ungroup() %>% 
  slice_sample(n=1) %>% 
  unnest(cols=c(data))
# plot it
test %>% ggplot(aes(x = wvl, y = tgt_ref_ratio)) + geom_line() + xlim(400,900)

# compute the band values from the RSR function
test %>% 
  inner_join(interp %>% pivot_longer(-wvl), by = "wvl") %>% 
  mutate(weighted_reflectance = tgt_ref_ratio * value) %>% # weight each albedo by its RSR
  group_by(scan_id, name) %>% 
  summarise(sum = sum(weighted_reflectance)) %>%  # take the sum of the weighted albedo
  ungroup() %>% 
  left_join(band_max) %>% 
  mutate(refl = (sum/band_max), .keep = "unused") # Planet reflectance
# end test

# apply to all scans
rad_as_planet_band <- scans %>% 
  inner_join(interp %>% pivot_longer(-wvl), by = "wvl") %>%
  # calculate the weighted value for each nanometer
  mutate(weighted_reflectance = tgt_ref_ratio * value, .keep = "unused") %>% 
  # take the weighted mean for each band, for each scan id
  group_by(scan_id, name) %>% # include sample id to keep this grouping variable
  summarise(sum = sum(weighted_reflectance)) %>% 
  ungroup() %>% 
  left_join(band_max) %>% 
  mutate(refl = (sum/band_max), .keep = "unused") %>% 
  pivot_wider(names_from = name, values_from = refl) %>% 
  arrange(scan_id)
rad_as_planet_band


## QC --------




# get coordinates for each scan --------------------

## Garmin handheld ----------------------------

# the waypoints
gps <- read_csv(here("data/radiometer_wpts/GPS_Aug_3_5.csv"), skip = 22, n_max = 179)
# the key linking the scan_id with the waypoint ID
key <- read_csv(here("data/radiometer_wpts/gps_sed_final_key.csv")) # connects sed with external GPS pts

# left join                  
gps_key <- key %>% 
  mutate(date_chr = date %>% str_remove_all("-"),
         scan_chr = scan_id %>% str_pad(5, pad = "0"),
         scan_id = paste(date_chr, scan_chr, sep = "_"), .keep = "unused") %>% 
  left_join(gps) %>% 
  select(scan_id, lat, lon)
gps_key

# which scan IDs are missing gps coordinates?
scan_ids <- scans %>% distinct(scan_id) %>% pull()
scans_needing_wpts <- scan_ids[!(scan_ids %in% gps_key$scan_id)] # not in the Garmin list


## iPad coordinates ------------------------

# Get the scans coordinates from the iPad

# Function formats the scan ID from the path (date_scanNumForThatDay)

# # test function to parse scan ID
# test_fname <- "data/radiometer/raw/2021_Aug_05/PSR-3500_SN1156004_00012.sed"
# test_fname %>% basename() %>% str_split_n("_", 3) %>% str_split_n("\\.", 1)
# test_fname %>% str_extract("2021_[:alpha:]{3}_[:digit:]{2}") %>% ymd() %>% str_remove_all("-")
# # end test

get_scan_id = function(string){
  sed_num <- string %>% basename() %>% str_split_n("_", 3) %>% str_split_n("\\.", 1)
  date <- string %>% str_extract("2021_[:alpha:]{3}_[:digit:]{2}") %>% ymd() %>% str_remove_all("-")
  return(paste(date, sed_num, sep = "_"))
}
# # test
# test_fname %>% get_scan_id()
# # end test

# # test function to parse GPS coords
# test_fname <- here("data/radiometer/raw/2021_Aug_05/PSR-3500_SN1156004_00012.sed")
# 
# read_tsv(test_fname, n_max = 23) %>%
#   separate(`Comment:`, into = c("name", "value"), sep = ": ") %>%
#   pivot_wider() %>%
#   clean_names() %>%
#   select(latitude, longitude) %>%
#   mutate(scan_id = get_scan_id(test_fname),
#          lat = latitude %>% na_if("n/a") %>% parse_number(),
#          lon = longitude %>% na_if("n/a") %>% parse_number(),
#          lon = lon * -1,# add missing negative sign to longitude
#          .keep="unused") 
# # end test

# function to parse header metadata
parse_gps_from_header <- function(fname){
  read_tsv(fname, n_max = 23, show_col_types = FALSE) %>%
    separate(`Comment:`, into = c("name", "value"), sep = ": ") %>%
    pivot_wider() %>%
    clean_names() %>%
    select(latitude, longitude) %>%
    mutate(scan_id = get_scan_id(fname),
           lat = latitude %>% na_if("n/a") %>% parse_number(),
           lon = longitude %>% na_if("n/a") %>% parse_number(),
           lon = lon * -1, # add missing negative sign to longitude
           .keep="unused")
}
# parse_gps_from_header(test_fname) # test

spec_meta <- dir_ls(here("data/radiometer/raw"), recurse = TRUE, regexp = ".sed$") %>% # SLOW
  map_df(parse_gps_from_header) 

wpts_from_ipad <- spec_meta %>% 
  relocate(scan_id) %>% 
  arrange(scan_id) %>% 
  drop_na() %>% 
  filter(scan_id %in% scans_needing_wpts) # only the scans without the more accurate Garmin waypoint


## join waypoints to data --------------

all_wpts <- bind_rows(gps_key, wpts_from_ipad)




# export ------------------------------
rad_as_planet_band %>% 
  inner_join(all_wpts) %>% # scans without wpts no use to me
  write_csv(here("data/radiometer/transect_as_planet.csv"))
