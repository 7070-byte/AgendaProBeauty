const express = require('express');
const router = express.Router();

const agendamentoscontroller = require('./agendamentoscontroller');
router.get('/', agendamentoscontroller.getAll);
router.get('/:id', agendamentoscontroller.getById);
router.post('/', agendamentoscontroller.create);
router.put('/:id', agendamentoscontroller.update);
router.delete('/:id', agendamentoscontroller.delete);

module.exports = router;