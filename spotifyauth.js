document.addEventListener("DOMContentLoaded", function () {
    async function fetchCurrentlyPlaying() {
        try {
            const response = await fetch('/currently-playing', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            });
            if (!response.ok) throw new Error('Error al obtener la información de la canción');
            const data = await response.json();
            console.log('Datos de la canción recibidos:', data);
            return data;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    function updateSongInfo(song) {
        console.log('Actualizando información de la canción:', song);
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

    async function init() {
        const params = new URLSearchParams(window.location.search);
        let access_token = params.get('access_token');
        console.log('Token de acceso inicial:', access_token);
        if (access_token) {
            localStorage.setItem('access_token', access_token);
        } else {
            access_token = localStorage.getItem('access_token');
        }
        console.log('Token de acceso final:', access_token);

        if (!access_token) {
            window.location.href = '/login';
        } else {
            const song = await fetchCurrentlyPlaying();
            updateSongInfo(song);
            setInterval(async () => {
                const updatedSong = await fetchCurrentlyPlaying();
                updateSongInfo(updatedSong);
            }, 10000); // Actualiza cada 10 segundos
        }
    }

    document.getElementById('toggle-button').addEventListener('click', () => {
        const songInfo = document.getElementById('song-info');
        songInfo.style.display = songInfo.style.display === 'none' ? 'block' : 'none';
    });

    init();
});
