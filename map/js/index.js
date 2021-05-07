if (world_110m) { //loading resource from other Pen
	var world = world_110m;
} else {
	console.log("No topo data loaded!"); 
}

var countries = getCountries();

var width = 960,
	height = 960;

var projection = d3.geo.mercator()
    .scale((width + 1) / 2 / Math.PI)
    .translate([ (width / 2), height / 2])
    .precision(.1);

/*
var projection = d3.geo.orthographic()
    .scale(475)
    .translate([width / 2, height / 2])
    .clipAngle(90)
    .precision(.1);
*/

var path = d3.geo.path()
	.projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height)
	.attr("class", "bg");

//queue()
//	.defer(d3.json, "http://lenart.pl/assets/codepen/world-110m.json")
//	.await(ready);

//function ready(error, world) {

	svg.append("path")
		.datum(graticule)
		.attr("class", "graticule")
		.attr("d", path);

	svg.insert("path", ".graticule")
		.datum(topojson.feature(world, world.objects.land))
		.attr("class", "land")
		.attr("d", path);

	svg.insert("path", ".graticule")
		.datum(topojson.mesh(world, world.objects.countries, function(a, b) {
			return a !== b;
		}))
		.attr("class", "boundary")
		.attr("d", path);
	
	// Sea shore filter
	var defs = svg.append('defs'),
		filter = defs.append('filter').attr('id','seaShore');
	filter.append('feGaussianBlur')
		.attr('in','SourceGraphic')
		.attr('stdDeviation','15')
		.attr('result','blur');
	filter.append('feColorMatrix')
		.attr('in','blur')
		.attr('mode','matrix')
		.attr('values','1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 0')
		.attr('result','smooth');
	filter.append('feComponentTransfer')
		.attr('in', 'smooth')
		.attr('result','smoothAlpha')
		.append('feFuncA')
		.attr('type','linear')
		.attr('slope','0.5');
	filter.append('feComposite')
		.attr('in','SourceGraphic')
		.attr('in2','smoothAlpha')
		.attr('operator','over');
	
	var features = countries.features;
	
	// Top countries
	var values = features.map( function(d) {
		return [
			+d.geometry.properties.value,
			d.geometry.properties.countryCode
		]
	});
	
	// Markers
	for (var j = 0; j < features.length; j++) {
		
		// check if has value and draw line
		if (features[j].geometry.properties.value > 0) {
			
			var v = features[j].geometry.properties.value;
			var vSize = d3.scale.linear()
						.domain([0,25])
						.range([0.5,8]);
			var vOp = d3.scale.linear()
						.domain([0,25])
						.range([0.25,0.75]);
			
			// Random colour
			var randColour = ['#31558d', '#c52b2d'][Math.floor(Math.random() * 2)];			
			
			var x = projection(features[j].geometry.coordinates)[0],
				y = projection(features[j].geometry.coordinates)[1];
			
			var marker = svg.append("svg:path")
				.attr("class", "marker")
				.attr("d", "M0,0l-8.8-17.7C-12.1-24.3-7.4-32,0-32h0c7.4,0,12.1,7.7,8.8,14.3L0,0z")
				.attr("transform", "translate(" + x + "," + y + ") scale(0)")
				.transition()
				.delay(400)
				.duration(800)
				.ease("elastic")
				.attr("transform", "translate(" + x + "," + y + ") scale(.75)")
				//.on('mouseover', function(d){})
				;
			
			var cc = features[j].geometry.properties.countryCode;
			
			svg.append("svg:text")
				.attr("x", x)
				.attr("y", y)
				.attr("dx", ".5em")
				.attr("dy", ".35em")
				.text(cc)
				.attr("class", "cc");
		}
		
		/*
		marker.selectAll("path")
			.on("click", function(d) {
				d3.select(this)
					.transition()
					.duration(200)
					.ease("elastic")
					.attr("transform", "translate(" + d.x + "," + d.y + ") scale(2)");
			});
		*/

	}

//}

function getCountries() { 
	return {
		"type": "FeatureCollection",
		"features": [
			{
				"type": "Feature",
				"id": "1",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"55.30472",
						"25.25817"
					],
					"properties": {
						"name": "United Arab Emirates",
						"countryCode": "AE",
						"value": "1.19"
					}
				}
			},
			{
				"type": "Feature",
				"id": "8",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"-65",
						"-35"
					],
					"properties": {
						"name": "Argentina",
						"countryCode": "AR",
						"value": "0.03"
					}
				}
			},
			{
				"type": "Feature",
				"id": "12",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"134.0",
						"-25.0"
					],
					"properties": {
						"name": "Australia",
						"countryCode": "AU",
						"value": "10.64"
					}
				}
			},
			{
				"type": "Feature",
				"id": "30",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"-52",
						"-10"
					],
					"properties": {
						"name": "Brazil",
						"countryCode": "BR",
						"value": "0.20"
					}
				}
			},
			{
				"type": "Feature",
				"id": "37",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"-112.0",
						"60.0"
					],
					"properties": {
						"name": "Canada",
						"countryCode": "CA",
						"value": "4.17"
					}
				}
			},
			{
				"type": "Feature",
				"id": "47",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"103.7",
						"34.7"
					],
					"properties": {
						"name": "China",
						"countryCode": "CN",
						"value": "2.59"
					}
				}
			},
			{
				"type": "Feature",
				"id": "50",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"-82.38304",
						"23.13302"
					],
					"properties": {
						"name": "Cuba",
						"countryCode": "CU",
						"value": "0"
					}
				}
			},
			{
				"type": "Feature",
				"id": "56",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"10.0",
						"51.0"
					],
					"properties": {
						"name": "Germany",
						"countryCode": "DE",
						"value": "4.57"
					}
				}
			},
			{
				"type": "Feature",
				"id": "67",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"-3.70256",
						"40.4165"
					],
					"properties": {
						"name": "Spain",
						"countryCode": "ES",
						"value": "2.95"
					}
				}
			},
			{
				"type": "Feature",
				"id": "74",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"2.5",
						"46.5"
					],
					"properties": {
						"name": "France",
						"countryCode": "FR",
						"value": "4.37"
					}
				}
			},
			{
				"type": "Feature",
				"id": "88",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"23.71622",
						"37.97945"
					],
					"properties": {
						"name": "Greece",
						"countryCode": "GR",
						"value": "0.68"
					}
				}
			},
			{
				"type": "Feature",
				"id": "104",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"79",
						"23"
					],
					"properties": {
						"name": "India",
						"countryCode": "IN",
						"value": "1.20"
					}
				}
			},
			{
				"type": "Feature",
				"id": "108",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"-18",
						"65"
					],
					"properties": {
						"name": "Iceland",
						"countryCode": "IS",
						"value": "0.13"
					}
				}
			},
			{
				"type": "Feature",
				"id": "114",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"36.8166667",
						"-1.2833333"
					],
					"properties": {
						"name": "Kenya",
						"countryCode": "KE",
						"value": "0.14"
					}
				}
			},
			{
				"type": "Feature",
				"id": "173",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"-76",
						"-10"
					],
					"properties": {
						"name": "Peru",
						"countryCode": "PE",
						"value": "0.06"
					}
				}
			},
			{
				"type": "Feature",
				"id": "196",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"17",
						"64"
					],
					"properties": {
						"name": "Sweden",
						"countryCode": "SE",
						"value": "1.24"
					}
				}
			},
			{
				"type": "Feature",
				"id": "217",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"100.50144",
						"13.75398"
					],
					"properties": {
						"name": "Thailand",
						"countryCode": "TH",
						"value": "0.62"
					}
				}
			},
			{
				"type": "Feature",
				"id": "224",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"32.8542709350586",
						"39.9198743755027"
					],
					"properties": {
						"name": "Turkey",
						"countryCode": "TR",
						"value": "0.30"
					}
				}
			},
			{
				"type": "Feature",
				"id": "233",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"-100.7",
						"40.1"
					],
					"properties": {
						"name": "United States",
						"countryCode": "US",
						"value": "28.77"
					}
				}
			},
			{
				"type": "Feature",
				"id": "240",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"106.62965",
						"10.82302"
					],
					"properties": {
						"name": "Vietnam",
						"countryCode": "VN",
						"value": "0.10"
					}
				}
			},
			{
				"type": "Feature",
				"id": "247",
				"geometry": {
					"type": "Point",
					"coordinates": [
						"24",
						"-31"
					],
					"properties": {
						"name": "South Africa",
						"countryCode": "ZA",
						"value": "1.84"
					}
				}
			}
		]
	}
}