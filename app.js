const main = document.querySelector('main');
const search = document.querySelector('input');
const button = document.querySelector('button');

const createPodcastResult = podcast => {
  return `
      <div class="podcast">
        <img src="${podcast.artworkUrl100}" />
        <div>
          <h3>${podcast.collectionName}</h2>
          <div><b>Artist</b> ${podcast.artistName}</div>
          <div><b>Tracks</b> ${podcast.trackCount}</div>
        </div>
      </div>`;
};

const updatePodcasts = async searchTerm => {
  const res = await fetch(
    `https://itunes.apple.com/search?key=podcast&term=${searchTerm}`
  );
  const json = await res.json();

  main.innerHTML = json.results.map(createPodcastResult).join('\n');
};

button.addEventListener('click', e => {
  updatePodcasts(search.value);
});

search.addEventListener('keypress', e => {
  var key = e.which || e.keyCode;
  if (key === 13) {
    // 13 is enter
    updatePodcasts(search.value);
  }
});

window.addEventListener('load', e => {
  try {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js');
      console.log('Service Worker registered');
    }
  } catch (error) {
    console.log('Service Worker registration failed', error.message);
    alert(`Can't run this app offline`);
  }
});
