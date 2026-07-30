import './style.css'

const ENGINES = {
  google: { label: 'Google', action: 'https://www.google.com/search', param: 'q' },
  duckduckgo: { label: 'DuckDuckGo', action: 'https://duckduckgo.com/', param: 'q' },
  bing: { label: 'Bing', action: 'https://www.bing.com/search', param: 'q' },
  youtube: { label: 'YouTube', action: 'https://www.youtube.com/results', param: 'search_query' },
  wikipedia: { label: 'Wikipedia', action: 'https://en.wikipedia.org/w/index.php', param: 'search' },
};

const form = document.querySelector('#search');
const input = form.querySelector('input');
const toggle = document.querySelector('#engine-toggle');
const label = document.querySelector('#engine-label');
const menu = document.querySelector('#engine-menu');
 
menu.innerHTML = Object.entries(ENGINES)
  .map(([key, engine]) => `<li role="option" tabindex="-1" data-key="${key}">${engine.label}</li>`)
  .join('');

const items = [...menu.children];

function useEngine(key) {
  const active = key in ENGINES ? key : 'google';
  const engine = ENGINES[active];

  form.action = engine.action;
  input.name = engine.param;
  input.placeholder = `Search ${engine.label}`;
  label.textContent = engine.label;
  items.forEach(li => li.setAttribute('aria-selected', li.dataset.key === active));
}

function setOpen(open) {
  toggle.setAttribute('aria-expanded', open);
  menu.hidden = !open;
}

useEngine(localStorage.getItem('engine') ?? 'google');

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  setOpen(!open);
  if (!open) (items.find(li => li.getAttribute('aria-selected') === 'true') ?? items[0]).focus();
});

menu.addEventListener('click', event => {
  const li = event.target.closest('li');
  if (!li) return;

  localStorage.setItem('engine', li.dataset.key);
  useEngine(li.dataset.key);
  setOpen(false);
  input.focus();
});

menu.addEventListener('keydown', event => {
  const index = items.indexOf(document.activeElement);

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    const step = event.key === 'ArrowDown' ? 1 : -1;
    items[(index + step + items.length) % items.length].focus();
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    document.activeElement.click();
  }
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || menu.hidden) return;
  setOpen(false);
  toggle.focus();
});

document.addEventListener('click', event => {
  if (!event.target.closest('#engine')) setOpen(false);
});

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

async function getAPOD() {
  const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`);
  if (!res.ok) throw new Error(`NASA said ${res.status}`);
  return res.json();
}

function showImage(url) {
  document.documentElement.style.setProperty('--apod', `url("${url}")`);
  document.body.classList.add('has-apod');
}

const cached = localStorage.getItem('apod-url');
if (cached) showImage(cached);

getAPOD()
  .then(data => {
    if (data.media_type !== 'image') return;

    const url = data.hdurl || data.url;
    if (url === cached) return;

    localStorage.setItem('apod-url', url);
    showImage(url);
  })
  .catch(err => console.error(err));
