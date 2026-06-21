const db = require('../config/database');

class ServicosModel {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM servicos');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM servicos WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(servico) {
        const { profissional_nome, nome, duracao, preco} = servico;
        const [result] = await db.query('INSERT INTO servicos (profissional_nome, nome, duracao, preco) VALUES (?, ?, ?, ?)', [profissional_nome, nome, duracao, preco]);
        return result.insertId;
    }

    static async update(id, servico) {
        const { profissional_nome, nome, duracao, preco } = servico;
        const [result] = await db.query('UPDATE servicos SET profissional_nome = ?, nome = ?, duracao = ?, preco = ? WHERE id = ?', [profissional_nome, nome, duracao, preco, id]);
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM servicos WHERE id = ?', [id]);
        return result.affectedRows;
    }
}
module.exports = ServicosModel;