const express = require('express');

const AgendaController = require('./agendacontroller');

const router = express.Router();

router.post('/horarios-trabalho', AgendaController.salvarHorarioTrabalho);
router.get('/horarios-trabalho/:profissionalNome', AgendaController.listarHorariosTrabalho);
router.post('/bloqueios', AgendaController.criarBloqueio);
router.get('/bloqueios', AgendaController.listarBloqueios);
router.get('/disponibilidade', AgendaController.consultarDisponibilidade);

module.exports = router;