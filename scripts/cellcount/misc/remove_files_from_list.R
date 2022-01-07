# remove files in list from dir
library(tidyverse)
library(fs)
library(here)

all <- dir_ls(here("photos/cell_count_photos/2_redo_counts_w_high_se/1_all/")) 
zero <- dir_ls(here("photos/cell_count_photos/2_redo_counts_w_high_se/zero/"))

nonzero <- basename(all)[!(basename(all) %in% basename(zero))]
# check
all %>% length()
zero %>% length()
nonzero %>% length()

# copy the nonzero files to new dir 
old <- dirname(all)[1] %>% 
  str_c("/", nonzero)
new_dir <- here("photos/cell_count_photos/2_redo_counts_w_high_se/2_nonzero/")
for(f in old){
  file_move(f, new_dir)
}
