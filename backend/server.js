import express from 'express';
import cors from 'cors';
import pool from './db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// --- MIDDLEWARE DE AUTENTICACIÓN ---
// Este "portero" verifica que el token sea válido antes de dejar pasar a las rutas protegidas
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "No hay token, acceso denegado" });

    jwt.verify(token, process.env.JWT_SECRET || 'firma_secreta', (err, user) => {
        if (err) return res.status(403).json({ message: "Token inválido o expirado" });
        req.user = user; // Guarda el id y el rol del usuario en la petición
        next();
    });
};

// --- RUTA DE LOGIN (Funcionalidad original) ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(401).json({ message: "Usuario no encontrado" });

        const usuario = result.rows[0];
        if (usuario.password !== password) return res.status(401).json({ message: "Contraseña incorrecta" });

        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol }, 
            process.env.JWT_SECRET || 'firma_secreta', 
            { expiresIn: '2h' }
        );

        res.json({ token, user: { nombre: usuario.nombre, rol: usuario.rol } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
});

// --- NUEVA RUTA: OBTENER TICKETS (Filtrado por Rol) ---
app.get('/api/tickets', authenticateToken, async (req, res) => {
    const { id, rol } = req.user; // Obtenemos los datos desde el token verificado

    try {
        let result;
        if (rol === 'usuario') {
            // Un usuario básico solo ve SUS tickets (SLA y seguimiento personal)
            result = await pool.query(
                'SELECT * FROM tickets WHERE usuario_id = $1 ORDER BY fecha_creacion DESC', 
                [id]
            );
        } else {
            // Admin y Técnicos ven TODO el panorama
            result = await pool.query('SELECT * FROM tickets ORDER BY prioridad DESC, fecha_creacion DESC');
        }
        
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error al obtener los tickets" });
    }
});
/*
// NUEVA RUTA: CREAR TICKET
app.post('/api/tickets', authenticateToken, async (req, res) => {
    const { titulo, descripcion, prioridad } = req.body;
    const usuario_id = req.user.id; // Sacamos el ID del token

    // Definimos el SLA según la prioridad
    let horasSLA = 24;
    if (prioridad === 'Crítica') horasSLA = 2;
    if (prioridad === 'Alta') horasSLA = 4;

    try {
        const query = `
            INSERT INTO tickets (titulo, descripcion, prioridad, usuario_id, fecha_limite) 
            VALUES ($1, $2, $3, $4, NOW() + INTERVAL '${horasSLA} hours') 
            RETURNING *`;
        
        const result = await pool.query(query, [titulo, descripcion, prioridad, usuario_id]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error al crear el ticket" });
    }
}); */
//api
app.post('/api/tickets', authenticateToken, async (req, res) => {
    const { titulo, descripcion, prioridad } = req.body;
    const usuario_id = req.user.id; 

    try {
        // Aseguramos que todos los campos tengan valores por defecto
        const query = `
            INSERT INTO tickets (titulo, descripcion, prioridad, estado, usuario_id, nivel_escalado, fecha_limite) 
            VALUES ($1, $2, $3, 'Abierto', $4, 1, NOW() + INTERVAL '24 hours') 
            RETURNING *`;
        
        const result = await pool.query(query, [titulo, descripcion, prioridad, usuario_id]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("❌ ERROR EN LA DB:", err.message); // MIRA TU TERMINAL CUANDO FALLE
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor (ESM) listo en http://localhost:${PORT}`));