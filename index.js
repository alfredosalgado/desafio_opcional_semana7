const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const { obtenerJugadores, registrarJugador } = require('./controllers/jugadores');
const { obtenerEquipos, agregarEquipo } = require('./controllers/equipos');
const { secretKey } = require('./utils.js');
const { verifyToken } = require('./middlewares/auth.middleware.js'); // Importamos el middleware

app.use(express.json());

// NUEVA RUTA DE LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '1234') {
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
    } else {
        res.status(400).json({ message: 'Credenciales incorrectas' });
    }
});

// RUTAS EXISTENTES CON MIDDLEWARE APLICADO
app.get("/equipos", obtenerEquipos);
app.post("/equipos", verifyToken, agregarEquipo);

app.get("/equipos/:teamID/jugadores", obtenerJugadores);
app.post("/equipos/:teamID/jugadores", verifyToken, registrarJugador);

const server = app.listen(3000, console.log("SERVER ON"));
module.exports = server;