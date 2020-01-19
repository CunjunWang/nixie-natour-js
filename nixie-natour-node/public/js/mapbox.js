// Created by CunjunWang on 2020/1/19

export const displayMap = (locations) => {

  mapboxgl.accessToken = 'pk.eyJ1IjoiZHVja3djaiIsImEiOiJjazVrbjhjamcwZnpsM2tuNWNnZ2sxdnNmIn0.MrROKDXp6mDwuUZY_f0ErA';
  console.log(mapboxgl.accessToken);
  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/duckwcj/ck5knikfi31z51inwadv0y9qk',
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach(loc => {
    // create a marker
    const el = document.createElement('div');
    el.className = 'marker';

    // add the marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // add a popup
    new mapboxgl.Popup({
      offset: 30
    }).setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // extend map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });

};
