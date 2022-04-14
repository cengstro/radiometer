// This script was written for use in the Google Earth Code Editor, 
// and can be run interactively at 
// https://code.earthengine.google.com/70020ffa134909bb0aa085308b8e9d1c


var s2 = ee.ImageCollection("COPERNICUS/S2_SR"),
l8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2"),
terra = ee.ImageCollection("MODIS/006/MOD09GA"),
terra8 = ee.ImageCollection("MODIS/006/MOD09A1"),
aqua = ee.ImageCollection("MODIS/006/MYD09GA"),
aqua8 = ee.ImageCollection("MODIS/006/MYD09A1"),
snowTerra = ee.ImageCollection("MODIS/006/MOD10A1"),
snowAqua = ee.ImageCollection("MODIS/006/MYD10A1"),
vowell = 
  /* color: #ffc82d */
  /* shown: false */
  ee.Geometry.Polygon(
    [[[-116.79880300107439, 50.75595069112274],
      [-116.81279340329607, 50.75453890543759],
      [-116.82120481076677, 50.751280775942085],
      [-116.8141666943117, 50.750140377039784],
      [-116.81699910703142, 50.748185342857205],
      [-116.81373754086931, 50.74682763219406],
      [-116.81588330808123, 50.74519832742392],
      [-116.81124845090349, 50.74394915536838],
      [-116.80772939267595, 50.743297400196276],
      [-116.80687108579119, 50.74346033983982],
      [-116.80575528684099, 50.744926771116404],
      [-116.80146375241716, 50.7441664050764],
      [-116.79631391110857, 50.746556085336515],
      [-116.79150739255388, 50.75193241998421],
      [-116.798373847632, 50.751823813273816]]]),
vowell_box = 
  /* color: #00ffff */
  /* shown: false */
  /* displayProperties: [
    {
      "type": "rectangle"
    }
  ] */
  ee.Geometry.Polygon(
    [[[-116.84108654622537, 50.77373623116654],
      [-116.84108654622537, 50.727821634223275],
      [-116.76672057422282, 50.727821634223275],
      [-116.76672057422282, 50.77373623116654]]], null, false),
cat = 
  /* color: #0b4a8b */
  /* shown: false */
  ee.Geometry.Polygon(
    [[[-116.56182569019492, 50.6500034950043],
      [-116.56766217701133, 50.64744561706738],
      [-116.56663220874961, 50.64515973597682],
      [-116.56276982776816, 50.64477874498302],
      [-116.56577390186484, 50.63911794346386],
      [-116.57418530933555, 50.630571018655814],
      [-116.56697553150352, 50.62202253971184],
      [-116.56165402881797, 50.62621530001997],
      [-116.56328481189902, 50.63231319312266],
      [-116.55607503406699, 50.63661390989703],
      [-116.5535001134127, 50.644452178815314],
      [-116.5575341557711, 50.64532301688565]]]),
cat_box = 
  /* color: #bf04c2 */
  /* shown: false */
  /* displayProperties: [
    {
      "type": "rectangle"
    }
  ] */
  ee.Geometry.Polygon(
    [[[-116.6045080823347, 50.660003844449186],
      [-116.6045080823347, 50.61405946140546],
      [-116.53000704473705, 50.61405946140546],
      [-116.53000704473705, 50.660003844449186]]], null, false),
l8_20200818_mask = 
  /* color: #d63000 */
  /* shown: false */
  ee.FeatureCollection(
    [ee.Feature(
      ee.Geometry.Polygon(
        [[[-116.53838702706744, 50.657562131176185],
          [-116.60258838204791, 50.657562131176185],
          [-116.602245059294, 50.61189430207776],
          [-116.53838702706744, 50.61167643922444],
          [-116.5389020111983, 50.61548889349229],
          [-116.5488077264527, 50.61734411968515],
          [-116.55081754351711, 50.61963471527149],
          [-116.55312114390586, 50.622799880053606],
          [-116.55481076916851, 50.625971809042355],
          [-116.55750365817848, 50.625890229228084],
          [-116.56117339587354, 50.62659801424557],
          [-116.5645653870528, 50.62779556531603],
          [-116.5660245087569, 50.62877560425238],
          [-116.56658255879432, 50.63027283421941],
          [-116.56508037118365, 50.631661155823],
          [-116.56190466543111, 50.6315795088464],
          [-116.56061717538287, 50.63291332120986],
          [-116.56259128121783, 50.63737729159706],
          [-116.5608746674483, 50.640425613122524],
          [-116.56027385262897, 50.640643342808715],
          [-116.55932971505572, 50.64113323091449],
          [-116.5579564240401, 50.64156868272138],
          [-116.5576131012862, 50.64167754504262],
          [-116.55666896371295, 50.64249400441374],
          [-116.55563899545123, 50.64287501393246],
          [-116.55486651925494, 50.6430383027805],
          [-116.54319354562213, 50.64401802395326],
          [-116.53873034982135, 50.64412688060041]]]),
      {
        "a": 1,
        "system:index": "0"
      })]),
vowellModis = /* color: #98ff00 */ee.Geometry.Polygon(
  [[[-116.8145100170656, 50.74365043537397],
    [-116.80086293759783, 50.74256416478366],
    [-116.7980305248781, 50.75559774869378],
    [-116.80472531857927, 50.75614073594362],
    [-116.80558362546404, 50.751850964975034],
    [-116.818544059424, 50.75293702010948],
    [-116.81974568906267, 50.752991322204764],
    [-116.82060399594744, 50.7487012625853],
    [-116.81356587949236, 50.748049573562724]]]),
catModis = /* color: #0b4a8b */ee.Geometry.Polygon(
  [[[-116.56459493053548, 50.640950263435315],
    [-116.56553906810872, 50.636432195253406],
    [-116.57249135387532, 50.63703100034064],
    [-116.57343549144856, 50.63283920452362],
    [-116.57446545971028, 50.6283748031519],
    [-116.56716985118977, 50.627775887790456],
    [-116.56823558025833, 50.623356380025236],
    [-116.56128329449173, 50.62270294769792],
    [-116.55965251141068, 50.6315235180261],
    [-116.55690592937943, 50.64475127100488],
    [-116.56342906170364, 50.64540439691338]]]),
daymet = ee.ImageCollection("NASA/ORNL/DAYMET_V4"),
glaciers = ee.FeatureCollection("GLIMS/current"),
geometry = 
  /* color: #d63000 */
  /* shown: false */
  ee.Geometry.Polygon(
    [[[-116.82772794309099, 50.75146167748639],
      [-116.82051816525896, 50.74782317892207],
      [-116.81502500119646, 50.74318877345226],
      [-116.81957402768572, 50.73612749453451],
      [-116.80506864133318, 50.73373728203189],
      [-116.81184926572283, 50.73102098339879],
      [-116.80687108579119, 50.72819586572771],
      [-116.80189290585955, 50.729499787361604],
      [-116.7969147259279, 50.72933679914209],
      [-116.79348149838884, 50.73308538472522],
      [-116.79004827084978, 50.73319403490639],
      [-116.78481259885271, 50.73580156364847],
      [-116.78498426022966, 50.73775711494263],
      [-116.78927579465349, 50.73835462821833],
      [-116.7899624401613, 50.74041870633341],
      [-116.79519811215837, 50.74117913323245],
      [-116.79648557248552, 50.743677591815846],
      [-116.79665723386248, 50.74731641256873],
      [-116.79262319150408, 50.75062912282833],
      [-116.80077710690935, 50.746447466152496],
      [-116.80695691647966, 50.74362327891633],
      [-116.80824437680681, 50.74590436645245],
      [-116.81313672604998, 50.744763836575935],
      [-116.81124845090349, 50.74720779514867],
      [-116.80103459897478, 50.75214963264899],
      [-116.79983296933611, 50.75350718896777],
      [-116.82086148801287, 50.75138938391241]]]);

// Compare RGND algae abundance and albedo between platforms at two sites in Purcells
// Field visits to Vowell bloom on 2020-07-29, Catamount on 2020-08-10

var palettes = require('users/gena/packages:palettes');
// print(vowellModis.area(), catModis.area())
// filtering params
var ccMax = 40 // max cloud cover param for filtering collections
var minPix = 5
var maxMasked = 0.4 // for modis

var vowellFeat = glaciers.filter(ee.Filter.eq('glac_name', 'Vowell Glacier')).first()
var catFeat = glaciers.filter(ee.Filter.eq('glac_name', 'Catamount Glacier')).first()
// print(vowellFeat, catFeat)
var vowellGlimsGeom = vowellFeat.geometry()
var catGlimsGeom = catFeat.geometry()
// print(vowellGlimsGeom, catGlimsGeom)
// Map.addLayer(glaciers)
// print('bloom polygon area', vowell.area(), cat.area())

// Filter the image collections --------------------------------------
  
  
  
  // todo: merge geoms rather than using feats
var mySites = ee.FeatureCollection([cat,vowell])
// print(mySites)
var mySitesGeom = mySites.geometry()
// print(mySitesGeom)

var myFilter = function(col, geom, date){
  return col
  .filterBounds(mySitesGeom)
  .filter(ee.Filter.calendarRange(2020, 2020,'year'))
  .filter(ee.Filter.calendarRange(6,9,'month'))
}
s2 = myFilter(s2, mySitesGeom)
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', ccMax))
l8 = myFilter(l8, mySitesGeom)
.filter(ee.Filter.lt('CLOUD_COVER', ccMax))
.sort('system:time_start')
terra = myFilter(terra, mySitesGeom)
terra8 = myFilter(terra8, mySitesGeom)
aqua = myFilter(aqua, mySitesGeom)
aqua8 = myFilter(aqua8, mySitesGeom)
snowTerra = myFilter(snowTerra, mySitesGeom)
snowAqua = myFilter(snowAqua, mySitesGeom)
// print(s2.size(),l8.size(), terra.size(), terra8.size(),
         //       aqua.size(), aqua8.size(), snowTerra.size(), snowAqua.size())

daymet = myFilter(daymet, mySitesGeom)


// Add RGND band -------------------------
  
  var addBands = function(g, r, nir, swir, greenthresh){
    var wrap = function(image){
      // var ndvi = image.normalizedDifference([nir, r])
      
      var rgnd = image.normalizedDifference([r, g]).max(0)// set negative RGND to 0
      
      var isSnow = image.select(g).gt(greenthresh)
      // set negative rgnd values to 0
      var rgndMask = rgnd.gt(0) // image with rgnd<0 set to 0
      rgnd = rgnd.multiply(rgndMask) // negative values multiplied by 0, positive vals multiply by 1
      .multiply(isSnow)
      // var ndsi = image.normalizedDifference([r, swir])
      // var ngnd = image.normalizedDifference([nir, g])
      return image
      // .addBands(ndvi.rename('NDVI'))
      .addBands(rgnd.rename('RGND'))
      // .addBands(gswd.rename('GSWD'))
      .addBands(isSnow.rename('isSnow'))
      // .addBands(ndsi.rename('NDSI'))
      // .addBands(ngnd.rename('NGND'))
    }
    return wrap
  }


s2 = s2.map(addBands('B3', 'B4', 'B8', 'B11', 5000)) // where B3>5000 is used to mask bare ice 
// print(s2.first().bandNames()) //test
l8 = l8.map(addBands('SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 22000))
// print(l8) //test
// Map.addLayer(terra.first())
terra = terra
.map(addBands('sur_refl_b04', 'sur_refl_b01', 'sur_refl_b02', 'sur_refl_b06', 4000))
// print(terra.first().bandNames()) //test
// Map.addLayer(terra.first()) // test, should see many pixels are masked
terra8 = terra8
.map(addBands('sur_refl_b04', 'sur_refl_b01', 'sur_refl_b02', 'sur_refl_b06', 4000))
// print(terra8.first())
aqua = aqua
.map(addBands('sur_refl_b04', 'sur_refl_b01', 'sur_refl_b02', 'sur_refl_b06', 4000))
aqua8 = aqua8
.map(addBands('sur_refl_b04', 'sur_refl_b01', 'sur_refl_b02', 'sur_refl_b06', 4000))



// mask albedo ----------------------------------
  
  
  var maskAlbedo = function(i){
    var albedo = i.select('Snow_Albedo_Daily_Tile').divide(100) // scale out of 1
    var mask = albedo.gt(0)
    
    return i
    .addBands(mask.rename('MASK'))
    .addBands(albedo.rename('ALBEDO'))
    .reproject('EPSG:3005', null, 500)
  }

snowTerra = snowTerra.map(maskAlbedo)
snowAqua = snowAqua.map(maskAlbedo)
// Map.addLayer(snowTerra.filterDate('2020-07-02').first())
// Map.addLayer(snowTerra.filterDate('2020-08-01').first())

// reproject modis 8 day product to equal area projection (BC albers)
terra8 = terra8.map(function(i){return i.reproject('EPSG:3005', null, 500)})
aqua8 = aqua8.map(function(i){return i.reproject('EPSG:3005', null, 500)})









// cloudmask ------------------------------------------------------------------
  
  
  s2 = s2.map(function(i){
    var sclMask = i.select('SCL').neq(1)
    var mask = i.select('MSK_CLDPRB').lt(80)
    var rgndMasked = i.select('RGND').updateMask(mask).updateMask(sclMask)
    return i
    .addBands(mask.rename('CLOUD_MASK'))
    .addBands(rgndMasked.rename('RGND_CLOUDMASKED')) // cloudmask rgnd for reporting
  })


l8 = l8.map(function(image) {
  // Bits 3 and 4 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = (1 << 3);
  var cloudsBitMask = (1 << 4);
  // Get the pixel QA band.
  var qa = image.select('QA_PIXEL');
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
  .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
  var rgndMasked = image.select('RGND').updateMask(mask)
  return image
  .addBands(mask.rename('CLOUD_MASK')) //used for the masked frac in ROI function
  .addBands(rgndMasked.rename('RGND_CLOUDMASKED')) // this is wildly off, don't use this for the final output
})


var bitwiseExtract = function(value, fromBit, toBit) {
  if (toBit === undefined) toBit = fromBit
  var maskSize = ee.Number(1).add(toBit).subtract(fromBit)
  var mask = ee.Number(1).leftShift(maskSize).subtract(1)
  return value.rightShift(fromBit).bitwiseAnd(mask)
}

var maskModis = function(image){
  var qa = image.select('state_1km')
  var cloudState = bitwiseExtract(qa, 0, 1).rename('cloudState')
  var cloudShadowState = bitwiseExtract(qa, 2,2).rename('cloudShadowState')
  var aerosolState = bitwiseExtract(qa, 6, 7).rename('aerosolState')
  var cirrusState = bitwiseExtract(qa, 8, 9).rename('cirrusState')
  var snowState = bitwiseExtract(qa, 15).rename('snowState')
  var qaMask = cloudState.eq(0) // not cloudy
    .and(cloudShadowState.eq(0)) // not cloud shadow
    .and(aerosolState.neq(3)) // not high aerosol
    .and(cirrusState.neq(3)) // not high cirrus

  var qc = image.select('QC_500m')
  var qcState1 = bitwiseExtract(qc, 2, 5).rename('b1QC')   // b1
  var qcState2 = bitwiseExtract(qc, 6, 9).rename('b2QC')   // b2
  var qcState3 = bitwiseExtract(qc, 10, 13).rename('b3QC') // b3
  var qcState4 = bitwiseExtract(qc, 14, 17).rename('b4QC') // b4
  var qcMask = qcState1.eq(0) // b1 ideal quality
    .and(qcState2.eq(0))      // b2 ideal quality
    .and(qcState3.eq(0))      // b3 " "
    .and(qcState4.eq(0))      // b4 ideal quality
  
  var rgndMasked = image.select('RGND').updateMask(qaMask)
    
  return image
    .addBands(qaMask.rename('CLOUD_MASK')) // used for the masked frac in ROI function
    .addBands(qcMask.rename('QC_MASK'))
    .addBands(rgndMasked.rename('RGND_CLOUDMASKED'))
    .reproject('EPSG:3005', null, 500) // BC Albers
}

// function to filter image collection based on masked area in ROI
var unmaskedFracInROI = function(myMask, roi, scale) { 
  var wrap = function(image){
    // get the area of the mask
    var mask = image.select(myMask)
    var unmaskedAreaImage = mask
      .multiply(ee.Image.pixelArea()) // each pixel = it's area
.rename('area') // name it so we can extract the named dictionary element

// compute total area of mask in roi
var unmaskedAreaDict = unmaskedAreaImage.reduceRegion({
  reducer: ee.Reducer.sum(), 
  geometry: roi, 
  scale: scale,
  maxPixels: 1e9
})
// extract from dictionary
var unmaskedArea = ee.Number(unmaskedAreaDict.get('area')); 

// express as percent of image area in ROI
var roiArea = ee.Number(roi.area(scale));
var unmaskedFraction = unmaskedArea.divide(roiArea)

return image.set('ROI_UNMASKED_FRACTION', unmaskedFraction);
}
return wrap;
}




// split into seperate collections for Vowell and Catamount --------------------------
  
  
  var s2Vowell = s2
  .filter(ee.Filter.contains('.geo', vowellModis)) // completely contained
  .map(unmaskedFracInROI('CLOUD_MASK', vowellModis, 10))
  .filter(ee.Filter.gt('ROI_UNMASKED_FRACTION', 0.8)) // remove images w high clouds in ROI
  // print(s2Vowell.aggregate_array('ROI_UNMASKED_FRACTION')) // testing
  
  var s2Cat = s2
  .filter(ee.Filter.contains('.geo', catModis)) 
  .map(unmaskedFracInROI('CLOUD_MASK', catModis, 10))
  .filter(ee.Filter.gt('ROI_UNMASKED_FRACTION', 0.8)) 
  // .filter(ee.Filter.date('2020-08-02','2020-08-03').not()) // issues w cloud masking
  // print(s2Cat.aggregate_array('ROI_UNMASKED_FRACTION')) // testing
  
  var l8Vowell = l8
  .filter(ee.Filter.contains('.geo', vowellModis))
  .map(unmaskedFracInROI('CLOUD_MASK', vowellModis, 30))
  .filter(ee.Filter.gt('ROI_UNMASKED_FRACTION', 0.2))
  // print(l8Vowell.aggregate_array('ROI_UNMASKED_FRACTION')) // testing
  
  var l8Cat = l8
  .filter(ee.Filter.contains('.geo', catModis)) 
  .map(unmaskedFracInROI('CLOUD_MASK', catModis, 30))
  .filter(ee.Filter.gt('ROI_UNMASKED_FRACTION', 0.2)) 
  // print(l8Cat.aggregate_array('ROI_UNMASKED_FRACTION')) // testing
  
  
  
  var ss = 100 // error range (in m) of mask area reducer for MODIS
  
  terra = terra.map(maskModis)
  aqua = aqua.map(maskModis)
  var terraVowell = terra
  .map(unmaskedFracInROI('CLOUD_MASK', vowell_box, ss)) // use the region as a whole as representative of cloud cov
  .filter(ee.Filter.gt('ROI_UNMASKED_FRACTION', maxMasked)) 
  // print(vowellTerra.aggregate_array('ROI_UNMASKED_FRACTION')) // testing
  
  var terraCat = terra
  .map(unmaskedFracInROI('CLOUD_MASK', cat_box, ss)) // within the buffer
  .filter(ee.Filter.gt('ROI_UNMASKED_FRACTION', maxMasked)) 
  // print(catTerra.aggregate_array('ROI_UNMASKED_FRACTION')) 
  
  var aquaVowell = aqua
  .map(unmaskedFracInROI('CLOUD_MASK', vowellModis, ss))
  .filter(ee.Filter.gt('ROI_UNMASKED_FRACTION', maxMasked)) 
  // print(vowellAqua.aggregate_array('ROI_UNMASKED_FRACTION')) // testing
  
  var aquaCat = aqua
  .map(unmaskedFracInROI('CLOUD_MASK', catModis, ss))
  .filter(ee.Filter.gt('ROI_UNMASKED_FRACTION', maxMasked)) 
  // print(catAqua.aggregate_array('ROI_UNMASKED_FRACTION')) // testing
  
  
  var snowTerraVowell = snowTerra
  // compute the unmasked area
  .map(unmaskedFracInROI('MASK', vowellModis, ss))
  .filter(ee.Filter.gt('ROI_UNMASKED_FRACTION', maxMasked)) 
  // print(vowellSnowTerra.aggregate_array('ROI_UNMASKED_FRACTION')) // testing
  
  var snowTerraCat = snowTerra
  .map(unmaskedFracInROI('MASK', catModis, ss))
  .filter(ee.Filter.gt('ROI_UNMASKED_FRACTION', maxMasked)) 
  // print(vowellSnowTerra.aggregate_array('ROI_UNMASKED_FRACTION')) // testing
  
  var snowAquaVowell = snowAqua
  .map(unmaskedFracInROI('MASK', vowellModis, ss))
  .filter(ee.Filter.gt('ROI_UNMASKED_FRACTION', maxMasked)) 
  
  var snowAquaCat = snowAqua
  .map(unmaskedFracInROI('MASK', catModis, ss))
  .filter(ee.Filter.gt('ROI_UNMASKED_FRACTION', maxMasked)) 
  
  
  
  
  
  // view charts and images ----------------------------------
    
    var s2RgbVisParam = {
      bands: ['B4', 'B3','B2'],
      min:0,
      max:10000,
      gamma:0.5
    }
  
  var rgndVisParam = {
    bands: ['RGND'],
    palette: ['white', 'red'],
    min:0,
    max:0.05
  }
  
  var rgndMaskedVisParam = {
    bands: ['RGND_CLOUDMASKED'],
    palette: ['white', 'red'],
    min:0,
    max:0.05
  }
  
  var l8RgbVisParam = {
    bands: ['SR_B4', 'SR_B3','SR_B2'],
    min:0,
    max:50000
  }
  
  var modisRgbVisParam = {
    bands: ['sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03'],
    min:0,
    max:12000
  }
  
  var albedoVisParam = {
    bands: ['ALBEDO'],
    palette: ['black', 'white'],
    min:0,
    max:1
  }
  
  var sradVisParam = {
    bands: 'srad', 
    min:0, 
    max:500, 
    palette:palettes.matplotlib.inferno[7]
  }
  
  var isSnowVisParam = {
    bands: 'isSnow',
    palete: ['black', 'white']
  }
  
  // callback for chart click
  function printChart(args){ 
    var col = args.collection
    var roi = args.roi // geometry 
    var visParam1 = args.visParam1 || rgndMaskedVisParam
    var chartBands = args.chartBands || 'RGND_CLOUDMASKED'
    var reducer = args.reducer || ee.Reducer.mean() 
    var myScale = args.myScale || 10
    var title = args.title || 'no title provided'
    
    // nested callback to load images upon chart click 
    function loadLayer(x, y, series) {
      var image = col
      .filterBounds(roi) 
      // select image for clicked date
      .filter(ee.Filter.eq('system:time_start', x)) 
      .first()
      
      Map.layers().reset()
      Map.layers().set(0, ui.Map.Layer(image, visParam1))
      
      if(args.visParam2 !==undefined) {
        Map.layers().set(1, ui.Map.Layer(image, args.visParam2))
      }
      Map.centerObject(roi, 14)
    }
    
    var chart = ui.Chart.image.series({
      imageCollection: col.select(chartBands),
      region: roi,
      reducer: reducer,
      scale: myScale,
      xProperty: 'system:time_start'
    }).setOptions({
      title: title
    })
    
    chart.onClick(loadLayer) // add layers on click
    
    print(chart)
  }
  
  // // check the snow vs ice classification
  // printChart({
    //   collection: s2Vowell,
    //   roi: vowell, 
    //   visParam1: isSnowVisParam,
    //   visParam2: s2RgbVisParam,
    //   title: 'vowell S2'
    // })
  
  printChart({
    collection: s2Vowell,
    roi: vowell, 
    visParam2: s2RgbVisParam,
    title: 'vowell S2'
  })
  // // get pixel counts for each time series
  // printChart({
    //   collection: s2Vowell,
    //   roi: vowell, 
    //   reducer: ee.Reducer.count(),
    //   visParam2: s2RgbVisParam,
    //   title: 'vowell S2'
    // })
  
  printChart({
    collection: s2Cat,
    roi: cat, 
    visParam2: s2RgbVisParam,
    title: 'catamount S2'
  })
  // printChart({
    //   collection: s2Cat,
    //   roi: cat, 
    //   reducer: ee.Reducer.count(),
    //   visParam2: s2RgbVisParam,
    //   title: 'cat S2'
    // })
  // printChart({
    //   collection: l8Vowell,
    //   roi: vowell, 
    //   visParam1: rgndVisParam, 
    //   visParam2: l8RgbVisParam,
    //   chartBands: 'RGND',
    //   title: 'vowell L8'
    // })
  // printChart({
    //   collection: l8Vowell,
    //   roi: vowell, 
    //   reducer: ee.Reducer.count(),
    //   visParam2: l8RgbVisParam,
    //   title: 'vowell l8'
    // })
  // printChart({
    //   collection: l8Cat,
    //   roi: cat, 
    //   visParam1: rgndVisParam, 
    //   visParam2: l8RgbVisParam,
    //   chartBands: 'RGND',
    //   title: 'catamount L8'
    // })
  // printChart({
    //   collection: l8Cat,
    //   roi: cat, 
    //   reducer: ee.Reducer.count(),
    //   visParam2: l8RgbVisParam,
    //   title: 'cat l8'
    // })
  
  
  
  printChart({
    collection: terraVowell,
    roi: vowell, 
    visParam2: modisRgbVisParam,
    title: 'Terra Vowell'
  })
  // printChart({
    //   collection: terraVowell,
    //   roi: vowell, 
    //   reducer: ee.Reducer.count(),
    //   visParam2: modisRgbVisParam,
    //   title: 'vowell terra',
    //   myScale: 500
    // })
  printChart({
    collection: terraCat,
    roi: cat, 
    visParam2: modisRgbVisParam,
    title: 'Terra Cat'
  })
  // printChart({
    //   collection: terraCat,
    //   roi: cat, 
    //   reducer: ee.Reducer.count(),
    //   visParam2: modisRgbVisParam,
    //   title: 'cat terra',
    //   myScale: 500
    // })
  printChart({
    collection: aquaVowell,
    roi: vowell, 
    visParam2: modisRgbVisParam,
    title: 'Aqua Vowell'
  })
  // printChart({
    //   collection: aquaVowell,
    //   roi: vowell, 
    //   reducer: ee.Reducer.count(),
    //   visParam2: modisRgbVisParam,
    //   title: 'vowell aqua count',
    //   myScale: 500
    // })
  printChart({
    collection: aquaCat,
    roi: cat, 
    visParam2: modisRgbVisParam,
    title: 'Aqua cat'
  })
  // printChart({
    //   collection: aquaCat,
    //   roi: cat, 
    //   reducer: ee.Reducer.count(),
    //   visParam2: modisRgbVisParam,
    //   title: 'cat aqua count',
    //   myScale: 500
    // })
  
  
  
  
  // printChart({
    //   collection: snowTerraVowell,
    //   roi: vowell,
    //   visParam1: albedoVisParam,
    //   chartBands: 'ALBEDO',
    //   title: 'Vowell Terra Albedo'
    // })
  
  // printChart({
    //   collection: snowTerraCat,
    //   roi: cat,
    //   visParam1: albedoVisParam,
    //   chartBands: 'ALBEDO',
    //   title: 'Cat Terra Albedo'
    // })
  
  // printChart({
    //   collection: snowAquaVowell,
    //   roi: vowell,
    //   visParam1: albedoVisParam,
    //   chartBands: 'ALBEDO',
    //   title: 'Vowell Aqua Albedo'
    // })
  
  // printChart({
    //   collection: snowAquaCat,
    //   roi: cat,
    //   visParam1: albedoVisParam,
    //   chartBands: 'ALBEDO',
    //   title: 'Cat Aqua Albedo'
    // })
  
  
  
  // wx data over entire glacier ------------------------
    
    // printChart({
      //   collection: daymet,
      //   roi: vowellGlimsGeom, 
      //   visParam1: sradVisParam, 
      //   chartBands: 'srad',
      //   title: 'vowell srad'
      // })
  // printChart({
    //   collection: daymet,
    //   roi: catGlimsGeom, 
    //   visParam1: sradVisParam, 
    //   chartBands: 'srad',
    //   title: 'cat srad'
    // })
  
  // printChart({
    //   collection: daymet,
    //   roi: vowell,//GlimsGeom, 
    //   visParam1: sradVisParam, 
    //   chartBands: 'tmax',
    //   title: 'vowell tmax'
    // })
  // printChart({
    //   collection: daymet,
    //   roi: cat,//GlimsGeom, 
    //   visParam1: sradVisParam, 
    //   chartBands: 'tmax',
    //   title: 'cat tmax'
    // })
  
  // printChart({
    //   collection: daymet,
    //   roi: vowell,//GlimsGeom, 
    //   visParam1: sradVisParam, 
    //   chartBands: 'tmin',
    //   title: 'vowell tmin'
    // })
  // printChart({
    //   collection: daymet,
    //   roi: cat,//GlimsGeom, 
    //   visParam1: sradVisParam, 
    //   chartBands: 'tmin',
    //   title: 'cat tmin'
    // })
  
  // printChart({
    //   collection: daymet,
    //   roi: vowell,//GlimsGeom, 
    //   visParam1: sradVisParam, 
    //   chartBands: 'prcp',
    //   title: 'vowell precip'
    // })
  // printChart({
    //   collection: daymet,
    //   roi: cat,//GlimsGeom, 
    //   visParam1: sradVisParam, 
    //   chartBands: 'prcp',
    //   title: 'cat precip'
    // })
  
  
  // get data for glacier polygons ---------------------
    
    // printChart({
      //   collection: s2Vowell,
      //   roi: vowellGlimsGeom, 
      //   visParam2: s2RgbVisParam,
      //   title: 'vowell S2 (glims geom)'
      // })
  // printChart({
    //   collection: s2Cat,
    //   roi: catGlimsGeom, 
    //   visParam2: s2RgbVisParam,
    //   title: 'catamount S2 (glims geom)'
    // })
  // printChart({
    //   collection: l8Vowell,
    //   roi: vowellGlimsGeom, 
    //   visParam1: rgndVisParam, 
    //   visParam2: l8RgbVisParam,
    //   chartBands: 'RGND',
    //   title: 'vowell L8 (glims geom)'
    // })
  // printChart({
    //   collection: l8Cat,
    //   roi: catGlimsGeom, 
    //   visParam1: rgndVisParam, 
    //   visParam2: l8RgbVisParam,
    //   chartBands: 'RGND',
    //   title: 'catamount L8 (glims geom)'
    // })
  
  // printChart({
    //   collection: terraVowell,
    //   roi: vowellGlimsGeom, 
    //   visParam2: modisRgbVisParam,
    //   title: 'Terra Vowell (glims geom)'
    // })
  // printChart({
    //   collection: terraCat,
    //   roi: catGlimsGeom, 
    //   visParam2: modisRgbVisParam,
    //   title: 'Terra Cat (glims geom)'
    // })
  // printChart({
    //   collection: aquaVowell,
    //   roi: vowellGlimsGeom, 
    //   visParam2: modisRgbVisParam,
    //   title: 'Aqua Vowell (glims geom)'
    // })
  // printChart({
    //   collection: aquaCat,
    //   roi: catGlimsGeom, 
    //   visParam2: modisRgbVisParam,
    //   title: 'Aqua Cat (glims geom)'
    // })
  // printChart({
    //   collection: snowTerraVowell,
    //   roi: vowellGlimsGeom,
    //   visParam1: albedoVisParam,
    //   chartBands: 'ALBEDO',
    //   title: 'Vowell Terra Albedo (glims geom)'
    // })
  
  // printChart({
    //   collection: snowTerraCat,
    //   roi: catGlimsGeom,
    //   visParam1: albedoVisParam,
    //   chartBands: 'ALBEDO',
    //   title: 'Cat Terra Albedo (glims geom)'
    // })
  
  
  
  
  
  // get data for MODIS polygons -----------------------------
    
    // printChart({
      //   collection: s2Vowell,
      //   roi: vowellModis, 
      //   visParam2: s2RgbVisParam,
      //   title: 'vowell S2 (modis polygon)'
      // })
  // printChart({
    //   collection: s2Cat,
    //   roi: catModis, 
    //   visParam2: s2RgbVisParam,
    //   title: 'catamount S2 (modis polygon)'
    // })
  // printChart({
    //   collection: l8Vowell,
    //   roi: vowellModis, 
    //   visParam1: rgndVisParam, 
    //   visParam2: l8RgbVisParam,
    //   chartBands: 'RGND',
    //   title: 'vowell L8 (modis polygon)'
    // })
  // printChart({
    //   collection: l8Cat,
    //   roi: catModis, 
    //   visParam1: rgndVisParam, 
    //   visParam2: l8RgbVisParam,
    //   chartBands: 'RGND',
    //   title: 'catamount L8 (modis polygon)'
    // })
  
  
  
  
  // printChart({
    //   collection: terraVowell,
    //   roi: vowellModis, 
    //   visParam2: modisRgbVisParam,
    //   title: 'Terra Vowell (modis polygon)'
    // })
  // printChart({
    //   collection: terraCat,
    //   roi: catModis, 
    //   visParam2: modisRgbVisParam,
    //   title: 'Terra Cat (modis polygon)'
    // })
  // printChart({
    //   collection: aquaVowell,
    //   roi: vowellModis, 
    //   visParam2: modisRgbVisParam,
    //   title: 'Aqua Vowell (modis polygon)'
    // })
  // printChart({
    //   collection: aquaCat,
    //   roi: catModis, 
    //   visParam2: modisRgbVisParam,
    //   title: 'Aqua cat (modis polygon)'
    // })
  
  
  
  
  // printChart({
    //   collection: snowTerraVowell,
    //   roi: vowellModis,
    //   visParam1: albedoVisParam,
    //   chartBands: 'ALBEDO',
    //   title: 'Vowell Terra Albedo (modis polygon)'
    // })
  
  // printChart({
    //   collection: snowTerraCat,
    //   roi: catModis,
    //   visParam1: albedoVisParam,
    //   chartBands: 'ALBEDO',
    //   title: 'Cat Terra Albedo (modis polygon)'
    // })
  
  // printChart({
    //   collection: snowAquaVowell,
    //   roi: vowellModis,
    //   visParam1: albedoVisParam,
    //   chartBands: 'ALBEDO',
    //   title: 'Vowell Aqua Albedo (modis polygon)'
    // })
  
  // printChart({
    //   collection: snowAquaCat,
    //   roi: catModis,
    //   visParam1: albedoVisParam,
    //   chartBands: 'ALBEDO',
    //   title: 'Cat Aqua Albedo (modis polygon)'
    // })
  
  
  // make filmstrip -----------------------
    
    
    var dateList = function(col){
      return col
      .map(function(image) {
        return ee.Feature(null, {'date': image.date().format('YYYY-MM-dd')})
      })
      // .distinct('date')
      .aggregate_array('date')
    }
  
  
  // print('s2 vowell', dateList(s2Vowell))
  
  // print(s2Vowell.getFilmstripThumbURL({
    //   dimensions: 1000,
    //   region: vowell_box,
    //   bands: ['B4', 'B3','B2'],
    //   min:0,
    //   max:10000
    // }));
  // print(s2Vowell.select('RGND_CLOUDMASKED').getFilmstripThumbURL({
    //   dimensions: 400,
    //   region: vowell_box,
    //   palette: ['white', 'red'],
    //   min:0,
    //   max:0.05
    // }));
  // print('s2 cat', dateList(s2Cat))
  // print(s2Cat.getFilmstripThumbURL({
    //   dimensions: 1000,
    //   region: cat_box,
    //   bands: ['B4', 'B3','B2'],
    //   min:0,
    //   max:10000
    // }));
  // print(s2Cat.select('RGND_CLOUDMASKED').getFilmstripThumbURL({
    //   dimensions: 400,
    //   region: cat_box,
    //   palette: ['white', 'red'],
    //   min:0,
    //   max:0.05
    // }));
  
  
  // print('l8 vow', dateList(l8Vowell))
  
  // print(l8Vowell.getFilmstripThumbURL({
    //   dimensions: 128,
    //   region: vowell_box,
    //   bands: ['SR_B4', 'SR_B3','SR_B2'],
    //   min:0,
    //   max:50000
    // }));
  // print(l8Vowell.select('RGND').getFilmstripThumbURL({
    //   dimensions: 128,
    //   region: vowell_box,
    //   palette: ['white', 'red'],
    //   min:0,
    //   max:0.05
    // }));
  // print('l8 cat', dateList(l8Cat))
  // print(l8Cat.getFilmstripThumbURL({
    //   dimensions: 128,
    //   region: cat_box,
    //   bands: ['SR_B4', 'SR_B3','SR_B2'],
    //   min:0,
    //   max:50000
    // }));
  // print(l8Cat.select('RGND').getFilmstripThumbURL({
    //   dimensions: 128,
    //   region: cat_box,
    //   palette: ['white', 'red'],
    //   min:0,
    //   max:0.05
    // }));
  
  
  
  // print('vowell Terra', dateList(terraVowell))
  
  // print(terraVowell.getFilmstripThumbURL({
    //   dimensions: 128,
    //   region: vowell_box,
    //   bands: ['sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03'],
    //   min:0,
    //   max:12000
    // }));
  // print(terraVowell.select('RGND_CLOUDMASKED').getFilmstripThumbURL({
    //   dimensions: 128,
    //   region: vowell_box,
    //   palette: ['white', 'red'],
    //   min:0,
    //   max:0.05
    // }));
  // print('cat Terra', dateList(terraCat))
  // print(terraCat.getFilmstripThumbURL({
    //   dimensions: 128,
    //   region: cat_box,
    //   bands: ['sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03'],
    //   min:0,
    //   max:12000
    // }));
  // print(terraCat.select('RGND_CLOUDMASKED').getFilmstripThumbURL({
    //   dimensions: 128,
    //   region: cat_box,
    //   palette: ['white', 'red'],
    //   min:0,
    //   max:0.05
    // }));
  
  
  // print('vowell Aqua', dateList(aquaVowell))
  // print(aquaVowell.getFilmstripThumbURL({
    //   dimensions: 128,
    //   region: vowell_box,
    //   bands: ['sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03'],
    //   min:0,
    //   max:12000
    // }));
  // print(aquaVowell.select('RGND_CLOUDMASKED').getFilmstripThumbURL({
    //   dimensions: 128,
    //   region: vowell_box,
    //   palette: ['white', 'red'],
    //   min:0,
    //   max:0.05
    // }));
  // print('cat Aqua', dateList(aquaCat))
  // print(aquaCat.getFilmstripThumbURL({
    //   dimensions: 128,
    //   region: cat_box,
    //   bands: ['sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03'],
    //   min:0,
    //   max:12000
    // }));
  // print(aquaCat.select('RGND_CLOUDMASKED').getFilmstripThumbURL({
    //   dimensions: 128,
    //   region: cat_box,
    //   palette: ['white', 'red'],
    //   min:0,
    //   max:0.05
    // }));
  
  
  
  
  
  
  