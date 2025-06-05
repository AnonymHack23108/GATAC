let library = [];
let currentCategory = null;

async function loadProfiles() {
  const res = await fetch('/api/profiles');
  const profiles = await res.json();
  const container = document.getElementById('profiles');
  container.innerHTML = '';
  profiles.forEach(p => {
    const div = document.createElement('div');
    div.className = 'profile';
    const img = document.createElement('img');
    img.src = `/avatars/${p.avatar}`;
    img.alt = p.name;
    const span = document.createElement('span');
    span.textContent = p.name;
    div.appendChild(img);
    div.appendChild(span);
    div.onclick = () => selectProfile(p.name);
    container.appendChild(div);
  });
}

function selectProfile(name) {
  document.getElementById('profile-selection').classList.add('hidden');
  document.getElementById('main').classList.remove('hidden');
  loadLibrary();
}

async function loadLibrary() {
  const res = await fetch('/api/categories');
  const categories = await res.json();
  const container = document.getElementById('categories');
  container.innerHTML = '';
  library = [];

  await Promise.all(
    categories.map(async cat => {
      const btn = document.createElement('button');
      btn.textContent = cat;
      btn.onclick = () => showCategory(cat);
      container.appendChild(btn);

      const r = await fetch(`/api/videos/${cat}`);
      const vids = await r.json();
      vids.forEach(v => library.push({ category: cat, name: v }));
    })
  );

  if (categories.length > 0) showCategory(categories[0]);
}

function showCategory(category) {
  currentCategory = category;
  const vids = library.filter(v => v.category === category);
  displayVideos(vids);
}

function displayVideos(videos) {
  const container = document.getElementById('videos');
  container.innerHTML = '';
  videos.forEach(v => {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = v.name;
    link.onclick = () => playVideo(v.category, v.name);
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

function handleSearch() {
  const term = document.getElementById('searchInput').value.toLowerCase();
  const results = library.filter(v => v.name.toLowerCase().includes(term));
  displayVideos(results);
}

window.onload = () => {
  loadProfiles();
  document.getElementById('searchInput').addEventListener('input', handleSearch);
};
