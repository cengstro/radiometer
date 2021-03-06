
<!-- README.md is generated from README.Rmd. Please edit that file -->

# Supplementary scripts for manuscript ‘Seasonal dynamics and radiative forcing of red snow algal blooms in British Columbia, Canada’

<!-- badges: start -->
<!-- badges: end -->

This repository contains all data and R code used for Engstrom et al.,
2022. Google Earth Engine code can be accessed at
<https://code.earthengine.google.com/?accept_repo=users/caseyengstrom/radiometer>

## `data/`

-   `biomass/` contains the total organic carbon (TOC) and total
    nitrogen (TN) measurements
-   `cellcount/` contains the hemocytometer snow algae cell count data
    -   All samples were counted in duplicate in `round1/`, only red
        snow samples were counted an additional two times in `round2/`
    -   The final results are stored in `final_cell.csv`
-   `field_sample_meta/` contains the coordinates for all field samples,
    used to generate Supplementary Table 1
-   `google_earth_engine/` contains all data downloaded from Google
    Earth Engine, including RGND time series
    -   `custom_polygon/`, `glimsGeom/`, and `modis_grid_cells/` contain
        the RGND times series computed for the Bloom Polygon, Whole
        Glacier Polygon, and smaller MODIS polygon respectively
        -   `cat*` refers to Catamount Glacier, `vowell*` refers to
            Vowell Glacier
        -   `*aqua` refers to MODIS Aqua, `*aquaSnow` refers to MODIS
            Aqua Snow Albedo (MYD10A1.006), `*l8` is Landsat-8 C2T1,
            `*s2` is Sentinel-2 L2A, `*terra` is MODIS/Terra, and
            `*terraSnow` refers to MODIS/Terra Snow Albedo (MOD10A1.006)
    -   `hist` contains a histogram of RGND values for the Bloom Polygon
        from Sentinel-2 images acquired at “peak bloom” on July 28, 2020
    -   `wx` contains the weather data used to generate Supp. Figure S12
-   `radiometer` contains the spectral reflectance data from field scans
    of snow in the Coast Range near Whistler, BC.
    -   raw `*.sed` files are contained in `raw/`.
    -   convolved multispectral in `as_l8.csv`, `as_s2.csv`,
        `as_terra.csv`
    -   convolved broadband albedo in
        `as_bb_albedo.csv`,`as_nir_albedo.csv`, `as_viz_albedo.csv`
-   `radiometer_wpts/` contains the waypoints for all radiometer scans,
    and the key `gps_sed_final_key.csv` to match scan ID with waypoint
-   `satellite_rsr/` contains the Relative Response Functions used for
    hyperspectral to multispectral conversion

## `scripts/`

-   `albedo_regression.Rmd` contains the script used to generate Fig 3
    and Fig S7: albedo as a function of algae, and RGND
-   `algae_abundance_regressions.Rmd` contains the script used to
    generate Fig 2 and Fig. S8: RGND vs algae, RGND vs TOC, etc
-   `catamount_transect_meta_table.R` generated Table S1B
-   `cellcount/`
    -   `0_cellcount.ijm` ImageJ macro used to identify and quantify
        snow algae cells in photomicrographs
    -   scripts 1-3 used to generate `final_cell.csv`
-   `convolve_sample_scans.R` used to convert from hyperspectral to
    multispectral, and spline smooth to generate Supp Fig S4
-   `satellites.Rmd` used to analyse all Google Earth Engine data
-   `scan_qc.R` used to QC radiometer data, generating Supp Fig. S5
-   `tidy_biomass.Rmd` used to tidy the TOC and TN measurements,
    generating `data/biomass/tidy_biomass.csv` used in
    `algae_abundance_regressions.Rmd`
-   `tidy_eipcollect.Rmd` wrangle the field sample metadata, lat lon etc
-   `tidy_radiometer.R` combine the `.sed$` files into single dataframe,
    saved in `data/radiometer/sample_scans.csv`

## 

## To do following publication:

-   add DOI to readme
