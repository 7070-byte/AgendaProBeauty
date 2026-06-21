const db = require('../config/database');

class ProfissionalModel {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM profissionais');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM profissionais WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(profissional) {
        const { profissional_nome, especialidade } = profissional;
        const [result] = await db.query('INSERT INTO profissionais (profissional_nome, especialidade) VALUES (?, ?)', [profissional_nome, especialidade]);
        return result.insertId;
    }

    static async update(id, profissional) {
        const { profissional_nome, especialidade } = profissional;
        const [result] = await db.query('UPDATE profissionais SET profissional_nome = ?, especialidade = ? WHERE id = ?', [profissional_nome, especialidade, id]);
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM profissionais WHERE id = ?', [id]);
        return result.affectedRows;
    }
}
module.exports = ProfissionalModel;