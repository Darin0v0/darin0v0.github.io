function toggleLayer(layerId) {
  const layers = document.querySelectorAll('.hidden-layer');
  layers.forEach(layer => {
    if (layer.id === layerId) {
      layer.classList.toggle('active');
    } else {
      layer.classList.remove('active');
    }
  });
}

// Zegar w stylu terminala
function updateClock() {
  const now = new Date();
  const timeString = now.toTimeString().split(' ')[0];
  const clockEl = document.getElementById('clock');
  if (clockEl) clockEl.textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();
