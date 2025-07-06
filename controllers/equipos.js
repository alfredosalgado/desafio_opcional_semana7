const { getTeams, addTeam } = require('../db/consultas');

const obtenerEquipos = async (req, res) => {
    try {
        const equipos = await getTeams();
        res.status(200).json(equipos);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const agregarEquipo = async (req, res) => {
    try {
        const equipo = req.body;
        const nuevoEquipo = await addTeam(equipo);
        res.status(201).json(nuevoEquipo);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { obtenerEquipos, agregarEquipo };