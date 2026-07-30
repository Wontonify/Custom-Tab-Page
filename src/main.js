import './style.css'

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

async function getAPOD() {
  const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`);
  if (!res.ok) throw new Error(`NASA said ${res.status}`);
  return res.json();
}

getAPOD()
  .then(data => {
    if (data.media_type !== 'image') return;

    document.documentElement.style.setProperty(
      '--apod',
      `url("${data.hdurl || data.url}")`
    );
    document.body.classList.add('has-apod');
  })
  .catch(err => console.error(err));
