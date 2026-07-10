const express = require('express');

const cors = require('cors');

const helmet = require('helmet');

const usuariosroutes = require('./modulos/usuarios/usuariosroutes');
const agendamentosroutes = require('./modulos/agendamentos/agendamentosroutes');
const profissionaisroutes = require('./modulos/profissionais/profissionaisroutes');
const servicosroutes = require('./modulos/servicos/servicosroutes');
const agendaroutes = require('./modulos/agenda/agendaroutes');

const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());

app.use(helmet());

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'API AgendaBeauty online',
        endpoints: ['/usuarios', '/agendamentos', '/profissionais', '/servicos', '/agenda']
    });
});

app.use('/usuarios', usuariosroutes);
app.use('/agendamentos', agendamentosroutes);
app.use('/profissionais', profissionaisroutes);
app.use('/servicos', servicosroutes);
app.use('/agenda', agendaroutes);

app.use(errorMiddleware);

module.exports = app;