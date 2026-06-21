const express = require('express');
const router = express.Router();

const servicoscontroller = require('./servicoscontroller');
router.get('/', servicoscontroller.getAll);
router.get('/:id', servicoscontroller.getById);
router.post('/', servicoscontroller.create);
router.put('/:id', servicoscontroller.update);
router.delete('/:id', servicoscontroller.delete);

module.exports = router;