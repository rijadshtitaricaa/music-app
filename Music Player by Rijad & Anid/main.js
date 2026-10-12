const playerPanel = document.querySelector('.player-panel');
const playButton = document.querySelector('.play-button');
const audio = document.getElementById('track-audio');
const songItems = document.querySelectorAll('.song-item');
const controlPills = document.querySelectorAll('.control-pill');
const vinylLabel = document.getElementById('vinyl-label');
const root = document.documentElement;

const themeMap = {
  gold: {
    accent: '#d4af6b',
    accentSoft: '#f1d6a2',
    background: '#0b0b0d',
    panel: '#111318',
    text: '#f4efe8',
    muted: '#b7b1a8'
  },
  green: {
    accent: '#6ae0a1',
    accentSoft: '#9ef0c4',
    background: '#07140f',
    panel: '#0f1e1a',
    text: '#edfdf5',
    muted: '#bdd8c8'
  },
  red: {
    accent: '#ff6b6b',
    accentSoft: '#ff9c9c',
    background: '#170a0b',
    panel: '#231214',
    text: '#fff0f0',
    muted: '#d9b7b7'
  },
  blue: {
    accent: '#6aa9ff',
    accentSoft: '#9dc1ff',
    background: '#091621',
    panel: '#0f1c2c',
    text: '#edf6ff',
    muted: '#bfcee6'
  }
};

function applyTheme(themeName) {
  const theme = themeMap[themeName] || themeMap.gold;
  root.style.setProperty('--gold', theme.accent);
  root.style.setProperty('--gold-soft', theme.accentSoft);
  root.style.setProperty('--bg', theme.background);
  root.style.setProperty('--panel', theme.panel);
  root.style.setProperty('--text', theme.text);
  root.style.setProperty('--muted', theme.muted);
  root.style.setProperty('--button', theme.accent);
  root.style.setProperty('--button-hover', theme.accentSoft);
}

function updateVinylLabel(songName) {
  if (!vinylLabel || !songName) return;
  const letter = songName.trim().charAt(0).toUpperCase();
  vinylLabel.textContent = letter;
}

function initializeTheme() {
  const activeSong = document.querySelector('.song-item.active');
  if (!activeSong) return;

  const themeName = activeSong.dataset.theme || 'gold';
  const songName = activeSong.querySelector('.song-name')?.textContent || 'Midnight Echo';
  applyTheme(themeName);
  updateVinylLabel(songName);
}

if (playerPanel && playButton && audio) {
  initializeTheme();
  playButton.addEventListener('click', async () => {
    const isPlaying = playerPanel.classList.toggle('is-playing');
    playButton.textContent = isPlaying ? '❚❚ Pause' : '▶ Play';
    playButton.setAttribute('aria-pressed', String(isPlaying));

    if (isPlaying) {
      try {
        await audio.play();
      } catch (error) {
        console.log('Audio playback failed:', error);
      }
    } else {
      audio.pause();
    }
  });

  songItems.forEach((songItem) => {
    songItem.addEventListener('click', async () => {
      songItems.forEach((item) => item.classList.remove('active'));
      songItem.classList.add('active');

      const trackSrc = songItem.dataset.src;
      const themeName = songItem.dataset.theme || 'gold';
      const songName = songItem.querySelector('.song-name')?.textContent || 'M';
      applyTheme(themeName);
      updateVinylLabel(songName);

      if (trackSrc) {
        audio.src = trackSrc;
        audio.load();

        if (playerPanel.classList.contains('is-playing')) {
          try {
            await audio.play();
          } catch (error) {
            console.log('Track switch playback failed:', error);
          }
        }
      }
    });
  });

  controlPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const isActive = pill.classList.toggle('active');
      pill.setAttribute('aria-pressed', String(isActive));
    });
  });
}
