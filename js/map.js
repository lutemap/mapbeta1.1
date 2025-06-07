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
    <div style="text-align: center; font-size: 12px; font-weight: bold;">Middle Ages</div>
    <div class="legend-icon" data-period="Middle Ages" data-type="Visual Document" style="text-align: center; font-size: 11px; cursor: pointer;">
      <img src="icons/clean_icon_medieval_visual.png" width="36" height="36" style="display:block; margin:0 auto 4px;">
      Visual Document
    </div>
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
