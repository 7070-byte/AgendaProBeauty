const AgendaModel = require('../../models/agendaModel');
const ServicosService = require('../servicos/servicosservice');

const LIMITE_AGENDAMENTOS_POR_HORARIO = 5;//São 5 salas disponíveis por horário

class AgendaService {
    static async salvarHorarioTrabalho(horario) {
        const { profissional_nome, dia_semana, hora_inicio, hora_fim } = horario;

        if (!profissional_nome || dia_semana === undefined || !hora_inicio || !hora_fim) {
            throw new Error('profissional_nome, dia_semana, hora_inicio e hora_fim são obrigatórios.');
        }

        const diaSemanaNumero = Number(dia_semana);
        if (!Number.isInteger(diaSemanaNumero) || diaSemanaNumero < 1 || diaSemanaNumero > 6) {
            throw new Error('dia_semana deve ser um número entre 1 e 6.');
        }

        if (AgendaService.timeToMinutes(hora_inicio) >= AgendaService.timeToMinutes(hora_fim)) {
            throw new Error('hora_inicio deve ser menor que hora_fim.');
        }

        return AgendaModel.upsertHorarioTrabalho({
            profissional_nome,
            dia_semana: diaSemanaNumero,
            hora_inicio,
            hora_fim
        });
    }

    static async listarHorariosTrabalho(profissionalNome) {
        if (!profissionalNome) {
            throw new Error('profissional_nome é obrigatório.');
        }

        return AgendaModel.findHorariosTrabalhoByProfissional(profissionalNome);
    }

    static async criarBloqueio(bloqueio) {
        const { profissional_nome, data_inicio, data_fim } = bloqueio;

        if (!profissional_nome || !data_inicio || !data_fim) {
            throw new Error('profissional_nome, data_inicio e data_fim são obrigatórios.');
        }

        const inicio = AgendaService.parseDateTime(data_inicio);
        const fim = AgendaService.parseDateTime(data_fim);

        if (inicio >= fim) {
            throw new Error('data_inicio deve ser menor que data_fim.');
        }

        return AgendaModel.createBloqueio({
            ...bloqueio,
            data_inicio: AgendaService.toSqlDateTime(inicio),
            data_fim: AgendaService.toSqlDateTime(fim)
        });
    }

    static async listarBloqueios(profissionalNome, data) {
        if (!profissionalNome || !data) {
            throw new Error('profissional_nome e data são obrigatórios.');
        }

        const { inicioDoDia, fimDoDia } = AgendaService.getDayBounds(data);
        return AgendaModel.findBloqueiosByProfissionalAndPeriodo(
            profissionalNome,
            AgendaService.toSqlDateTime(inicioDoDia),
            AgendaService.toSqlDateTime(fimDoDia)
        );
    }

    static async consultarDisponibilidade(profissionalNome, data, servicoNome) {
        if (!profissionalNome || !data || !servicoNome) {
            throw new Error('profissional_nome, data e servico_nome são obrigatórios.');
        }

        const servico = await ServicosService.getServicoByName(servicoNome);
        const diaSemana = AgendaService.getDayOfWeek(data);
        const horarioTrabalho = await AgendaModel.findHorarioTrabalhoByDia(profissionalNome, diaSemana);

        if (!horarioTrabalho) {
            return [];
        }

        const { inicioDoDia, fimDoDia } = AgendaService.getDayBounds(data);
        const [bloqueios, agendamentosProfissional, agendamentosDoDia] = await Promise.all([
            AgendaModel.findBloqueiosByProfissionalAndPeriodo(
                profissionalNome,
                AgendaService.toSqlDateTime(inicioDoDia),
                AgendaService.toSqlDateTime(fimDoDia)
            ),
            AgendaModel.findAgendamentosByProfissionalAndPeriodo(
                profissionalNome,
                AgendaService.toSqlDateTime(inicioDoDia),
                AgendaService.toSqlDateTime(fimDoDia)
            ),
            AgendaModel.findAgendamentosByPeriodo(
                AgendaService.toSqlDateTime(inicioDoDia),
                AgendaService.toSqlDateTime(fimDoDia)
            )
        ]);

        const duracao = Number(servico.duracao);
        const inicioExpediente = AgendaService.timeToMinutes(horarioTrabalho.hora_inicio);
        const fimExpediente = AgendaService.timeToMinutes(horarioTrabalho.hora_fim);
        const intervalosBloqueados = [
            ...bloqueios.map((bloqueio) => AgendaService.intervaloParaMinutosNoDia(bloqueio.data_inicio, bloqueio.data_fim, data)),
            ...agendamentosProfissional.map((agendamento) => {
                const inicio = AgendaService.parseDateTime(agendamento.data_hora);
                const fim = new Date(inicio.getTime() + Number(agendamento.duracao) * 60000);
                return AgendaService.intervaloParaMinutosNoDia(inicio, fim, data, agendamento.id);
            })
        ].filter(Boolean);

        const intervalosOcupados = agendamentosDoDia.map((agendamento) => {
            const inicio = AgendaService.parseDateTime(agendamento.data_hora);
            const fim = new Date(inicio.getTime() + Number(agendamento.duracao) * 60000);
            return AgendaService.intervaloParaMinutosNoDia(inicio, fim, data, agendamento.id);
        }).filter(Boolean);

        const slots = [];
        for (let minutoAtual = inicioExpediente; minutoAtual + duracao <= fimExpediente; minutoAtual += duracao) {
            const slotFim = minutoAtual + duracao;
            const temConflito = intervalosBloqueados.some((intervalo) => minutoAtual < intervalo.fim && slotFim > intervalo.inicio);
            const agendamentosSimultaneos = intervalosOcupados.filter((intervalo) => minutoAtual < intervalo.fim && slotFim > intervalo.inicio).length;
            const atingiuLimiteDeHorario = agendamentosSimultaneos >= LIMITE_AGENDAMENTOS_POR_HORARIO;

            if (!temConflito && !atingiuLimiteDeHorario) {
                slots.push({
                    inicio: AgendaService.minutesToDateTime(data, minutoAtual),
                    fim: AgendaService.minutesToDateTime(data, slotFim)
                });
            }
        }

        return slots;
    }

    static async isHorarioDisponivel(profissionalNome, servicoNome, dataHora, agendamentoIgnoradoId = null) {
        if (!profissionalNome || !servicoNome || !dataHora) {
            throw new Error('profissional_nome, servico_nome e data_hora são obrigatórios.');
        }

        const servico = await ServicosService.getServicoByName(servicoNome);
        const inicio = AgendaService.parseDateTime(dataHora);
        const fim = new Date(inicio.getTime() + Number(servico.duracao) * 60000);
        const data = AgendaService.extractDateString(inicio);
        const diaSemana = AgendaService.getDayOfWeek(data);
        const horarioTrabalho = await AgendaModel.findHorarioTrabalhoByDia(profissionalNome, diaSemana);

        if (!horarioTrabalho) {
            return false;
        }

        const inicioMinutos = inicio.getHours() * 60 + inicio.getMinutes();
        const fimMinutos = fim.getHours() * 60 + fim.getMinutes();
        const inicioExpediente = AgendaService.timeToMinutes(horarioTrabalho.hora_inicio);
        const fimExpediente = AgendaService.timeToMinutes(horarioTrabalho.hora_fim);

        if (inicioMinutos < inicioExpediente || fimMinutos > fimExpediente) {
            return false;
        }

        const [bloqueios, agendamentosProfissional, agendamentosNoHorario] = await Promise.all([
            AgendaModel.findBloqueiosByProfissionalAndPeriodo(
                profissionalNome,
                AgendaService.toSqlDateTime(inicio),
                AgendaService.toSqlDateTime(fim)
            ),
            AgendaModel.findAgendamentosByProfissionalAndPeriodo(
                profissionalNome,
                AgendaService.toSqlDateTime(inicio),
                AgendaService.toSqlDateTime(fim)
            ),
            AgendaModel.findAgendamentosByPeriodo(
                AgendaService.toSqlDateTime(inicio),
                AgendaService.toSqlDateTime(fim),
                agendamentoIgnoradoId
            )
        ]);

        const possuiBloqueio = bloqueios.length > 0;
        const possuiConflitoAgendamento = agendamentosProfissional.some((agendamento) => String(agendamento.id) !== String(agendamentoIgnoradoId));
        const atingiuLimiteDeHorario = agendamentosNoHorario.length >= LIMITE_AGENDAMENTOS_POR_HORARIO;

        return !possuiBloqueio && !possuiConflitoAgendamento && !atingiuLimiteDeHorario;
    }

    static getDayOfWeek(data) {
        const date = new Date(`${data}T00:00:00`);
        if (Number.isNaN(date.getTime())) {
            throw new Error('Data inválida. Use o formato YYYY-MM-DD.');
        }
        return date.getDay();
    }

    static getDayBounds(data) {
        const inicioDoDia = new Date(`${data}T00:00:00`);
        if (Number.isNaN(inicioDoDia.getTime())) {
            throw new Error('Data inválida. Use o formato YYYY-MM-DD.');
        }
        const fimDoDia = new Date(`${data}T23:59:59`);
        return { inicioDoDia, fimDoDia };
    }

    static parseDateTime(valor) {
        if (valor instanceof Date) {
            return valor;
        }

        const normalizado = String(valor).replace(' ', 'T');
        const data = new Date(normalizado);
        if (Number.isNaN(data.getTime())) {
            throw new Error('Data/hora inválida. Use YYYY-MM-DD HH:MM:SS.');
        }
        return data;
    }

    static extractDateString(data) {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    }

    static toSqlDateTime(data) {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        const segundos = String(data.getSeconds()).padStart(2, '0');
        return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
    }

    static timeToMinutes(timeValue) {
        const [horas, minutos] = String(timeValue).split(':').map(Number);
        return horas * 60 + minutos;
    }

    static minutesToDateTime(data, totalMinutos) {
        const horas = String(Math.floor(totalMinutos / 60)).padStart(2, '0');
        const minutos = String(totalMinutos % 60).padStart(2, '0');
        return `${data} ${horas}:${minutos}:00`;
    }

    static intervaloParaMinutosNoDia(inicioValor, fimValor, data, id = null) {
        const inicio = AgendaService.parseDateTime(inicioValor);
        const fim = AgendaService.parseDateTime(fimValor);
        const { inicioDoDia, fimDoDia } = AgendaService.getDayBounds(data);

        const inicioClamped = inicio < inicioDoDia ? inicioDoDia : inicio;
        const fimClamped = fim > fimDoDia ? fimDoDia : fim;

        if (inicioClamped >= fimClamped) {
            return null;
        }

        return {
            id,
            inicio: inicioClamped.getHours() * 60 + inicioClamped.getMinutes(),
            fim: fimClamped.getHours() * 60 + fimClamped.getMinutes()
        };
    }
}

module.exports = AgendaService;