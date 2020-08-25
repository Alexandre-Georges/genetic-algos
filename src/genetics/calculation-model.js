const utils = require('./utils.js');

const DEFAULT_CONFIG = {
  numbers: [5, 6, 2, 9],
  answer: 24,
  operations: ['+', '-', '*', '/'],
  populationSize: 100,
  mutationRate: 0.5,
  geneMutationRate: 0.1,
};

const initState = (config) => {
  let state = [];
  const currentNumbers = Object.assign([], config.numbers);
  while (currentNumbers.length > 1) {
    state.push(currentNumbers.splice(utils.getRandomNumberBetween(0, currentNumbers.length), 1)[0]);
    state.push(config.operations[utils.getRandomNumberBetween(0, config.operations.length)]);
  }
  state.push(currentNumbers[0]);

  return state;
};

const evaluate = (config, individual) => {
  const result = eval(individual.state.join(''));
  if (result === null || !Number.isInteger(result)) {
    return { score: Number.MIN_VALUE, found: false, extras: { result: null } };
  }
  if (result === config.answer) {
    return { score: Number.MAX_VALUE, found: true, extras: { result } };
  }
  return { score: Number.MAX_VALUE - (config.answer - result), found: false, extras: { result } };
};

const breed = (config, parent1, parent2) => {
  const parents = [parent1, parent2];
  const geneIndexes = [];
  while (geneIndexes.length < parent1.state.length) {
    geneIndexes.push(utils.getRandomNumberBetween(0, 2));
  }
  const child = { state: [] };
  for (const i in geneIndexes) {
    if (i % 2 === 0) {
      child.state.push(parents[0].state[i]);
    } else {
      const geneIndex = geneIndexes[i];
      child.state.push(parents[geneIndex].state[i]);
    }
  }
  return [child];
};

const mutate = (config, individual) => {
  const mutatedIndividual = { state: individual.state };

  let i = 0;
  while (i < individual.state.length) {
    if (Math.random() < config.geneMutationRate) {
      if (i % 2 === 0) {
        const tmp = individual.state[i];
        const geneToSwapIndex = utils.getRandomNumberBetween(0, (individual.state.length + 1) / 2) * 2;
        individual.state[i] = individual.state[geneToSwapIndex];
        individual.state[geneToSwapIndex] = tmp;
      } else {
        mutatedIndividual.state[i] = config.operations[utils.getRandomNumberBetween(0, config.operations.length)];
      }
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
    console.log(
      `Generation ${state.generation}'s best individual : ${state.best.state.join(' ')} = ${state.best.extras.result}`,
    );
  },
  endCallback: (state) => {
    console.log(
      `Solution found after ${state.generation} generation(s) : ${state.best.state.join(' ')} = ${
        state.best.extras.result
      }`,
    );
  },
};
