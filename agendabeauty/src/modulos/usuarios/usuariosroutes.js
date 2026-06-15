const express = require('express');

const usuarioscontroller = require('../usuarios/usuarioscontroller');

const router = express.Router();
router.get('/', usuarioscontroller.getAll);
router.post('/', usuarioscontroller.create);
router.put('/:id', usuarioscontroller.update);
router.delete('/:id', usuarioscontroller.delete);

module.exports = router;