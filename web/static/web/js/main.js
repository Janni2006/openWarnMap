$(document).ready(function () {
  document.getElementById("parent_map").innerHTML =
    "<div id='map' style='width: 100%; height: calc(100vh - 75px); position: absolute; right: 0px; top: 75px; z-index: 0;'></div>";

  var osmUrl = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    osmAttribution =
      'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  osmLayer = new L.TileLayer(osmUrl, {
    maxZoom: 18,
    attribution: osmAttribution,
  });

  var leafletMap = new L.Map("map");

  leafletMap.setView(
    new L.LatLng(
      localStorage.getItem("map_center_lat") ?? 0,
      localStorage.getItem("map_center_lng") ?? 0
    ),
    localStorage.getItem("map_center_zoom") ?? 4
  );

  leafletMap.addLayer(osmLayer);

  leafletMap.on("moveend", onMapZoomChange);

  var all = L.layerGroup();
  var only_active = L.layerGroup();

  $.ajax({
    url: "/data",
    success: function (data) {
      addGeoJsonLayerWithClustering(data.all).addTo(all);
      addGeoJsonLayerWithClustering(data.active).addTo(only_active);
    },
  });

  function onMapZoomChange() {
    localStorage.setItem("map_center_lat", leafletMap.getCenter().lat);
    localStorage.setItem("map_center_lng", leafletMap.getCenter().lng);
    localStorage.setItem("map_center_zoom", leafletMap.getZoom());
  }

  function addGeoJsonLayerWithClustering(data) {
    var markers = L.markerClusterGroup({
      disableClusteringAtZoom: 18,
    });
    var geoJsonLayer = L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties);
      },
    });

    markers.addLayer(geoJsonLayer);
    return markers;
  }

  var baselayers = { All: all, "Only Active": only_active };
  var overlays = {};

  all.addTo(leafletMap);

  L.control.layers(baselayers, overlays).addTo(leafletMap);
});
