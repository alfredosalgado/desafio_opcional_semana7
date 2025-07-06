const request = require('supertest');
const server = require('../index');

describe('Pruebas para la API FutScript', () => {

    it('Debe devolver un status 200 y un arreglo en la ruta GET /equipos', async () => {
        const response = await request(server).get('/equipos').send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('Debe devolver un token (objeto) con credenciales correctas en POST /login', async () => {
        const credentials = { username: 'admin', password: '1234' };
        const response = await request(server).post('/login').send(credentials);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.token).toBeDefined();
    });

    it('Debe devolver un status 400 con credenciales incorrectas en POST /login', async () => {
        const credentials = { username: 'bad', password: 'user' };
        const response = await request(server).post('/login').send(credentials);
        expect(response.statusCode).toBe(400);
    });
    
    it('Debe devolver un status 201 al agregar un jugador a un equipo recién creado', async () => {
        // 1. Obtener un token valido
        const credentials = { username: 'admin', password: '1234' };
        const loginResponse = await request(server).post('/login').send(credentials);
        const token = loginResponse.body.token;

        // 2. Crear un equipo primero para obtener un ID valido
        const nuevoEquipo = { name: 'Equipo de Prueba para Test' };
        // La ruta POST /equipos esta protegida, por eso enviamos el token
        const equipoCreadoResponse = await request(server)
            .post('/equipos')
            .set('Authorization', `Bearer ${token}`)
            .send(nuevoEquipo);
        
        const equipoId = equipoCreadoResponse.body.id;

        // 3. el ID del equipo recien creado para agregar el jugador
        const nuevoJugador = { name: 'Test Player', position: 1 };
        const response = await request(server)
            .post(`/equipos/${equipoId}/jugadores`) // Usamos el ID dinamico
            .set('Authorization', `Bearer ${token}`)
            .send(nuevoJugador);

        expect(response.statusCode).toBe(201);
    });
});