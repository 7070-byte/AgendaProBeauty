const express = require('express');
const router = express.Router();

const profissionaiscontroller = require('../profissionais/profissionaiscontroller');
router.get('/', profissionaiscontroller.getAll);
router.get('/:id', profissionaiscontroller.getById);
router.post('/', profissionaiscontroller.create);
router.put('/:id', profissionaiscontroller.update);
router.delete('/:id', profissionaiscontroller.delete);

module.exports = router;
