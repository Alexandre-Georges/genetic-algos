const utils = require('./utils.js');

const DEFAULT_CONFIG = {
  colours: ['red', 'blue', 'yellow', 'green', 'white', 'black'],
  answer: ['blue', 'yellow', 'black', 'red'],
  populationSize: 10,
  mutationRate: 0.3,
  geneMutationRate: 0.2,
};

const initState = (config) => {
  let state = [];
  for (let i = 0; i < config.answer.length; i++) {
    state.push(config.colours[utils.getRandomNumberBetween(0, config.colours.length)]);
  }
  return state;
};

const evaluate = (config, individual) => {
  let score = 0;
  for (let i = 0; i < individual.state.length; i++) {
    if (config.answer[i] === individual.state[i]) {
      score += 10;
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
  const child = { state: [] };
  for (const i in geneIndexes) {
    const geneIndex = geneIndexes[i];
    child.state.push(parents[geneIndex].state[i]);
  }
  return [child];
};

const mutate = (config, individual) => {
  const mutatedIndividual = { state: individual.state };

  let i = 0;
  while (i < individual.state.length) {
    if (Math.random() < config.geneMutationRate) {
      mutatedIndividual.state[i] = config.colours[utils.getRandomNumberBetween(0, config.colours.length)];
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
  stateCallback: (state) => {
    console.log(`Generation ${state.generation}'s best individual : ${state.best.state}`);
  },
  endCallback: (state) => {
    console.log(`Solution found after ${state.generation} generation(s) : ${state.best.state}`);
  },
};
