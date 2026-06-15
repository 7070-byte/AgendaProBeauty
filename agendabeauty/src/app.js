const express = require('express');

const cors = require('cors');

const helmet = require('helmet');

const usuariosroutes = require('./modulos/usuarios/usuariosroutes');
const agendamentosroutes = require('./modulos/agendamentos/agendamentosroutes');
const profissionaisroutes = require('./modulos/profissionais/profissionaisroutes');
const servicosroutes = require('./modulos/servicos/servicosroutes');

const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());

app.use(helmet());

app.use(express.json());

app.use('/usuarios', usuariosroutes);
app.use('/agendamentos', agendamentosroutes);
app.use('/profissionais', profissionaisroutes);
app.use('/servicos', servicosroutes);

app.use(errorMiddleware);

module.exports = app;