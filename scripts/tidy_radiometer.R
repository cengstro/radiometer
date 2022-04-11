# wrangle radiometer data

library(tidyverse)
library(here)
library(fs)
library(janitor)
library(lubridate)

# Read in data -------------------------------------------------------

sed_paths <- dir_ls(here("data/radiometer/raw/"), recurse = TRUE, regexp = ".sed$")

raw_spec <- sed_paths %>% # SLOW
  map_df(~read_tsv(.x, skip = 26, show_col_types = FALSE, id = "filename"))
glimpse(raw_spec) # There seem to be two different names for the ratio

# representative plot
raw_spec %>% 
  filter(filename %in% sed_paths[1]) %>% 
  clean_names() %>% 
  pivot_longer(cols = c(rad_ref, rad_target, tgt_ref_percent)) %>% 
  ggplot(aes(x = wvl, y = value)) +
  geom_line() +
  facet_wrap(vars(name), ncol = 1, scales = "free")


# wrangle ------------------------------------------------------------

## check for NAs, deal w duplicate cols -------------------------------------------
spec_clean_names <- raw_spec %>% clean_names() # for convenience

spec_clean_names %>% 
  filter(!is.na(tgt_ref_percent)) %>%
  glimpse()

spec_clean_names %>% 
  filter(!is.na(reflect_percent)) %>%
  glimpse()
# Reflect. % is missing the original values, 

# do any have the ref or tgt values?
spec_clean_names %>% 
  filter(!is.na(reflect_percent)) %>% 
  drop_na(rad_ref, rad_target)
# yes, most do-- only a few scans missing critical data

spec_clean_names %>% 
  filter(!is.na(reflect_percent)) %>% 
  count(filename) %>% 
  mutate(filename = str_split_i(filename, "/", 11)) %>% 
  distinct(filename)
# all from July 30 -- must be the transects

# can I compute albedo from the ratio values?
test <- spec_clean_names %>%
  filter(filename == sed_paths[22])
test %>% summarise(albedo1 = sum(rad_target)/sum(rad_ref))
test %>% summarise(albedo2 = mean(tgt_ref_percent))

# I don't think so, exclude these
spec_dropped_na <- spec_clean_names %>% 
  drop_na(rad_ref, rad_target) %>% 
  # recompute the tgt ref ratio, in case the precomputed vals gave two cols
  mutate(tgt_ref_ratio = rad_target/rad_ref)

spec_dropped_na %>% slice_sample(n=100)
spec_dropped_na %>% filter(!reflect_percent %>% is.na()) %>% slice_sample(n=100)

# its safe to drop scotts pre-computed ratio values for simplicity
spec_select <- spec_dropped_na %>% 
  select(-tgt_ref_percent, -reflect_percent)
spec_select

# create a unique 'scan id' from each filename, containing the date and scan # for that day ----------------------------

# # test
# test <- sed_paths[40]
# test %>% basename() %>% str_split_n("_", 3) %>% str_split_n("\\.", 1) # parse the scan_id
# test %>% str_extract("2021_[:alpha:]{3}_[:digit:]{2}") %>% ymd() %>% str_remove_all("-") # parse date
# # end test

get_scan_id = function(string){
  sed_num <- basename(string) %>% str_split_i("_",3) %>% str_split_i("\\.", 1)
  date <- string %>% str_extract("2021_[:alpha:]{3}_[:digit:]{2}") %>% ymd() %>% str_remove_all("-")
  return(paste(date, sed_num, sep = "_"))
}
# test %>% get_scan_id()

spec_named <- spec_select %>% ## SLOW
  mutate(scan_id = filename %>% get_scan_id(), .keep="unused", .before=1) %>% 
  arrange(scan_id) # for convenience
spec_named


# remove impossible values ----------------------------------------------------

spec_lt_1 <- spec_named %>% 
  filter(tgt_ref_ratio<1)

# remove incomplete scans
incomplete_scan_ids <- spec_lt_1 %>% 
  count(scan_id) %>% 
  filter(n<max(n)) %>% 
  pull(scan_id)

spec_complete <- spec_lt_1 %>% 
  filter(!(scan_id %in% incomplete_scan_ids))



# check n scans per date -------------------------------------------

# N scans per date
spec_date <- spec_complete %>% 
  mutate(date = scan_id %>% str_split_i("_",1) %>% as_date())

spec_date %>% 
  distinct(scan_id, date) %>% 
  count(date)

# plot scans for each date -------------------------------
# sample 10 for clarity
set.seed(123)
spec_date %>% 
  nest_by(scan_id, date) %>%
  group_by(date) %>%
  slice_sample(n=10) %>%
  unnest() %>%
  ggplot(aes(x = wvl, y = tgt_ref_ratio)) +
  geom_line(aes(group = scan_id), alpha = 0.4) +
  facet_wrap(vars(date), ncol = 1)
# wiggly on Tricouni sampling date (aug 3)

## plot all scans, coloured by time of day, facet by date ---------

# Figure out the wiggles
set.seed(234)
w_num <- spec_date %>% 
  mutate(num = str_split_i(scan_id, "_", 2)%>% as.numeric()) 
w_num%>% group_by(date)%>% distinct(num)
w_num %>%
  nest_by(scan_id, date) %>%
  group_by(date) %>%
  slice_sample(n=40) %>% # sample n per date for easier plotting
  unnest() %>%
  ggplot(aes(x = wvl, y = tgt_ref_ratio, color = num)) +
  geom_line(aes(group = scan_id), alpha = 0.4) +
  facet_grid(rows = vars(date), scales = "free") +
  xlim(350, 700) +
  scale_color_viridis_c()+
  theme_dark()




# check out just the sample data
epi <- read_csv(here("data/field_sample_meta/tidy_epicollect.csv"))

sample_scans <- epi %>% 
  filter(container_type == "ziploc") %>% # cell abundance samples
  select(sample_id, scan_id) %>% 
  left_join(spec_date) %>% 
  relocate(date, .before = 1)
sample_scans %>% 
  drop_na(date) %>% 
  ggplot(aes(x = wvl, y = tgt_ref_ratio)) +
  geom_line(aes(group = scan_id), alpha = 0.4) +
  facet_wrap(vars(date), ncol = 1)

sample_scans %>% 
  drop_na(date) %>% 
  ggplot(aes(x = wvl, y = rad_ref)) +
  geom_line(aes(group = scan_id), alpha = 0.4) +
  facet_wrap(vars(date), ncol = 1)
# there are two distinct levels of solar radiation, probably due to cloud cover that day

sample_scans %>% 
  filter(wvl==500) %>% 
  filter(date=="2021-08-03") %>% 
  ggplot(aes(rad_ref)) +
  geom_histogram()




sample_scans %>% 
  drop_na(date) %>% 
  ggplot(aes(x = wvl, y = rad_target)) +
  geom_line(aes(group = scan_id), alpha = 0.4) +
  facet_wrap(vars(date), ncol = 1)



sample_scans %>% 
  drop_na(date) %>% 
  filter(wvl<1750) %>%
  ggplot(aes(x = wvl, y = tgt_ref_ratio)) +
  geom_line(aes(group = scan_id), alpha = 0.4) +
  facet_wrap(vars(date), ncol = 1) +
  scale_x_continuous(minor_breaks = seq(300 , 1800, 100), breaks = seq(300, 1800, 200))
# some minor noise (higher frequency oscillation) in the water bands at 900, 1100
# the 1350 feature is shown as a slight "knee" in the spectral albedo curve for snow, is more pronounced for algae?

# the RF conversion will take into account atmospheric transmission

spec_final <- spec_date %>% 
  filter(wvl<1750)

# comparing down and upwelling radiance
set.seed(148)
sample_scans %>% 
  nest_by(sample_id) %>% 
  ungroup() %>% 
  slice_sample(n=1) %>% 
  unnest(cols = c(data)) %>% 
  pivot_longer(cols = c(rad_ref, rad_target)) %>% 
  ggplot(aes(y = value, x = wvl, color = name)) +
  geom_line() +
  scale_x_continuous(minor_breaks = seq(300 , 2500, 100), breaks = seq(300, 2500, 200))

# is there much variance in reflected radiance >1350 nm ?
sample_scans %>% 
  ggplot(aes(x = wvl, y = rad_target)) +
  geom_line(aes(group = scan_id)) 
# no

# since the incoming radiation is near 0, this explains the (noisy) high spectral albedo values around 1300 and 1900
# misleading to show since it won't affect albedo or bands, so only show up to 1350, and plot the SWIR (used in NDSI) in supp

# check out SWIR1 band
sample_scans %>% 
  drop_na(date) %>% 
  filter(wvl>1550, wvl<1650) %>%
  ggplot(aes(x = wvl, y = tgt_ref_ratio)) +
  geom_line(aes(group = scan_id), alpha = 0.4) +
  facet_wrap(vars(date), ncol = 1) +
  scale_x_continuous(minor_breaks = seq(300 , 1800, 100), breaks = seq(300, 1800, 200))+
  ggtitle("SWIR 1 band")
# near zero, as expected for snow





# write out separate files for sample, pit, and transect scans ------------------------

sample_scans %>%
  write_csv(here("data/radiometer/sample_scans.csv"))

epi %>% 
  filter(container_type == "falcon") %>% # pit samples
  select(sample_id, scan_id) %>% 
  left_join(spec_final) %>% 
  relocate(date, .before = 1) %>%
  write_csv(here("data/radiometer/pit_scans.csv"))

# Misc scans: (not part of "transects")
# 20210803_00106 is a scan over pool of water
# 20210805_00084 (gps #164) is a red scan close to ground
# 20210805_00120, 20210805_00121, 20210805_00122 are scans of orange boot track

not_in_transect <- c("20210803_00106", "20210805_00084", "20210805_00120", "20210805_00121", "20210805_00122")
                
spec_final %>% 
  filter(!(scan_id %in% epi$scan_id)) %>% 
  filter(!(scan_id %in% not_in_transect)) %>% # remove misc scans that are not part of the transect
  write_csv(here("data/radiometer/transect_scans.csv"))


# 
# # scratch ---------------
# 
# wwindow2 <- c(1301, 1500)
# wwindow3 <- c(1801, 2100)
# wwindow4 <- c(2401, 2500)
# 
# spec_final <-
#   spec_date %>% 
#   filter(#!between(wvl, wwindow1[1], wwindow1[2]),
#     !between(wvl, wwindow2[1], wwindow2[2]),
#     !between(wvl, wwindow3[1], wwindow3[2]),
#     !between(wvl, wwindow4[1], wwindow4[2])) %>% 
#   # add NAs for plotting
#   mutate(across(rad_ref:tgt_ref_ratio, ~ifelse(wvl %in% c(1300, 1800, 2400), NA, .x))) # use base ifelse instead of if_else to avoid type check
# check
# set.seed(1234)
# spec_no_water %>% 
#   nest_by(scan_id, date) %>% 
#   group_by(date) %>% 
#   slice_sample(n=10) %>% 
#   unnest(cols = c(data)) %>% 
#   ggplot(aes(x = wvl, y = tgt_ref_ratio)) +
#   geom_point() +
#   facet_wrap(vars(date), ncol = 1)
