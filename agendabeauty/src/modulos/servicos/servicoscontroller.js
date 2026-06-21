const ServicosService = require('./servicosservice');

class ServicosController {

   static async getAll(req, res) {
      try {
         const servicos = await ServicosService.getAllServicos();
         res.json(servicos); 
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   }

   static async getById(req, res) {
      try {
         const servico = await ServicosService.getServicoById(req.params.id);
         res.json(servico);
      } catch (error) {
         res.status(404).json({ error: error.message });
      }
   }

   static async create(req, res) {
      try {
         const id = await ServicosService.createServico(req.body);
         res.status(201).json({ message: 'Serviço criado com sucesso.', id });
      } catch (error) {
         res.status(400).json({ error: error.message });
      }
   }

   static async update(req, res) {
      try {
         const id = req.params.id;
         await ServicosService.updateServico(id, req.body);
         res.json({ message: 'Serviço atualizado com sucesso.' });
      } catch (error) {
         res.status(400).json({ error: error.message });
      }
   }

   static async delete(req, res) {
      try {
         const id = req.params.id;
         await ServicosService.deleteServico(id);
         res.json({ message: 'Serviço deletado com sucesso.' });
      } catch (error) {
         res.status(400).json({ error: error.message });
      }
   }
}
module.exports = ServicosController;