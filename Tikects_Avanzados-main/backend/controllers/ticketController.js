import pool from '../db.js';

const MAX_NIVEL = 3;

// 🔵 OBTENER TICKETS
export const getTickets = async (req, res) => {
    const { id, rol } = req.user;

    try {
        let result;

        // 🔹 QUERY BASE MEJORADO
        const baseQuery = `
            SELECT 
                t.*, 
                u.nombre AS usuario_nombre,
                tec.nombre AS tecnico_nombre
            FROM tickets t
            JOIN usuarios u ON t.usuario_id = u.id
            LEFT JOIN usuarios tec ON t.tecnico_id = tec.id
        `;

        if (rol === 'usuario') {
            result = await pool.query(
                baseQuery + ' WHERE t.usuario_id = $1 ORDER BY t.fecha_creacion DESC',
                [id]
            );

        } else if (rol === 'tecnico') {
            const tecnico = await pool.query(
                'SELECT nivel FROM tecnicos WHERE usuario_id = $1',
                [id]
            );

            const nivel = tecnico.rows[0]?.nivel || 1;

            result = await pool.query(
                baseQuery + ' WHERE t.nivel_escalado = $1 ORDER BY t.fecha_creacion DESC',
                [nivel]
            );

        } else {
            result = await pool.query(
                baseQuery + ' ORDER BY t.prioridad DESC, t.fecha_creacion DESC'
            );
        }

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al obtener los tickets" });
    }
};

// 🔵 DETALLE
export const getTicketById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                t.*, 
                u.nombre AS usuario_nombre,
                tec.nombre AS tecnico_nombre
            FROM tickets t
            JOIN usuarios u ON t.usuario_id = u.id
            LEFT JOIN usuarios tec ON t.tecnico_id = tec.id
            WHERE t.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Ticket no encontrado" });
        }

        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ message: "Error al obtener el detalle" });
    }
};

// 🔵 CREAR TICKET (SIN CAMBIOS)
export const createTicket = async (req, res) => {
    const { titulo, descripcion, prioridad } = req.body;
    const usuario_id = req.user.id;

    try {
        const query = `
            INSERT INTO tickets 
            (titulo, descripcion, prioridad, estado, usuario_id, nivel_escalado, fecha_limite) 
            VALUES ($1, $2, $3, 'Abierto', $4, 1, NOW() + INTERVAL '24 hours') 
            RETURNING *`;

        const result = await pool.query(query, [
            titulo,
            descripcion,
            prioridad,
            usuario_id
        ]);

        res.status(201).json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//  ESCALAR TICKET (MEJORADO)
export const escalarTicket = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Validar ticket
        const ticketRes = await pool.query(
            'SELECT nivel_escalado, estado, tecnico_id FROM tickets WHERE id = $1',
            [id]
        );

        if (ticketRes.rows.length === 0) {
            return res.status(404).json({ message: "Ticket no encontrado" });
        }

        const ticket = ticketRes.rows[0];

        // 2. No escalar cerrados
        if (ticket.estado === 'Cerrado') {
            return res.status(400).json({ message: "No se puede escalar un ticket cerrado" });
        }

        // 3. Limite de nivel
        if (ticket.nivel_escalado >= MAX_NIVEL) {
            return res.status(400).json({ message: "Nivel máximo alcanzado" });
        }

        const nuevoNivel = ticket.nivel_escalado + 1;

        // 4. Subir nivel
        await pool.query(
            'UPDATE tickets SET nivel_escalado = $1 WHERE id = $2',
            [nuevoNivel, id]
        );

        // 5. Asignar técnico SOLO si no tiene
        if (!ticket.tecnico_id) {
            const tecnico = await pool.query(
                'SELECT usuario_id FROM tecnicos WHERE nivel = $1 AND activo = true LIMIT 1',
                [nuevoNivel]
            );

            if (tecnico.rows.length > 0) {
                await pool.query(
                    'UPDATE tickets SET tecnico_id = $1 WHERE id = $2',
                    [tecnico.rows[0].usuario_id, id]
                );
            }
        }

        res.json({
            message: "Ticket escalado correctamente",
            nivel_actual: nuevoNivel
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al escalar ticket" });
    }
};

// 🟢 CAMBIAR ESTADO (NUEVO)
export const cambiarEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const { rol } = req.user;

    try {
        // 🔒 Solo técnico o admin pueden cambiar estado
        if (rol === 'usuario') {
            return res.status(403).json({ message: "No autorizado" });
        }

        await pool.query(
            'UPDATE tickets SET estado = $1 WHERE id = $2',
            [estado, id]
        );

        res.json({ message: "Estado actualizado" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al cambiar estado" });
    }
};