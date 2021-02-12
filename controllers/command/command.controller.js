const bcrypt = require('bcrypt');
const Command = require('../../models/command/command.model');

// Creer un nouvel utilisateur
exports.create = function createCommand(request, response) {
  const {
    phone_vonage,
    phone_client,
      service,
      customer_id
  } = request.body;

  // Creer un utilisateur
  const command = new Command({
    phone_vonage: phone_vonage || null,
    phone_client: phone_client || null,
    service: service || null,
    customer_id: customer_id || null
  });

  // Enregistre un utilisateur
  return Command.create(command, (error, data) => {
    if (error) {
      return response.status(500).send({
        message: error.message || 'Some error occurred while command.'
      });
    } else{
    // Envoi de la réponse en status 201 soit (Created)
    return response.status(200).send({
      text: 'Comande ok !',
      customer_id
    });
  }
});
};