const AgendamentosService = require('./agendamentosservice');

class AgendamentosController {

   static async getAll(req, res) {
      try {
         const agendamentos = await AgendamentosService.getAllAgendamentos();
         res.json(agendamentos); 
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   }

   static async getById(req, res) {
      try {
         const agendamento = await AgendamentosService.getAgendamentoById(req.params.id);
         res.json(agendamento);
      } catch (error) {
         res.status(404).json({ error: error.message });
      }
   }

   static async create(req, res) {
      try {
         const id = await AgendamentosService.createAgendamento(req.body);
         res.status(201).json({ message: 'Agendamento criado com sucesso.', id });
      } catch (error) {
         res.status(400).json({ error: error.message });
      }
   }

   static async update(req, res) {
      try {
         const id = req.params.id;
         await AgendamentosService.updateAgendamento(id, req.body);
         res.json({ message: 'Agendamento atualizado com sucesso.' });
      } catch (error) {
         res.status(400).json({ error: error.message });
      }
   }

   static async delete(req, res) {
      try {
         const id = req.params.id;
         await AgendamentosService.deleteAgendamento(id);
         res.json({ message: 'Agendamento deletado com sucesso.' });
      } catch (error) {
         res.status(400).json({ error: error.message });
      }
   }
}
module.exports = AgendamentosController;