const db = require('../database')

const Command = function createCommand(user) {
  this.phone_vonage = command.phone_vonage;
  this.phone_client = command.phone_client;
  this.service = command.service;
  this.customer_id = command.customer_id;
}

Command.create = (newCommand, result) => {
  db.query('INSERT INTO command SET ?', [newCommand], (error, dbResult) => {
    if (error) {
      return result(error, null);
    }

    return result(null, { id: dbResult.insertId, ...newCommand });
  });
};


module.exports = Command