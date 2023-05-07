'use strict';

/*
* Если не активен ни один из режимов повтора, то плейлист крутится пока снова не дойдет до первого трека
* Если активен режим повтора плейлиста, то плейлист крутится бесконечно
* Если активен режим повтора трека, то трек крутится бесконечно
*/

const originalSongsList = [
    {
        name: 'Another Brick In The Wall',
        album: 'The Wall',
        year: '1979',
        artist: 'Pink Floyd',
        imageLink: 'img/song-1.jpg',
        audioLink: 'audio/song-1.mp3'
    },
    {
        name: 'Stairway to Heaven',
        album: 'Led Zeppelin IV',
        year: '1971',
        artist: 'Led Zeppelin',
        imageLink: 'img/song-2.jpg',
        audioLink: 'audio/song-2.mp3'
    },
    {
        name: 'Smoke on the Water',
        album: 'Machine Head',
        year: '1972',
        artist: 'Deep Purple',
        imageLink: 'img/song-3.jpg',
        audioLink: 'audio/song-3.mp3'
    },
    {
        name: 'The Show Must Go On',
        album: 'Innuendo',
        year: '1991',
        artist: 'Queen',
        imageLink: 'img/song-4.jpg',
        audioLink: 'audio/song-4.mp3'
    },
    {
        name: 'Africa',
        album: 'Toto IV',
        year: '1982',
        artist: 'Toto',
        imageLink: 'img/song-5.jpg',
        audioLink: 'audio/song-5.mp3'
    },
    {
        name: 'Dream On',
        album: 'Aerosmith',
        year: '1973',
        artist: 'Aerosmith',
        imageLink: 'img/song-6.jpg',
        audioLink: 'audio/song-6.mp3'
    },
    {
        name: 'Burning Heart',
        album: 'Rocky IV OST',
        year: '1985',
        artist: 'Survivor',
        imageLink: 'img/song-7.jpg',
        audioLink: 'audio/song-7.mp3'
    },
    {
        name: 'November Rain',
        album: 'Use Your Illusion I',
        year: '1991',
        artist: 'Guns N’ Roses',
        imageLink: 'img/song-8.jpg',
        audioLink: 'audio/song-8.mp3'
    },
    {
        name: 'Wind of Change',
        album: 'Crazy World',
        year: '1990',
        artist: 'Scorpions',
        imageLink: 'img/song-9.jpg',
        audioLink: 'audio/song-9.mp3'
    },
    {
        name: 'Paranoid',
        album: 'Black Sabbath',
        year: '1970',
        artist: 'Black Sabbath',
        imageLink: 'img/song-10.jpg',
        audioLink: 'audio/song-10.mp3'
    }

];
const audio = document.querySelector('#audio');

let songsList;
let songIndex;
let endSong;

function initStuff() {
    songsList = [...originalSongsList];
    songIndex = 0;
    endSong = songsList.length - 1;
    initPlaylist();
    loadSong();
}

// Для тестов
function printSongsList() {
    songsList.forEach((song, i) => {
        console.log(i + 1, song.name);
    });
}

document.addEventListener('DOMContentLoaded', initStuff);


/*Загрузка песни - START*/
const songName = document.querySelector('#song-name');
const songAlbum = document.querySelector('#song-album');
const songYear = document.querySelector('#song-year');
const songArtist = document.querySelector('#song-artist');
const songImage = document.querySelector('#song-image');

function loadSong() {
    let song = songsList[songIndex];

    songName.textContent = song.name;
    songAlbum.textContent = song.album;
    songYear.textContent = `(${song.year})`;
    songArtist.textContent = song.artist;
    songImage.src = song.imageLink;
    audio.src = song.audioLink;

    updatePlaylistActive();
}
/*Загрузка песни - END*/


/*Кнопка Play/Pause - START*/
const playPauseButton = document.querySelector('#play-pause-button');

function playSong() {
    playPauseButton.querySelector('i').classList.replace('fa-play', 'fa-pause');
    audio.play();
}

function pauseSong() {
    playPauseButton.querySelector('i').classList.replace('fa-pause', 'fa-play');
    audio.pause();
}

function playPauseSong() {
    (audio.paused) ? playSong() : pauseSong();
}

playPauseButton.addEventListener('click', playPauseSong);
/*Кнопка Play/Pause - END*/


/*Кнопка Next - START*/
const nextButton = document.querySelector('#next-button');

function nextSong() {
    let wasPaused = audio.paused && !audio.ended;
    songIndex = (songIndex >= songsList.length - 1) ? (0) : (songIndex + 1);
    loadSong();
    if (!wasPaused) playSong();
}

nextButton.addEventListener('click', nextSong);
/*Кнопка Next - END*/


/*Кнопка Prev - START*/
const prevButton = document.querySelector('#prev-button');

function prevSong() {
    let wasPaused = audio.paused && !audio.ended;
    songIndex = (songIndex <= 0) ? (songsList.length - 1) : (songIndex - 1);
    loadSong();
    if (!wasPaused) playSong();
}

prevButton.addEventListener('click', prevSong);
/*Кнопка Prev - END*/


/*Кнопка Shuffle - START*/
const shuffleButton = document.querySelector('#shuffle-button');
let shuffleOn = false;

shuffleButton.setAttribute('title', 'Обычный порядок');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function shuffleMode() {
    let isActive = shuffleButton.classList.contains('active');
    let currentSong = songsList[songIndex];

    if (isActive) {
        shuffleButton.classList.remove('active');
        shuffleButton.setAttribute('title', 'Обычный порядок');
        shuffleOn = false;
        songsList = [...originalSongsList];
    } else {
        shuffleButton.classList.add('active');
        shuffleButton.setAttribute('title', 'Случайный порядок');
        shuffleOn = true;
        songsList = shuffleArray(songsList);
    }

    songIndex = songsList.findIndex(song => song === currentSong);
    endSong = (shuffleOn && endSong > 0) ? (songIndex - 1) : (songsList.length - 1);

    initPlaylist();
    updatePlaylistActive();
}

shuffleButton.addEventListener('click', shuffleMode);
/*Кнопка Shuffle - END*/


/*Кнопка Repeat - START*/
const repeatButton = document.querySelector('#repeat-button');
let repeatOn = false;

repeatButton.setAttribute('title', 'Повтор выключен');

function repeatMode() {
    let iconType = repeatButton.querySelector('i').classList;
    let isActive = repeatButton.classList.contains('active');

    if (!isActive) {
        repeatButton.classList.add('active');
        repeatButton.setAttribute('title', 'Повтор плейлиста');
        repeatOn = true;
    } else if (iconType.contains('fa-repeat')) {
        iconType.replace('fa-repeat', 'fa-repeat-1');
        repeatButton.setAttribute('title', 'Повтор трека');
        audio.loop = true;
    } else {
        iconType.replace('fa-repeat-1', 'fa-repeat');
        repeatButton.classList.remove('active');
        repeatButton.setAttribute('title', 'Повтор выключен');
        audio.loop = false;
        repeatOn = false;
    }
}

repeatButton.addEventListener('click', repeatMode);
/*Кнопка Repeat - END*/


/*Конец трека - START*/
function endAction() {
    if (!repeatOn && songIndex === endSong) {
        pauseSong(); // только чтобы сменить иконку
        audio.currentTime = 0; // audio.ended становится false, ф-ция nextSong отрабатывает как задумано
    }

    nextSong();
}

audio.addEventListener('ended', endAction);
/*Конец трека - END*/


/*Прогресс/Время - START*/
const currentTime = document.querySelector('#current-time');
const songDuration = document.querySelector('#duration');
const progressBar = document.querySelector('#progress-bar');

function formatTime(inputSeconds) {
    let minute = Math.floor(inputSeconds / 60);
    let second = Math.floor(inputSeconds % 60);
    second = (second < 10) ? ('0' + second) : (second);
    return `${minute}:${second}`;
}

function loadDuration() {
    updateProgress();
    progressBar.max = Math.floor(audio.duration);
    songDuration.textContent = formatTime(audio.duration);
}

function updateProgress() {
    progressBar.value = audio.currentTime;
    currentTime.textContent = formatTime(audio.currentTime);
}

function updateProgressManually() {
    audio.currentTime = progressBar.value;
    currentTime.textContent = formatTime(progressBar.value);
}

audio.addEventListener('loadedmetadata', loadDuration);
audio.addEventListener('timeupdate', updateProgress);
progressBar.addEventListener('input', updateProgressManually);
/*Прогресс/Время - END*/


/*Громкость - START*/
const volumeBar = document.querySelector('#volume-bar');
const currentVolume = document.querySelector('#current-volume');
const volumeButton = document.querySelector('#volume-button');

volumeBar.value = 0.5;
currentVolume.textContent = `${Math.floor(volumeBar.value * 100)}`;

function changeVolume() {
    let iconType = volumeButton.querySelector('i').classList;

    audio.muted = false;
    audio.volume = volumeBar.value;
    currentVolume.textContent = `${Math.floor(volumeBar.value * 100)}`;

    if (audio.volume <= 0.02) {
        iconType.value = 'fa-solid fa-volume-off';
    } else if (audio.volume <= 0.35) {
        iconType.value = 'fa-solid fa-volume-low';
    } else if (audio.volume <= 0.7) {
        iconType.value = 'fa-solid fa-volume';
    } else {
        iconType.value = 'fa-solid fa-volume-high';
    }
}

function muteVolume() {
    let iconType = volumeButton.querySelector('i').classList;

    if (!audio.muted) {
        audio.muted = true;
        iconType.value = 'fa-solid fa-volume-slash';
    } else {
        changeVolume();
    }
}

volumeBar.addEventListener('input', changeVolume);
volumeButton.addEventListener('click', muteVolume);
/*Громкость - END*/


/*Плейлист - START*/
const playlistButton = document.querySelector('#playlist-button');
const playlistContainer = document.querySelector('.playlist-container');
const playlistSongs = document.querySelector('#playlist-songs');

playlistButton.setAttribute('title', 'Плейлист');

function updatePlaylistActive() {
    let toRemove = document.querySelector('.playlist-song.active');
    if (toRemove !== null) toRemove.classList.remove('active');
    document.querySelector(`#song-${songIndex}`).classList.add('active');
}

function loadAndPlayPlaylistSong(id) {
    songIndex = id;
    loadSong();
    playSong();
}

function initPlaylist() {
    playlistSongs.innerHTML = '';
    for (let i = 0; i < songsList.length; i++) {
        let playlistSong = songsList[i];
        playlistSongs.innerHTML +=
            `<div id="song-${i}" class='playlist-song' onclick='loadAndPlayPlaylistSong(${i})'>
                <div class="playlist-song-image-container">
                    <img src="${playlistSong.imageLink}" alt="playlist-song-image" class="playlist-song-image"/>
                </div>
                <div class="playlist-song-info-container">
                    <p class="playlist-song-name">${playlistSong.name}</p>
                    <p class="playlist-song-album-year">${playlistSong.album} (${playlistSong.year})</p>
                    <p class="playlist-song-artist">${playlistSong.artist}</p>
                </div>
            </div>`;
    }
}

function togglePlaylist() {
    let iconType = playlistButton.querySelector('i').classList;
    iconType.toggle('fa-music-slash');
    iconType.toggle('fa-music');

    playlistContainer.classList.toggle('active');
}

playlistButton.addEventListener('click', togglePlaylist);
/*Плейлист - END*/
