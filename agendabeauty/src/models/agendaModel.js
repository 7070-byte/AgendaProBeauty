const db = require('../config/database');

class AgendaModel {
    static async upsertHorarioTrabalho(horario) {
        const { profissional_nome, dia_semana, hora_inicio, hora_fim } = horario;
        const [result] = await db.query(
            `INSERT INTO agenda_horarios_trabalho (profissional_nome, dia_semana, hora_inicio, hora_fim)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE hora_inicio = VALUES(hora_inicio), hora_fim = VALUES(hora_fim)`,
            [profissional_nome, dia_semana, hora_inicio, hora_fim]
        );
        return result.insertId || result.affectedRows;
    }

    static async findHorariosTrabalhoByProfissional(profissionalNome) {
        const [rows] = await db.query(
            'SELECT * FROM agenda_horarios_trabalho WHERE profissional_nome = ? ORDER BY dia_semana',
            [profissionalNome]
        );
        return rows;
    }

    static async findHorarioTrabalhoByDia(profissionalNome, diaSemana) {
        const [rows] = await db.query(
            'SELECT * FROM agenda_horarios_trabalho WHERE profissional_nome = ? AND dia_semana = ?',
            [profissionalNome, diaSemana]
        );
        return rows[0];
    }

    static async createBloqueio(bloqueio) {
        const { profissional_nome, data_inicio, data_fim, motivo } = bloqueio;
        const [result] = await db.query(
            'INSERT INTO agenda_bloqueios (profissional_nome, data_inicio, data_fim, motivo) VALUES (?, ?, ?, ?)',
            [profissional_nome, data_inicio, data_fim, motivo || null]
        );
        return result.insertId;
    }

    static async findBloqueiosByProfissionalAndPeriodo(profissionalNome, periodoInicio, periodoFim) {
        const [rows] = await db.query(
            `SELECT * FROM agenda_bloqueios
             WHERE profissional_nome = ?
             AND data_inicio < ?
             AND data_fim > ?
             ORDER BY data_inicio`,
            [profissionalNome, periodoFim, periodoInicio]
        );
        return rows;
    }

    static async findAgendamentosByProfissionalAndPeriodo(profissionalNome, periodoInicio, periodoFim) {
        const [rows] = await db.query(
            `SELECT a.id, a.data_hora, s.duracao
             FROM agendamentos a
             INNER JOIN servicos s ON s.nome = a.servico_nome
             WHERE a.profissional_nome = ?
             AND a.data_hora < ?
             AND DATE_ADD(a.data_hora, INTERVAL s.duracao MINUTE) > ?
             ORDER BY a.data_hora`,
            [profissionalNome, periodoFim, periodoInicio]
        );
        return rows;
    }

    static async findAgendamentosByPeriodo(periodoInicio, periodoFim, agendamentoIgnoradoId = null) {
        const filtros = [periodoFim, periodoInicio];
        let sql = `SELECT a.id, a.profissional_nome, a.data_hora, s.duracao
                   FROM agendamentos a
                   INNER JOIN servicos s ON s.nome = a.servico_nome
                   WHERE a.data_hora < ?
                   AND DATE_ADD(a.data_hora, INTERVAL s.duracao MINUTE) > ?`;

        if (agendamentoIgnoradoId !== null && agendamentoIgnoradoId !== undefined) {
            sql += ' AND a.id <> ?';
            filtros.push(agendamentoIgnoradoId);
        }

        sql += ' ORDER BY a.data_hora';

        const [rows] = await db.query(sql, filtros);
        return rows;
    }
}

module.exports = AgendaModel;