(function () {
  'use strict';

  var config = window.BACON_BROS_CONFIG;
  if (!config) return;

  var mapEl = document.getElementById('property-map');
  if (!mapEl) return;

  var key = config.googleMapsApiKey;
  var property = config.property;

  function initMap() {
    var center = { lat: property.lat, lng: property.lng };

    var map = new google.maps.Map(mapEl, {
      center: center,
      zoom: 17,
      mapTypeId: 'hybrid',
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true
    });

    var marker = new google.maps.Marker({
      position: center,
      map: map,
      title: property.address
    });

    var info = new google.maps.InfoWindow({
      content: '<div class="map-info"><strong>Bacon Bros LLC</strong><br>' + property.address + '</div>'
    });

    info.open(map, marker);

    /* Approximate parcel outlines along N Kenazo Ave */
    var parcelOne = new google.maps.Polygon({
      paths: [
        { lat: 31.69115, lng: -106.18925 },
        { lat: 31.69115, lng: -106.18855 },
        { lat: 31.69075, lng: -106.18855 },
        { lat: 31.69075, lng: -106.18875 },
        { lat: 31.69055, lng: -106.18875 },
        { lat: 31.69055, lng: -106.18925 }
      ],
      strokeColor: '#1a56db',
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: '#4285f4',
      fillOpacity: 0.25,
      map: map
    });

    var parcelTwo = new google.maps.Polygon({
      paths: [
        { lat: 31.69055, lng: -106.18925 },
        { lat: 31.69055, lng: -106.18875 },
        { lat: 31.69075, lng: -106.18875 },
        { lat: 31.69075, lng: -106.18855 },
        { lat: 31.68965, lng: -106.18855 },
        { lat: 31.68965, lng: -106.18925 }
      ],
      strokeColor: '#1a56db',
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: '#4285f4',
      fillOpacity: 0.25,
      map: map
    });

    parcelOne.addListener('click', function () {
      info.setContent('<strong>Parcel One — 2 acres</strong><br>For sale · Owner-direct');
      info.setPosition(parcelOne.getPath().getAt(0));
      info.open(map);
    });

    parcelTwo.addListener('click', function () {
      info.setContent('<strong>Parcel Two — 3 acres</strong><br>For sale · Owner-direct');
      info.setPosition(parcelTwo.getPath().getAt(0));
      info.open(map);
    });
  }

  function showFallback() {
    mapEl.innerHTML =
      '<div class="map-fallback">' +
        '<p><strong>305 N Kenazo Ave, Horizon City, TX 79928</strong></p>' +
        '<p>Add your Google Maps API key in <code>js/config.js</code> to enable the interactive map.</p>' +
        '<a class="btn btn-dark" href="https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(property.address) + '" target="_blank" rel="noopener noreferrer">' +
        'Open in Google Maps</a>' +
      '</div>';
  }

  if (!key || key === 'YOUR_GOOGLE_MAPS_API_KEY') {
    showFallback();
    return;
  }

  if (window.google && window.google.maps) {
    initMap();
    return;
  }

  var script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(key) + '&callback=initBaconBrosMap';
  script.async = true;
  script.defer = true;
  script.onerror = showFallback;
  window.initBaconBrosMap = initMap;
  document.head.appendChild(script);
})();
