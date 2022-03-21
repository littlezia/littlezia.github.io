mapboxgl.accessToken = 'pk.eyJ1IjoiMjY1MTA1OHgiLCJhIjoiY2t6eTZ6MGg3MDh2bjJ2bzNic2h3a2FzcCJ9.1vx_kQ2C7tzOqSUDrzi_bw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/2651058x/cl0splwz900lk15qgqttgtuc2',
  center: [-3.1276, 55.5072],
  zoom: 5
});

map.on('load', function () {
  // Add data source
  // map.addSource('source-railway', {
  //   type: 'geojson',
  //   data: data_railway,
  // });

  // map.addSource('source-road', {
  //   type: 'geojson',
  //   data: data_road,
  // });

  map.addSource('source_railway', {
    type: 'vector',
    url: 'mapbox://2651058x.cl106iwty0kq421s255gnxpx3-2vgs0'
  });

  map.addSource('source_road', {
    type: 'vector',
    url: 'mapbox://2651058x.cl106kry06g6828pcc4zrcm4d-17ls8'
  });
  // Added data, then add layer 
  map.addLayer({
    id: 'layer-railway',
    type: 'line',
    source: 'source_railway',
    'source-layer': 'Railway0321',
    layout: {
      visibility: 'none',
    },
    paint: {
      'line-color': '#295b43',
      'line-width': 2,
    },
  });
  map.addLayer({
    id: 'layer-road',
    type: 'line',
    source: 'source_road',
    'source-layer': 'Road0321',
    layout: {
      visibility: 'none',
    },
    paint: {
      'line-color': [
        'case',
        ['==', ['get', 'type'], 'Major Highway'],
        '#67001f',
        ['==', ['get', 'type'], 'Secondary Highway'],
        '#FF00FF',
        ['==', ['get', 'type'], 'Road'],
        '#6495ED',
        ['==', ['get', 'type'], 'Ferry Route'],
        '#1E95FF',
        '#00BFFF',
      ],
      'line-width': 2,
    },
  });
//After that, I would like to rank the road lines.

  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });
  map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point);
    // console.log(features);
    let feature = features.find(f => 'layer-road' === f.layer.id)
    if (!feature) return;
    const { latitude, longitude, region_name, road_name, road_type, } = feature.properties;
    popup.remove()
    popup.setLngLat(e.lngLat).setHTML(
      `<div>
          <b>type:</b>&nbsp;${feature.properties['type']}
      </div>`
    ).addTo(map);
  });
});

document.getElementById('Railway').addEventListener("change", function (e) {
  console.log(e)
  if (e.target.checked) {
    map.setLayoutProperty('layer-railway', 'visibility', 'visible');
  } else {
    map.setLayoutProperty('layer-railway', 'visibility', 'none');
  }
});

document.getElementById('Road').addEventListener("change", function (e) {
  if (e.target.checked) {
    map.setLayoutProperty('layer-road', 'visibility', 'visible');
  } else {
    map.setLayoutProperty('layer-road', 'visibility', 'none');
  }
});
  
// Fly to function
document.getElementById('button-fly-uk').addEventListener('click', () => {
  map.flyTo({
    center: [-3.1276, 55.5072],
    zoom: 4.5
  });
});

document.getElementById('button-fly-scotland').addEventListener('click', () => {
  map.flyTo({
    center: [-4.2026, 56.4907],
    zoom: 7
  });
});

const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: "Search for places in UK", // Placeholder text for the search bar
  proximity: {
    longitude: 55.8642,
    latitude: 4.2518
  } // Coordinates of Glasgow center
});

map.addControl(geocoder, "top-left");

map.addControl(new mapboxgl.NavigationControl(), "top-left");

map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  }),
  "top-left"
);

//To add a scale.
const scale = new mapboxgl.ScaleControl({
  maxWidth: 80, //size of the scale bar
  unit: "metric"
});
map.addControl(scale);