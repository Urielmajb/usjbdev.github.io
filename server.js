// server.js
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');  // Importa el módulo path
const app = express();
const port = 5500;

const client_id = 'fc2aeeb9143e468eb59cc965228b8b07';
const client_secret = '4bc9a49c2cfe44d284d5243759395087'; // Reemplaza esto con tu client secret
const redirect_uri = 'http://localhost:5500/callback';  // Asegúrate de que esta URL coincida con la registrada en Spotify


let tokens = {};

// Sirve archivos estáticos desde el directorio 'usjbdev'
app.use(express.static(path.join(__dirname, '/')));


app.get('/login', (req, res) => {
    const scopes = 'user-read-currently-playing user-read-playback-state';
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes}`;
    console.log('Redirigiendo a:', authUrl);
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    console.log('Código recibido:', code);
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
            },
            body: new URLSearchParams({
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            })
        });
        const data = await response.json();
        console.log('Respuesta del token:', data);
        if (data.error) {
            console.error('Error obteniendo el token:', data.error);
            res.redirect('/login');
        } else {
            tokens.access_token = data.access_token;
            tokens.refresh_token = data.refresh_token;
            tokens.expires_in = data.expires_in;
            tokens.timestamp = Date.now();
            res.redirect(`/portafolio.html?access_token=${data.access_token}`);
        }
    } catch (error) {
        console.error('Error en la solicitud del token:', error);
        res.redirect('/login');
    }
});

app.get('/refresh-token', async (req, res) => {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: tokens.refresh_token
            })
        });
        const data = await response.json();
        console.log('Respuesta de la actualización del token:', data);
        if (data.error) {
            console.error('Error actualizando el token:', data.error);
            res.status(401).json(data.error);
        } else {
            tokens.access_token = data.access_token;
            tokens.expires_in = data.expires_in;
            tokens.timestamp = Date.now();
            res.json(data);
        }
    } catch (error) {
        console.error('Error en la solicitud de actualización del token:', error);
        res.status(500).json({ error: 'Error en la solicitud de actualización del token' });
    }
});

app.get('/currently-playing', async (req, res) => {
    const access_token = tokens.access_token;
    console.log('Token de acceso recibido:', access_token);
    const isTokenExpired = Date.now() > tokens.timestamp + tokens.expires_in * 1000;
    if (isTokenExpired) {
        console.log('El token ha expirado, actualizando...');
        try {
            const refreshResponse = await fetch('http://localhost:5500/refresh-token');
            const refreshData = await refreshResponse.json();
            if (refreshData.error) {
                res.status(401).json(refreshData.error);
                return;
            }
        } catch (error) {
            console.error('Error al actualizar el token:', error);
            res.status(500).json({ error: 'Error al actualizar el token' });
            return;
        }
    }
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                'Authorization': 'Bearer ' + tokens.access_token
            }
        });
        const data = await response.json();
        console.log('Datos de la canción:', data);
        if (data.error) {
            console.error('Error al obtener la canción:', data.error);
            res.status(data.error.status).json(data.error);
        } else {
            res.json(data);
        }
    } catch (error) {
        console.error('Error en la solicitud de la canción:', error);
        res.status(500).json({ error: 'Error en la solicitud de la canción' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
// app.get('/login', (req, res) => {
//     const scopes = 'user-read-currently-playing user-read-playback-state';
//     const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes}`;
//     console.log('Redirigiendo a:', authUrl);
//     res.redirect(authUrl);
// });

// app.get('/callback', async (req, res) => {
//     const code = req.query.code || null;
//     console.log('Código recibido:', code);
//     try {
//         const response = await fetch('https://accounts.spotify.com/api/token', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
//             },
//             body: new URLSearchParams({
//                 code: code,
//                 redirect_uri: redirect_uri,
//                 grant_type: 'authorization_code'
//             })
//         });
//         const data = await response.json();
//         console.log('Respuesta del token:', data);
//         if (data.error) {
//             console.error('Error obteniendo el token:', data.error);
//             res.redirect('/login');
//         } else {
//             res.redirect(`/portafolio.html?access_token=${data.access_token}`);
//         }
//     } catch (error) {
//         console.error('Error en la solicitud del token:', error);
//         res.redirect('/login');
//     }
// });

// app.get('/currently-playing', async (req, res) => {
//     const access_token = req.headers['authorization'].split(' ')[1];
//     console.log('Token de acceso recibido:', access_token);
//     try {
//         const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
//             headers: {
//                 'Authorization': 'Bearer ' + access_token
//             }
//         });
//         const data = await response.json();
//         console.log('Datos de la canción:', data);
//         if (data.error) {
//             console.error('Error al obtener la canción:', data.error);
//             res.status(data.error.status).json(data.error);
//         } else {
//             res.json(data);
//         }
//     } catch (error) {
//         console.error('Error en la solicitud de la canción:', error);
//         res.status(500).json({ error: 'Error en la solicitud de la canción' });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}/`);
// });