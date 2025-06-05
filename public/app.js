async function loadCategories() {
  const res = await fetch('/api/categories');
  const categories = await res.json();
  const container = document.getElementById('categories');
  container.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.onclick = () => loadVideos(cat);
    container.appendChild(btn);
  });
}

async function loadVideos(category) {
  const res = await fetch(`/api/videos/${category}`);
  const videos = await res.json();
  const container = document.getElementById('videos');
  container.innerHTML = '';
  videos.forEach(v => {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = v;
    link.onclick = () => playVideo(category, v);
    container.appendChild(link);
    container.appendChild(document.createElement('br'));
  });
}

function playVideo(category, file) {
  const player = document.getElementById('player');
  player.src = `/video/${category}/${file}`;
  player.load();
  player.play();
}

window.onload = loadCategories;
