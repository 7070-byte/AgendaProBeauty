const AgendamentosModel = require('../../models/agendamentosModel');
const AgendaService = require('../agenda/agendaservice');

class AgendamentosService {

   static async getAllAgendamentos() {
      return await AgendamentosModel.findAll();
   }

   static async getAgendamentoById(id) {
      const agendamento = await AgendamentosModel.findById(id);
      if (!agendamento) {
         throw new Error("Agendamento não encontrado.");
      }
      return agendamento;
   }

   static async createAgendamento(agendamento) {
      if (!agendamento.profissional_nome || !agendamento.usuario_nome || !agendamento.servico_nome || !agendamento.data_hora) {
         throw new Error("profissional_nome, usuario_nome, servico_nome e data_hora são obrigatórios.");
      }

      const horarioDisponivel = await AgendaService.isHorarioDisponivel(
         agendamento.profissional_nome,
         agendamento.servico_nome,
         agendamento.data_hora
      );

      if (!horarioDisponivel) {
         throw new Error("O horário informado não está disponível para este profissional.");
      }

      return await AgendamentosModel.create(agendamento);
   }

   static async updateAgendamento(id, agendamento) {
      if (!agendamento.profissional_nome || !agendamento.usuario_nome || !agendamento.servico_nome || !agendamento.data_hora) {
         throw new Error("profissional_nome, usuario_nome, servico_nome e data_hora são obrigatórios.");
      }

      const horarioDisponivel = await AgendaService.isHorarioDisponivel(
         agendamento.profissional_nome,
         agendamento.servico_nome,
         agendamento.data_hora,
         id
      );

      if (!horarioDisponivel) {
         throw new Error("O horário informado não está disponível para este profissional.");
      }

      const updatedRows = await AgendamentosModel.update(id, agendamento);
      if (updatedRows === 0) {
         throw new Error("Agendamento não encontrado.");
      }
      return updatedRows;
   }

   static async updateStatusAgendamento(id, status) {
      const statusPermitidos = ['agendado', 'confirmado', 'concluido', 'cancelado'];

      if (!statusPermitidos.includes(status)) {
         throw new Error('status inválido. Valores permitidos: agendado, confirmado, concluido, cancelado.');
      }

      if (status === 'cancelado') {
         const agendamento = await AgendamentosModel.findById(id);
         if (!agendamento) {
            throw new Error("Agendamento não encontrado.");
         }

         const dataAgendamento = new Date(agendamento.data_hora);
         const agora = new Date();
         const diferencaHoras = (dataAgendamento - agora) / (1000 * 60 * 60);

         if (diferencaHoras < 2) {
            throw new Error('Cancelamento não permitido com menos de 2 horas de antecedência.');
         }
      }

      const updatedRows = await AgendamentosModel.updateStatus(id, status);
      if (updatedRows === 0) {
         throw new Error("Agendamento não encontrado.");
      }
      return updatedRows;
   }

   static async deleteAgendamento(id) {
      const deletedRows = await AgendamentosModel.delete(id);
      if (deletedRows === 0) {
         throw new Error("Agendamento não encontrado.");
      }
      return deletedRows;
   }
}
module.exports = AgendamentosService;
