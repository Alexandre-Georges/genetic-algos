const utils = require('./utils.js');

const DEFAULT_CONFIG = {
  allowedLetters: 'qwertyuiopasdfghjklzxcvbnm ',
  answer: 'sentence to find',
  populationSize: 10000,
  mutationRate: 0.5,
  geneMutationRate: 0.16,
};

const initState = config => {
  let state = '';
  for (let i = 0; i < config.answer.length; i++) {
    state += config.allowedLetters[utils.getRandomNumberBetween(0, config.allowedLetters.length)];
  }
  return state;
};

const evaluate = (config, individual) => {
  let score = 0;
  for (let i = 0; i < individual.state.length; i++) {
    const c = individual.state[i];
    if (config.answer.match(c)) {
      if (config.answer.charAt(i) === c) {
        score += 10;
      } else {
        score += 1;
      }
    }
  }
  return { score, found: score === config.answer.length * 10 };
};

const breed = (config, parent1, parent2) => {
  const parents = [parent1, parent2];
  const geneIndexes = [];
  while (geneIndexes.length < parent1.state.length) {
    geneIndexes.push(utils.getRandomNumberBetween(0, 2));
  }
  const child = { state: '' };
  for (const i in geneIndexes) {
    const geneIndex = geneIndexes[i];
    child.state += parents[geneIndex].state.charAt(i);
  }
  return [child];
};

const mutate = (config, individual) => {
  const mutatedIndividual = { state: individual.state };

  let i = 0;
  while (i < individual.state.length) {
    if (Math.random() < config.geneMutationRate) {
      mutatedIndividual.state =
        mutatedIndividual.state.substr(0, i) +
        config.allowedLetters[utils.getRandomNumberBetween(0, config.allowedLetters.length)] +
        mutatedIndividual.state.substr(i + 1, mutatedIndividual.state.length - i);
    }
    i++;
  }
  return mutatedIndividual;
};

const chuck = (config, population) => {
  const bestScore = population[0].score;
  const minPopulation = 6;
  let acceptedPopulationIndex = 0;
  while (acceptedPopulationIndex < minPopulation - 1 && population[acceptedPopulationIndex].score > bestScore / 2) {
    acceptedPopulationIndex++;
  }
  return population.slice(0, acceptedPopulationIndex + 1);
};

module.exports = {
  getConfig: () => DEFAULT_CONFIG,
  initState,
  evaluate,
  breed,
  mutate,
  chuck,
};
