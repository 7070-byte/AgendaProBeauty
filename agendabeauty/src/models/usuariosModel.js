const db = require('../config/database');

class UserModel {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM usuarios');
        return rows;
    }

    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?',
            [email]);
        return rows[0];
    }

    static async create(usuario) {
        const { nome, email } = usuario;
        const [result] = await db.query('INSERT INTO usuarios (nome, email) VALUES (?, ?)', [nome, email]);
        return result.insertId;
    }

    static async update(id, usuario) {
        const { nome, email } = usuario;
        const [result] = await db.query('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?', [nome, email, id]);
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
        return result.affectedRows;
    }
}
module.exports = UserModel;

