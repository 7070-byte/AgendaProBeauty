const db = require('../config/database');

class UserModel {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM users');
        return rows;
    }

    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?',
            [email]);
        return rows[0];
    }

    static async create(usuario) {
        const { name, email } = usuario;
        const [result] = await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
        return result.insertId;
    }

    static async update(id, usuario) {
        const { name, email } = usuario;
        const [result] = await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows;
    }
}
module.exports = UserModel;

