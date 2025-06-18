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
  <div style="margin-top: 10px; font-size: 12px;">
    Hacettepe University
  </div>
  <div style="font-weight: bold; font-size: 16px;">Chronological Atlas of Lute-Typed Musical Instruments </div>
  <div style="height: 20px;"></div>
  <div style="font-weight: bold; font-size: 14px;">
    Chronological and Geographical Distribution Map<br>
    of Data on the Lute Instrument<br>
    in Anatolia and Its Culturally Affiliated Regions<br>
    from Antiquity through the End of the Middle Ages<br>
  </div>
  <div style="margin-top: 10px; font-size: 12px;">
    Created as a PhD Dissertation Output.<br>
  </div>
  </div>
  <div style="margin-top: 10px; font-size: 12px;">
    Antiquity from the 4th Millennium BC to the V. Century AD<br>
    Middle Ages from the V. Century AD to the XVI. Century AD.<br> <br> Representative Data
  </div>
`;
document.body.appendChild(infoBox);

const legendBox = document.createElement('div');
legendBox.style.position = 'absolute';
legendBox.style.bottom = '10px';
legendBox.style.left = '10px';
legendBox.style.background = 'rgba(255, 255, 255, 0.9)';
legendBox.style.padding = '10px';
legendBox.style.borderRadius = '8px';
legendBox.style.fontFamily = 'sans-serif';
legendBox.style.zIndex = 1000;
legendBox.innerHTML = `
  <div style="display: flex; gap: 12px; align-items: center;">
    <div class="legend-icon" data-period="Antiquity" data-type="Visual Document" style="text-align: center; font-size: 11px; cursor: pointer;">
      <img src="icons/clean_icon_bronze_visual.png" width="36" height="36" style="display:block; margin:0 auto 4px;">
      Visual Document
    </div>
    <div style="text-align: center; font-size: 12px; font-weight: bold;">Antiquity</div>
    <div class="legend-icon" data-period="Antiquity" data-type="Written Document" style="text-align: center; font-size: 11px; cursor: pointer;">
      <img src="icons/clean_icon_bronze_written.png" width="36" height="36" style="display:block; margin:0 auto 4px;">
      Written Document
    </div>
    <div class="legend-icon" data-period="Middle Ages" data-type="Visual Document" style="text-align: center; font-size: 11px; cursor: pointer;">
      <img src="icons/clean_icon_medieval_visual.png" width="36" height="36" style="display:block; margin:0 auto 4px;">
      Visual Document
    </div>
    <div style="text-align: center; font-size: 12px; font-weight: bold;">Middle Ages</div>
    <div class="legend-icon" data-period="Middle Ages" data-type="Written Document" style="text-align: center; font-size: 11px; cursor: pointer;">
      <img src="icons/clean_icon_medieval_written.png" width="36" height="36" style="display:block; margin:0 auto 4px;">
      Written Document
    </div>
  </div>
`;
document.body.appendChild(legendBox);

const legendIcons = document.querySelectorAll('.legend-icon');
let activeLegend = null;
legendIcons.forEach(icon => {
  icon.addEventListener('click', function () {
    if (activeLegend === this) {
      document.querySelectorAll('.filter-period, .filter-data_type').forEach(cb => cb.checked = true);
      legendIcons.forEach(i => i.style.outline = '');
      activeLegend = null;
    } else {
      const selectedPeriod = this.dataset.period;
      const selectedType = this.dataset.type;
      document.querySelectorAll('.filter-period').forEach(cb => cb.checked = cb.value === selectedPeriod);
      document.querySelectorAll('.filter-data_type').forEach(cb => cb.checked = cb.value === selectedType);
      legendIcons.forEach(i => i.style.outline = '');
      this.style.outline = '2px solid #333';
      this.style.outlineOffset = '2px';
      activeLegend = this;
    }
    applyFilters();
  });
});

var map = L.map('map', {
  zoomControl: false,
  maxZoom: 28,
  minZoom: 1
}).fitBounds([[25.0, 15.0], [52.0, 52.0]]);

var esriStreet = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: '',
  maxZoom: 28
});

var ohm = L.tileLayer('https://tiles.openhistoricalmap.org/ohm/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenHistoricalMap contributors',
  maxZoom: 22
});

var esriSatellite = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '',
  maxZoom: 28
});

esriStreet.addTo(map);

var baseMaps = {
  "ESRI Street": esriStreet,
  "ESRI Satellite": esriSatellite,
  "Open Historical Map": ohm
};

L.control.layers(baseMaps, null, { position: 'bottomright' }).addTo(map);
L.control.zoom({ position: 'bottomright' }).addTo(map);

const iconMap = {
  "Antiquity_Visual Document": L.icon({
    iconUrl: 'icons/clean_icon_bronze_visual.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  }),
  "Antiquity_Written Document": L.icon({
    iconUrl: 'icons/clean_icon_bronze_written.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  }),
  "Middle Ages_Visual Document": L.icon({
    iconUrl: 'icons/clean_icon_medieval_visual.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  }),
  "Middle Ages_Written Document": L.icon({
    iconUrl: 'icons/clean_icon_medieval_written.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  })
};

function pointToMarker(feature, latlng) {
  const props = feature.properties;
  const key = `${props.period}_${props.data_type}`;
  const icon = iconMap[key] || iconMap["Antiquity_Visual Document"];
  return L.marker(latlng, { icon: icon });
}

function onEachFeature(feature, layer) {
  let p = feature.properties;

  let popupContent = `
    <div style="max-height: 500px; overflow-y: auto; padding: 8px;">
      <strong>${p.name}</strong><br>
      <em>${p.description}</em>
      <a href="#" onclick="this.nextElementSibling.style.display='block'; this.style.display='none'; return false;" style="display:block; margin-top:6px; font-size:11px; font-style: italic; color: #0066cc;">
        Show Detailed Classifications
      </a>
      <div style="display:none; font-size:11.5px; margin-top: 8px;">
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
    </div>
  `;

  layer.bindPopup(popupContent);
  layer.on('popupopen', function (e) {
    map.panTo(e.popup._latlng, { animate: true });
    setTimeout(() => map.panBy([0, -180]), 200);
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

const centuryOptions = [
  "12th century",
  "12th century BC",
  "2nd century BC"
];

const sliderGroup = document.createElement('div');
sliderGroup.className = 'filter-group';
sliderGroup.innerHTML = `
  <strong>Century (Slider)</strong><br>
  <input type="range" id="century-range" min="0" max="${centuryOptions.length - 1}" value="0">
  <div style="font-size: 11px;">Selected: <span id="century-value">${centuryOptions[0]}</span></div>
`;

document.getElementById('filter-panel').appendChild(sliderGroup);

document.getElementById("century-range").addEventListener("input", function () {
  const selected = centuryOptions[this.value];
  document.getElementById("century-value").textContent = selected;

  document.querySelectorAll(".filter-century").forEach(cb => {
    cb.checked = false;
  });

  const target = Array.from(document.querySelectorAll(".filter-century"))
    .find(cb => cb.value === selected);
  if (target) target.checked = true;

  applyFilters();
});
