// map.js
mapboxgl.accessToken = mapToken;


// const coordinates = [77.2090, 28.6139];
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: coordinates, // starting position [lng, lat]
  zoom: 9 // starting zoom level
});

// Add a marker at the specified coordinates
const marker = new mapboxgl.Marker({color:"red"})
  .setLngLat(coordinates)
  .addTo(map);
 
