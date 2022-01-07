r_micron <- 10 # proportional
cellcount <- 3.5e9 # proportional
sample_vol_ul <- 130000 # inversely proportional

r_mm <- r_micron/1000
v_per_cell <- 4/3 *pi* r_mm^3
biovol_per_sample <- cellcount * v_per_cell
sample_vol_l <- sample_vol_ul/1e6
biovol_per_l <- biovol_per_sample / sample_vol_l
biovol_per_l

# V = (4/3 pi r^3), if r = 10 -> 4200 um3 per cell or 4.3e-6 mm3/cell, times 3.5e9 cells = 15050 mm3 per 0.124L sample = 1.2e5 mm3/L, thats 4 mags higher than Lutz et al.
