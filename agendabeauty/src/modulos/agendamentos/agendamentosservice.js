const AgendamentosModel = require('../../models/agendamentosModel');

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
      return await AgendamentosModel.create(agendamento);
   }

   static async updateAgendamento(id, agendamento) {
      const updatedRows = await AgendamentosModel.update(id, agendamento);
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
