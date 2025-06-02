const infoBox = document.createElement('div');
infoBox.style.position = 'absolute';
infoBox.style.top = '10px';
infoBox.style.left = '10px';
infoBox.style.background = 'rgba(255, 255, 255, 0.9)';
infoBox.style.padding = '10px';
infoBox.style.borderRadius = '8px';
infoBox.style.maxWidth = '280px';
infoBox.style.fontFamily = 'sans-serif';
infoBox.style.zIndex = 1000;
infoBox.innerHTML = `
  <div style="font-weight: bold; font-size: 16px;">Hacettepe University</div>
  <div style="height: 20px;"></div>
  <div style="font-weight: bold; font-size: 14px;">
    Geographical Distribution Map<br>
    of Data on the Lute Instrument<br>
    from Antiquity to the End of the Middle Ages
  </div>
  <div style="margin-top: 10px; font-size: 12px;">
    Created as the PhD Dissertation Output.
  </div>
`;
document.body.appendChild(infoBox);


var map = L.map('map', {
  zoomControl: false,
  maxZoom: 28,
  minZoom: 1
}).fitBounds([[25.0, 15.0], [52.0, 52.0]]);

var esriStreet = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: '',
  maxZoom: 28
}).addTo(map);

var esriSatellite = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '',
  maxZoom: 28
});

var baseMaps = {
  "ESRI Street": esriStreet,
  "ESRI Satellite": esriSatellite
};

L.control.layers(baseMaps, null, { position: 'bottomright' }).addTo(map);
L.control.zoom({ position: 'bottomright' }).addTo(map);

function getIconUrl(period, dataType) {
  const key = `${period}_${dataType}`;
  const iconMap = {
    "Antiquity_Visual Document": "map_data_2_AntiquityVisualDocument0.png",
    "Antiquity_Written Document": "map_data_2_AntiquityWrittenDocument1.png",
    "Middle Ages_Visual Document": "map_data_2_MiddleAgesVisualDocument2.png",
    "Middle Ages_Written Document": "map_data_2_MiddleAgesWrittenDocument3.png"
  };
  return `legend/${iconMap[key] || "map_data_2_AntiquityVisualDocument0.png"}`;
}

function pointToMarker(feature, latlng) {
  const props = feature.properties;
  const iconUrl = getIconUrl(props.period, props.data_type);

  const icon = L.icon({
    iconUrl: iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  return L.marker(latlng, { icon: icon });
}

function onEachFeature(feature, layer) {
  let props = feature.properties;
  let popupContent = `<strong>${props.name}</strong><br>${props.description}`;
  layer.bindPopup(popupContent);
}

var markers = L.geoJSON(json_map_data_2, {
  pointToLayer: pointToMarker,
  onEachFeature: onEachFeature
}).addTo(map);

function applyFilters() {
  const period = Array.from(document.querySelectorAll(".filter-period:checked")).map(e => e.value);
  const dataType = Array.from(document.querySelectorAll(".filter-data_type:checked")).map(e => e.value);
  const century = Array.from(document.querySelectorAll(".filter-century:checked")).map(e => e.value);
  const geography = Array.from(document.querySelectorAll(".filter-geography:checked")).map(e => e.value);
  const culture = Array.from(document.querySelectorAll(".filter-culture:checked")).map(e => e.value);

  markers.clearLayers();
  markers.addData(json_map_data_2.features.filter(f => {
    return (
      period.includes(f.properties.period) &&
      dataType.includes(f.properties.data_type) &&
      century.includes(f.properties.century) &&
      geography.includes(f.properties.geography) &&
      culture.includes(f.properties.culture)
    );
  }));
}

document.querySelectorAll('#filter-panel input[type=checkbox]').forEach(cb => {
  cb.addEventListener('change', applyFilters);
});
