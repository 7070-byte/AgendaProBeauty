const AgendaService = require('./agendaservice');

class AgendaController {
    static async salvarHorarioTrabalho(req, res) {
        try {
            const id = await AgendaService.salvarHorarioTrabalho(req.body);
            res.status(201).json({ message: 'Horário de trabalho salvo com sucesso.', id });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async listarHorariosTrabalho(req, res) {
        try {
            const horarios = await AgendaService.listarHorariosTrabalho(req.params.profissionalNome);
            res.json(horarios);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async criarBloqueio(req, res) {
        try {
            const id = await AgendaService.criarBloqueio(req.body);
            res.status(201).json({ message: 'Bloqueio criado com sucesso.', id });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async listarBloqueios(req, res) {
        try {
            const bloqueios = await AgendaService.listarBloqueios(req.query.profissional_nome, req.query.data);
            res.json(bloqueios);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async consultarDisponibilidade(req, res) {
        try {
            const { profissional_nome, data, servico_nome } = req.query;
            const disponibilidade = await AgendaService.consultarDisponibilidade(profissional_nome, data, servico_nome);
            res.json(disponibilidade);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = AgendaController;