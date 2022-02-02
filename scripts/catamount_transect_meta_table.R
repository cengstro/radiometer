library(tidyverse)
library(jsonlite)
library(here)
library(listviewer)
library(lubridate)

path <- here("data/field_sample_meta/catamount_transect_wpts.geojson") # downloaded from gaia
j <- read_json(path)

# check out list structure
jsonedit(j)
j$features[[1]]$properties$latitude 
j$features[[1]]$properties$longitude
j$features[[1]]$properties$title # sample_id
j$features[[1]]$properties$time_created



x <- j$features %>% 
  as_tibble_col() 
x[[1]]

# first attempt
tbl <- x %>% 
  unnest_wider(value) %>% # expand the first level
  unnest_longer(properties) %>% # second level
  filter(properties_id %in% c("title", "time_created", "longitude", "latitude")) %>% 
  pivot_wider(names_from = properties_id, values_from = properties) %>% 
  select(-type, -geometry, -id) %>% 
  unnest(cols = c(title, latitude, longitude, time_created)) %>% 
  relocate(title) %>% 
  mutate(sample_id = paste0("cat", parse_number(title) %>% str_pad(width = 2, side="left", pad="0")), 
         .keep="unused", .before = 1) %>% 
  arrange(sample_id)

asdf <- tbl %>%
  mutate(datetime = parse_date_time(time_created, "ymd HMS"), .keep = "unused") %>% 
  kbl(caption = "B. Catamount Glacier transect samples", col.names = c("Sample ID", "Latitude", "Longitude", "Date/Time (PST)")) %>% 
  kable_classic(full_width = F, html_font = "Cambria")

asdf %>% save_kable(file = here("figs/cat_sample_table.pdf"))
