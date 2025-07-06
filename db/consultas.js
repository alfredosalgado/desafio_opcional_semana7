const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'admin',
    database: 'futscript',
    allowExitOnIdle: true
});

// 1. Obtener todos los equipos
const getTeams = async () => {
    const { rows } = await pool.query('SELECT id, name FROM equipos ORDER BY id ASC');
    return rows;
};

// 2. Obtener los jugadores de un equipo especifico
const getPlayers = async (teamID) => {
    const consulta = `
        SELECT j.name, p.name AS posicion 
        FROM jugadores j 
        INNER JOIN posiciones p ON j.position = p.id 
        WHERE j.id_equipo = $1;
    `;
    const values = [teamID];
    const { rows } = await pool.query(consulta, values);
    return rows;
};

// 3. Agregar un nuevo equipo
const addTeam = async (equipo) => {
    const consulta = "INSERT INTO equipos (name) VALUES ($1) RETURNING *";
    const values = [equipo.name];
    const { rows } = await pool.query(consulta, values);
    return rows[0]; // Devolvemos el equipo creado para usarlo en los tests
};

// 4. Agregar un nuevo jugador
const addPlayer = async ({ jugador, teamID }) => {
    const consulta = "INSERT INTO jugadores (id_equipo, name, position) VALUES ($1, $2, $3) RETURNING *";
    const values = [teamID, jugador.name, jugador.position];
    await pool.query(consulta, values);
};

module.exports = { getTeams, addTeam, getPlayers, addPlayer };