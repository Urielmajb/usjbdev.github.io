document.addEventListener("DOMContentLoaded", function () {

// Parámetros de la API de Spotify
const client_id = 'fc2aeeb9143e468eb59cc965228b8b07';
const redirect_uri = 'http://localhost:5500/portafolio.html'; // URL de redirección de tu Live Server
const scopes = 'user-read-currently-playing user-read-playback-state';
let access_token = '';

// Función para obtener el token de acceso desde la URL
function getAccessToken() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
}

// Redirigir al usuario a la página de autorización de Spotify
function authorizeSpotify() {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes}`;
    window.location.href = authUrl;
}

// Función para obtener la información de la canción actualmente reproducida
async function fetchCurrentlyPlaying() {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        });
        if (!response.ok) throw new Error('Error al obtener la información de la canción');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Función para actualizar la información de la canción en la interfaz
function updateSongInfo(song) {
    const songName = document.getElementById('song-name');
    const artistName = document.getElementById('artist-name');
    const albumArt = document.getElementById('album-art');

    if (song && song.item) {
        songName.textContent = song.item.name;
        artistName.textContent = song.item.artists.map(artist => artist.name).join(', ');
        albumArt.src = song.item.album.images[0].url;
    } else {
        songName.textContent = 'No hay información de la canción disponible';
        artistName.textContent = '';
        albumArt.src = '';
    }
}

// Función para manejar el toggle del botón
function toggleSongInfo() {
    const songInfo = document.getElementById('song-info');
    songInfo.style.display = songInfo.style.display === 'none' ? 'block' : 'none';
}

document.getElementById('toggle-button').addEventListener('click', toggleSongInfo);

// Inicializa la obtención de la información de la canción y la actualización periódica
async function init() {
    access_token = getAccessToken();
    if (!access_token) {
        authorizeSpotify();
    } else {
        const song = await fetchCurrentlyPlaying();
        updateSongInfo(song);
        setInterval(async () => {
            const updatedSong = await fetchCurrentlyPlaying();
            updateSongInfo(updatedSong);
        }, 10000); // Actualiza cada 10 segundos
    }
}

init();
});