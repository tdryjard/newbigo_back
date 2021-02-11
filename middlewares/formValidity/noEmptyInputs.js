module.exports = function checkIfNoEmptyInputs(inputs) {
  const emptyInputs = [];

  Object.entries(inputs).forEach(element => {
    const [key, value] = element;
    if (value === null) emptyInputs.push(key);
  });

  // Si des erreurs d'entrées ont été detectées => Envoi erreur 500 (type: INPUT)
  if (emptyInputs.length) {
    return {
      type: 'INPUT',
      inputs: emptyInputs,
      alert: {
        type: 'error',
        text: 'Des champs sont vides'
      }
    };
  }

  return null;
};
