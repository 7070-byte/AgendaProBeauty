const ProfissionalService = require('./profissionaisservice');

class ProfissionalController {

   static async getAll(req, res) {
      try {
         const profissionais = await ProfissionalService.getAllProfissionais();
         res.json(profissionais); 
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   }

   static async getById(req, res) {
      try {
         const profissional = await ProfissionalService.getProfissionalById(req.params.id);
         res.json(profissional);
      } catch (error) {
         res.status(404).json({ error: error.message });
      }
   }

   static async create(req, res) {
      try {
         const id = await ProfissionalService.createProfissional(req.body);
         res.status(201).json({ message: 'Profissional criado com sucesso.', id });
      } catch (error) {
         res.status(400).json({ error: error.message });
      }
   }

   static async update(req, res) {
      try {
         const id = req.params.id;
         await ProfissionalService.updateProfissional(id, req.body);
         res.json({ message: 'Profissional atualizado com sucesso.' });
      } catch (error) {
         res.status(400).json({ error: error.message });
      }
   }

   static async delete(req, res) {
      try {
         const id = req.params.id;
         await ProfissionalService.deleteProfissional(id);
         res.json({ message: 'Profissional deletado com sucesso.' });
      } catch (error) {
         res.status(400).json({ error: error.message });
      }
   }
}
module.exports = ProfissionalController;