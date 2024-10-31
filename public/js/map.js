// map.js
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: coordinates, // starting position [lng, lat]
  zoom: 9 // starting zoom level
});

// Add a marker at the specified coordinates
new mapboxgl.Marker()
  .setLngLat(coordinates)
  .addTo(map);
