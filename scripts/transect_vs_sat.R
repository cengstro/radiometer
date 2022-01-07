# plot transect scans over basemap

# https://ourcodingclub.github.io/tutorials/spatial/#section1
library(tidyverse)
library(here)

scan <- read_csv(here("data/radiometer/transect_as_planet.csv"))

library(raster)
path <- here("data/geotiffs/files/20210804_191358_88_2403_3B_AnalyticMS_SR_clip.tif")
my_brick <- brick(path)
b1 <- raster(path, band=1) %>% as.data.frame()
b2 <- raster(path, band=2)
b3 <- raster(path, band=3)
b4 <- raster(path, band=4)

myRGB <- stack(list(b3, b2, b1))              # creates raster stack
plotRGB(myRGB, axes = TRUE, stretch = "hist", main = "Sentinel RGB colour composite")

VI <- function(img, k, i) {
  bk <- img[[k]]
  bi <- img[[i]]
  vi <- (bk - bi) / (bk + bi)
  return(vi)
}
ndvi <- VI(my_brick, 4, 3)
rgnd <- VI(my_brick, 3,2)

plot(ndvi)
plot(rgnd)



scan_nd <- scan %>% 
  mutate(ndvi = (nir-red)/(nir+red),
         rgnd = (red-green)/(red+green), .keep = "unused") %>% 
  dplyr::select(-blue)

library(sp)
library(rgdal)

coordinates(scan_nd) <- c("lon", "lat")
proj4string(scan_nd) <- CRS("+proj=longlat +datum=WGS84")  ## for example

res <- spTransform(scan_nd, CRS("+proj=utm +zone=10 ellps=WGS84"))
# back to tibble, this time in UTM zome 10
scan_nd2 <- res %>% 
  as_tibble()


ndvi %>% 
  as("SpatialPixelsDataFrame") %>% 
  as_tibble() %>% 
  ggplot(aes(x=x, y=y)) +
  geom_tile(aes(fill=layer)) +
  scale_fill_gradient(low = "white", high = "green", limits = c(-0.2,0)) +
  geom_point(data = scan_nd2, aes(x=lon, y = lat, fill = ndvi), color = "black", shape = 21) +
  lims(x = c(482600,483200), y = c(5539200, 5539800))

rgnd %>% 
  as("SpatialPixelsDataFrame") %>% 
  as_tibble() %>% 
  ggplot(aes(x=x, y=y, fill=layer)) +
  geom_tile() +
  scale_fill_gradient(low = "white", high = "red", limits = c(0,0.1)) +
  geom_point(data = scan_nd2, aes(x=lon, y = lat, fill = rgnd), color = "black", shape = 21) +
  lims(x = c(482600,483200), y = c(5539200, 5539800))

