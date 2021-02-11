module.exports = function regexValidity(inputs, regex) {
  const badInputs = [];

  Object.entries(inputs).forEach(element => {
    const [key, value] = element;
    // Verifie si l'entrée correspond au Regex
    if (!regex.test(value)) badInputs.push(key);
  });

  // Si des erreurs d'entrées ont été detectées => Envoi erreur 500 (type: INPUT)
  if (badInputs.length) {
    return {
      type: 'INPUT',
      inputs: badInputs,
      alert: {
        type: 'error',
        text: 'Champ(s) invalide(s) (caractères)'
      }
    };
  }

  return false;
};
