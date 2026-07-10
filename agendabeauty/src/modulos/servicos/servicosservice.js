const ServicosModel = require("../../models/servicosModel");

class ServicosService {

   static async getAllServicos(area) {
      return await ServicosModel.findAll(area);
   }

   static async getServicoById(id) {
      const servico = await ServicosModel.findById(id);
      if (!servico) {
         throw new Error("Serviço não encontrado.");
      }
      return servico;
   }

   static async getServicoByName(nome) {
      const servico = await ServicosModel.findByName(nome);
      if (!servico) {
         throw new Error("Serviço não encontrado.");
      }
      return servico;
   }

   static async createServico(servico) {
      if (!servico.profissional_nome || !servico.nome || !servico.area || !servico.duracao || !servico.preco) {
         throw new Error("profissional_nome, nome, area, duracao e preco são obrigatórios.");
      }
      return await ServicosModel.create(servico);
   }

   static async updateServico(id, servico) {
      const updatedRows = await ServicosModel.update(id, servico);
      if (updatedRows === 0) {
         throw new Error("Serviço não encontrado.");
      }
      return updatedRows;
   }

   static async deleteServico(id) {
      const deletedRows = await ServicosModel.delete(id);
      if (deletedRows === 0) {
         throw new Error("Serviço não encontrado.");
      }
      return deletedRows;
   }
}
module.exports = ServicosService;
