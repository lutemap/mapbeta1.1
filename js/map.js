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
  let p = feature.properties;

  let popupContent = `
    <strong>${p.name}</strong><br>
    <em>${p.description}</em>
    <a href="#" onclick="this.nextElementSibling.style.display='block'; this.style.display='none'; return false;" style="display:block; margin-top:6px; font-size:11px; font-style: italic; color: #0066cc;">
      Show Detailed Classifications
    </a>
    <div style="display:none; font-size:11.5px;">
      <strong>Basic Information</strong>
      <ul>
        <li>Period: ${p.period}</li>
        <li>Data Type: ${p.data_type}</li>
        <li>Century: ${p.century}</li>
        <li>Geography: ${p.geography}</li>
        <li>Culture: ${p.culture}</li>
      </ul>

      <strong>Structural and Morphological Classification</strong>
      <ul>
        <li>Neck Length: ${p.neck_length}</li>
        <li>Soundbox Type: ${p.soundbox_type}</li>
        <li>Material: ${p.material}</li>
        <li>String Count: ${p.string_count}</li>
        <li>Tuning Info: ${p.tuning_info}</li>
        <li>Fret Info: ${p.fret_info}</li>
        <li>Visual Design: ${p.visual_design}</li>
      </ul>

      <strong>Contextual and Performative Classification</strong>
      <ul>
        <li>Performance Type: ${p.performance_type}</li>
        <li>Right Hand Technique: ${p.right_hand_tech}</li>
        <li>Left Hand Technique: ${p.left_hand_tech}</li>
        <li>Plectrum Technique: ${p.plectrum_tech}</li>
        <li>Posture: ${p.posture}</li>
        <li>Performance Mode: ${p.performance_mode}</li>
        <li>Semantic: ${p.semantic}</li>
        <li>Location Info: ${p.location_info}</li>
      </ul>
    </div>
  `;

  layer.bindPopup(popupContent);
  layer.on('popupopen', function (e) {
    map.panTo(e.popup._latlng, { animate: true });
    setTimeout(() => map.panBy([0, -100]), 200);
  });
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
