const db = require('../config/database');

class AgendamentosModel {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM agendamentos');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM agendamentos WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(agendamento) {
        const { profissional_nome, usuario_nome, servico_nome, data_hora } = agendamento;
        const [result] = await db.query('INSERT INTO agendamentos (profissional_nome, usuario_nome, servico_nome, data_hora) VALUES (?, ?, ?, ?)', [profissional_nome, usuario_nome, servico_nome, data_hora]);
        return result.insertId;
    }

    static async update(id, agendamento) {
        const { profissional_nome, usuario_nome, servico_nome, data_hora } = agendamento;
        const [result] = await db.query('UPDATE agendamentos SET profissional_nome = ?, usuario_nome = ?, servico_nome = ?, data_hora = ? WHERE id = ?', [profissional_nome, usuario_nome, servico_nome, data_hora, id]);
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM agendamentos WHERE id = ?', [id]);
        return result.affectedRows;
    }
}
module.exports = AgendamentosModel;