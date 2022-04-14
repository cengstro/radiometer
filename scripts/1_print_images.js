// This script was written for use in the Google Earth Code Editor, 
// and can be run interactively at 
// https://code.earthengine.google.com/c61b62b4062ad2fa03ee0628d8b5062f


var vowellBox = 
  /* color: #d63000 */
  /* shown: false */
  ee.Geometry.Polygon(
    [[[-116.77147801409961, 50.83899533259405],
      [-116.95893223773243, 50.77759806639163],
      [-116.86177189837696, 50.665225724924724],
      [-116.66436131488086, 50.734376394361654]]]),
catBox = 
  /* color: #98ff00 */
  /* shown: false */
  /* displayProperties: [
    {
      "type": "rectangle"
    }
  ] */
  ee.Geometry.Polygon(
    [[[-116.67778009580428, 50.70550673855659],
      [-116.67778009580428, 50.567018204582155],
      [-116.44981378721053, 50.567018204582155],
      [-116.44981378721053, 50.70550673855659]]], null, false),
glims = ee.FeatureCollection("GLIMS/current"),
catPoint = 
  /* color: #0b4a8b */
  /* shown: false */
  ee.Geometry.Point([-116.55929764443331, 50.63868867389186]),
vowellPoint = 
  /* color: #ffc82d */
  /* shown: false */
  ee.Geometry.Point([-116.80434922116112, 50.749552853575956]),
vowell = 
  /* color: #d63000 */
  /* shown: false */
  ee.Geometry.Polygon(
    [[[-116.79214412548836, 50.75099446830639],
      [-116.80364543774422, 50.754524119945124],
      [-116.82081157543954, 50.7514832051777],
      [-116.81591922619637, 50.74974545089661],
      [-116.81669170239266, 50.74681284426578],
      [-116.81454593518075, 50.74431455297852],
      [-116.80742198803719, 50.7432282977953],
      [-116.80132800915536, 50.74393436653092],
      [-116.79634982922371, 50.746161128955826]]]),
cat = 
  /* color: #98ff00 */
  /* shown: false */
  ee.Geometry.Polygon(
    [[[-116.55278467293451, 50.64511402804033],
      [-116.56359933968255, 50.65012105601491],
      [-116.56651758309076, 50.645658296059295],
      [-116.56325601692865, 50.64467860908597],
      [-116.5663459217138, 50.638364580825545],
      [-116.57527231331537, 50.63106973351536],
      [-116.56668924446771, 50.62148672150047],
      [-116.56016611214349, 50.62192235532742],
      [-116.56359933968255, 50.6281296988868],
      [-116.5575911914892, 50.63651375660107]]]),
catBloomPoly = /* color: #000000 */ee.Feature(
  ee.Geometry({
    "type": "GeometryCollection",
    "geometries": [
      {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -116.5611733926045,
              50.623164410967334
            ],
            [
              -116.56087831083067,
              50.62583608493862
            ],
            [
              -116.5613503796173,
              50.62793234180904
            ],
            [
              -116.56263783994444,
              50.630627391887174
            ],
            [
              -116.56276658597716,
              50.63313174437808
            ],
            [
              -116.56121646396161,
              50.635363439567534
            ],
            [
              -116.55954276553632,
              50.63623444606824
            ],
            [
              -116.55846988193036,
              50.637214309088755
            ],
            [
              -116.55623828402997,
              50.63955501028426
            ],
            [
              -116.55645286075116,
              50.64012655914692
            ],
            [
              -116.5555945538664,
              50.640725317166876
            ],
            [
              -116.55512248507978,
              50.64001769323281
            ],
            [
              -116.55435000888349,
              50.640235424808864
            ],
            [
              -116.55430709353925,
              50.641922810320985
            ],
            [
              -116.55645286075116,
              50.6414057147478
            ],
            [
              -116.55722533694745,
              50.64219496360042
            ],
            [
              -116.55984317294599,
              50.64156900870138
            ],
            [
              -116.55898486606122,
              50.64282091016169
            ],
            [
              -116.55859862796308,
              50.643936707265944
            ],
            [
              -116.56061564914228,
              50.644780341145555
            ],
            [
              -116.5614310406828,
              50.64600494401927
            ],
            [
              -116.56340514651777,
              50.64507969146199
            ],
            [
              -116.56314765445234,
              50.64638592507068
            ],
            [
              -116.56361972323896,
              50.64682132820396
            ],
            [
              -116.56482135287763,
              50.64600494401927
            ],
            [
              -116.56477843753339,
              50.64668526515824
            ],
            [
              -116.56529342166425,
              50.64657641443796
            ],
            [
              -116.56598006717206,
              50.64761048609908
            ],
            [
              -116.5654650830412,
              50.647746546465456
            ],
            [
              -116.56580840579511,
              50.648590111942525
            ],
            [
              -116.56825458041669,
              50.64758327397851
            ],
            [
              -116.5669242047453,
              50.64725672730247
            ],
            [
              -116.56756793490888,
              50.64665805250182
            ],
            [
              -116.5671387814665,
              50.645814452335124
            ],
            [
              -116.56636630527021,
              50.645814452335124
            ],
            [
              -116.56675254336835,
              50.64464427218945
            ],
            [
              -116.5645638608122,
              50.645215759157225
            ],
            [
              -116.56374846927167,
              50.644889196026725
            ],
            [
              -116.56477843753339,
              50.64301141398192
            ],
            [
              -116.56563674441816,
              50.64067088493485
            ],
            [
              -116.56585132113935,
              50.63977274400392
            ],
            [
              -116.56555091372968,
              50.639282841716096
            ],
            [
              -116.56636630527021,
              50.63890180307274
            ],
            [
              -116.56722461215497,
              50.63849354395523
            ],
            [
              -116.56881247989179,
              50.638738499851314
            ],
            [
              -116.57018577090741,
              50.63803084600154
            ],
            [
              -116.56846915713788,
              50.6369693452487
            ],
            [
              -116.57001410953046,
              50.635907820521915
            ],
            [
              -116.57082950107099,
              50.634138559368004
            ],
            [
              -116.57150630627767,
              50.632293810382976
            ],
            [
              -116.57365207348958,
              50.630551635197804
            ],
            [
              -116.57511119519368,
              50.62921773868277
            ],
            [
              -116.572107121097,
              50.62973496835445
            ],
            [
              -116.57060508404867,
              50.63155883810014
            ],
            [
              -116.56798724805013,
              50.63319209423496
            ],
            [
              -116.56644229565755,
              50.633709280181264
            ],
            [
              -116.56815890942708,
              50.631803830137855
            ],
            [
              -116.56957511578695,
              50.63057885718163
            ],
            [
              -116.56760100995199,
              50.630551635197804
            ],
            [
              -116.5697467771639,
              50.62957163328341
            ],
            [
              -116.57103423749105,
              50.62924496143893
            ],
            [
              -116.5723216978182,
              50.62826493228641
            ],
            [
              -116.57146339093343,
              50.627094315136446
            ],
            [
              -116.57099132214681,
              50.626059792000426
            ],
            [
              -116.56936053906576,
              50.62556974678085
            ],
            [
              -116.56970386181966,
              50.62388177415384
            ],
            [
              -116.56820182477132,
              50.62254768840269
            ],
            [
              -116.5666139570345,
              50.62143138348637
            ],
            [
              -116.56558398877279,
              50.6215947468366
            ],
            [
              -116.56451110516683,
              50.62110465508337
            ],
            [
              -116.5636957136263,
              50.619824946981936
            ],
            [
              -116.5622365919222,
              50.61966157748381
            ],
            [
              -116.56094913159505,
              50.619035322483775
            ],
            [
              -116.56013374005452,
              50.619906631518184
            ],
            [
              -116.56009082471029,
              50.621213564803256
            ],
            [
              -116.56142120038167,
              50.622139287238916
            ]
          ]
        ],
        "evenOdd": true
      },
      {
        "type": "Point",
        "coordinates": [
          -116.80219775966673,
          50.75168274144771
        ]
      }
    ],
    "coordinates": []
  }),
{
  "name": "cat",
  "system:index": "0"
}),
vowellBloomPoly = /* color: #000000 */ee.Feature(
  ee.Geometry.Polygon(
    [[[-116.81055080053656, 50.74375020879048],
      [-116.80900584814398, 50.7435601136614],
      [-116.80866252539008, 50.743695895975215],
      [-116.80789004919379, 50.743152764357404],
      [-116.80694591162055, 50.74385883423203],
      [-116.80681716558783, 50.74432048954722],
      [-116.8054438745722, 50.74459204937108],
      [-116.80449973699896, 50.74372305239069],
      [-116.80462848303168, 50.74453773753229],
      [-116.80389892217963, 50.745053697456974],
      [-116.80299769995062, 50.74472782869236],
      [-116.80269729254096, 50.74396745942156],
      [-116.80166732427924, 50.74364158309692],
      [-116.80110942480414, 50.74399461567958],
      [-116.80093776342719, 50.745841204274754],
      [-116.79939281103461, 50.74613991029238],
      [-116.79844867346137, 50.74543387481585],
      [-116.79840575811713, 50.74649292403802],
      [-116.79767619726508, 50.74635714983547],
      [-116.79767619726508, 50.74717178914468],
      [-116.79686080572455, 50.746248530189916],
      [-116.79643165228217, 50.747198943544205],
      [-116.79235469457953, 50.75083749062435],
      [-116.79201137182562, 50.75132622913459],
      [-116.79286967871039, 50.751570596476185],
      [-116.79497253057806, 50.75070172902145],
      [-116.79570209143012, 50.75121762101775],
      [-116.79784785864203, 50.75167920377409],
      [-116.79879199621527, 50.752059327332304],
      [-116.80076610205023, 50.751353381124446],
      [-116.8027402078852, 50.75127192510767],
      [-116.80248271581976, 50.751923569273025],
      [-116.80437099096625, 50.75159774832429],
      [-116.80458556768744, 50.75184211424843],
      [-116.80213939306586, 50.75252090178881],
      [-116.8051005518183, 50.75224938795384],
      [-116.80634509680121, 50.753199679485924],
      [-116.8060017740473, 50.75344403704728],
      [-116.80475722906439, 50.75366124269754],
      [-116.8039847528681, 50.754285703327525],
      [-116.80789004919379, 50.75412280135768],
      [-116.80874835607855, 50.75376984514469],
      [-116.80797587988226, 50.753308283004024],
      [-116.81235324499457, 50.752765262893696],
      [-116.81806098577826, 50.75165205197324],
      [-116.82020675299017, 50.751353381124446],
      [-116.8204642450556, 50.75078318603043],
      [-116.81887637731879, 50.75089179515524],
      [-116.81612979528754, 50.75032159443872],
      [-116.814413181518, 50.75013152598976],
      [-116.81359778997748, 50.74958846902612],
      [-116.81578647253363, 50.74907255907548],
      [-116.81677352545111, 50.74812218375675],
      [-116.81681644079535, 50.746900244283246],
      [-116.81527148840277, 50.74646576922902],
      [-116.81638728735297, 50.74442911366575],
      [-116.81389819738715, 50.74510800869724],
      [-116.81359778997748, 50.74407608435911],
      [-116.8123961603388, 50.74440195765975],
      [-116.81231032965033, 50.743532957151366],
      [-116.81055080053656, 50.74407608435911]]]),
{
  "name": "vowell",
  "system:index": "0"
});



var v = ee.Image('COPERNICUS/S2_SR/20200728T184919_20200728T190002_T11UNS')
var c = ee.Image('COPERNICUS/S2_SR/20200804T183919_20200804T184659_T11UNS')

var myGlaciers = glims.filter(ee.Filter.inList('glac_name', ['Catamount Glacier', 'Vowell Glacier']))
print(myGlaciers)
var bloomFC = ee.FeatureCollection([vowellBloomPoly, catBloomPoly])

var addBands = function(image){
  var rgnd = image.normalizedDifference(['B4', 'B3']).max(0)// set negative RGND to 0
  var gswd = image.select('B3').subtract(image.select('B11')) // an ice mask
  var isSnow = gswd.gt(5000)
  return image
  .addBands(rgnd.rename('RGND'))
  .addBands(gswd.rename('GSWD'))
  .addBands(isSnow.rename('isSnow'))
}
v=addBands(v)
c=addBands(c)
// print(c)

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
  max:0.1
}
var iceVisParam = {
  bands: ['RGND'],
  palette: ['white', 'purple'],
  min:0,
  max:0.1
}


Map.centerObject(vowellPoint, 13)
Map.addLayer(v.clip(vowellBox), s2RgbVisParam, 'vowell true color')
// Map.addLayer(v.clip(myGlaciers), rgndVisParam, 'vowell RGND')
// Map.addLayer(v.clip(myGlaciers).updateMask(v.select('isSnow').not()), iceVisParam, 'ice RGND')
Map.addLayer(c.clip(catBox), s2RgbVisParam, 'cat true color')
// Map.addLayer(c.clip(myGlaciers), rgndVisParam, 'cat RGND')
// Map.addLayer(c.clip(myGlaciers).updateMask(c.select('isSnow').not()), iceVisParam, 'cat ice RGND')
// Map.addLayer(myGlaciers.style({fillColor: "00000000", color:"00ffff"}), {}, "glacier outlines")
// Map.addLayer(bloomFC.style({fillColor: "00000000", color:"000000"}), {}, "bloom outlines black")


// export map components
Export.image.toDrive({
  image: v.visualize(s2RgbVisParam), 
  description: 'vowell', 
  folder: 'radiometer',
  region: vowellBox,
  scale: 10})
Export.image.toDrive({
  image: v.clip(myGlaciers).select('RGND'), //.visualize(rgndVisParam)
  description: 'vowell_rgnd', 
  folder: 'radiometer',
  region: vowellBox,
  scale: 10})
Export.image.toDrive({
  image: c.visualize(s2RgbVisParam), 
  description: 'cat', 
  folder: 'radiometer',
  region: catBox,
  scale: 10})
Export.image.toDrive({
  image: c.clip(myGlaciers).select('RGND'), 
  description: 'cat_rgnd', 
  folder: 'radiometer',
  region: catBox,
  scale: 10})
Export.image.toDrive({
  image: v.clip(myGlaciers).select('RGND')
  .updateMask(v.select('isSnow').not()),  
  description: 'vowell_ice_rgnd', 
  folder: 'radiometer',
  region: vowellBox,
  scale: 10})
Export.image.toDrive({
  image: c.clip(myGlaciers).select('RGND')
  .updateMask(c.select('isSnow').not()),  
  description: 'cat_ice_rgnd', 
  folder: 'radiometer',
  region: catBox,
  scale: 10})
Export.table.toAsset(myGlaciers,'glacier_polys', 'radiometer/glacierPolygons')
Export.table.toAsset(bloomFC,'bloom_polys', 'radiometer/bloomPolygons')
Export.table.toDrive(myGlaciers,'glacier_polygons', 'radiometer','bloom_polygons', 'KML')
Export.table.toDrive(bloomFC,'bloom_polygons', 'radiometer','bloom_polygons', 'KML')
// Also export ice masks





// histograms-- distribution of RGND values for supp

var h1 = ui.Chart.image.histogram({
  image: v.select('RGND'), 
  region: vowell,
  scale: 10,
  maxPixels: 1e9
})

var h2 = ui.Chart.image.histogram({
  image: c.select('RGND'), 
  region: cat, 
  scale: 10,
  maxPixels: 1e9
})
// print(h1, h2)







// scratch -----------
  
  
  
  
  
  // Define geometries based on RGND, compute area

var catGlacier = ee.Feature(glims.filterBounds(catPoint).first())
var vowellGlacier = ee.Feature(glims.filterBounds(vowellPoint).first())
// Map.addLayer(catGlacier)

// Automatic bloom polygon drawing based on RGND --------------- 
  
  // mask RGND
var thresh = 0.025
var rad = 5
var boxThresh = 0.8

var despeckle = function(image, maxSize, minArea){
  maxSize = maxSize || 100
  minArea = minArea || 1000
  
  // despeckle based on the first band of the image
  var pixelCount = image.select(0).connectedPixelCount(maxSize)
  var minPixelCount = ee.Image(minArea).divide(ee.Image.pixelArea()) 
  // all masked if minArea < pixSize
  var noiseMask = pixelCount.gte(minPixelCount).selfMask()
  return image.updateMask(noiseMask)
}

var vowellMask = v
.select('RGND')
.updateMask(v.select('isSnow'))
.gt(thresh)
.clip(vowellGlacier)
.selfMask()
var catMask = c.select('RGND')
.select('RGND')
.updateMask(v.select('isSnow'))
.gt(thresh)
.clip(catGlacier)
.selfMask()


// vowellMask = despeckle(vowellMask, 100, 13000)
// catMask= despeckle(catMask)
Map.addLayer(vowellMask, {color:'red'})
Map.addLayer(catMask, {color:'red'})


// reduce to Vectors
var vowellFeat = vowellMask
.reduceToVectors({scale:10})
.map(function(f){return f.set('area',f.area(500))})
.sort('area', false)

var catFeat = catMask
.reduceToVectors({scale:10})
.map(function(f){return f.set('area',f.area(500))})
.sort('area',false)
Map.addLayer(vowellFeat)
print(vowellFeat.first(), catFeat.first())//1.3 and 1.5 km2 of contiguous area
print(vowellFeat.aggregate_sum('area'), catFeat.aggregate_sum('area'))



// Export geoms


// print(h1, h2)
// // sanity check, compare w reduceRegion
// print(v.select('RGND').reduceRegion({
  //   reducer: ee.Reducer.mean(),
  //   geometry: vowell, //vowellGlacier.geometry(),
  //   scale: 10, 
  //   maxPixels: 1e9
  // }))

// print('area', vowell.area(), cat.area())