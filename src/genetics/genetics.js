const utils = require('./utils.js');
const sentenceModel = require('./sentence-model.js');
const calculationModel = require('./calculation-model.js');
const mastermindModel = require('./mastermind-model.js');

const createPopulation = (config, initStateFunction) => {
  const population = [];
  for (let i = 0; i < config.populationSize; i++) {
    population.push({ state: initStateFunction(config) });
  }
  return population;
};

const evaluatePopulation = (config, population, evaluateFunction) => {
  const orderedPopulation = [];
  for (let individual of population) {
    const result = evaluateFunction(config, individual);
    orderedPopulation.push(
      Object.assign({}, individual, {
        score: result.score,
        found: result.found,
        extras: result.extras,
      }),
    );
  }
  return orderedPopulation.sort((i1, i2) => i2.score - i1.score);
};

const breedPopulation = (config, population, breedFunction) => {
  let newGeneration = [];
  while (newGeneration.length < config.populationSize) {
    const parent1Index = utils.getRandomNumberBetween(0, population.length);
    const parent2Index = utils.getRandomNumberBetween(0, population.length);
    const newIndividuals = breedFunction(config, population[parent1Index], population[parent2Index]);
    newGeneration = newGeneration.concat(newIndividuals);
  }
  return newGeneration;
};

const mutatePopulation = (config, population, mutationFunction) => {
  const mutatedPopulation = [];
  for (let i in population) {
    const individual = population[i];
    if (Math.random() < config.mutationRate) {
      mutatedPopulation.push(mutationFunction(config, individual));
    } else {
      mutatedPopulation.push(individual);
    }
  }
  return mutatedPopulation;
};

const nextGeneration = (config, timeout, population, generation, model, stateCallback, solutionCallback) => {
  let stop = false;
  setTimeout(() => {
    population = evaluatePopulation(config, population, model.evaluate);
    stateCallback({ generation, best: population[0] });
    if (population[0].found === true) {
      solutionCallback({ generation, best: population[0] });
      stop = true;
    }
    population = model.chuck(config, population);
    population = breedPopulation(config, population, model.breed);
    population = mutatePopulation(config, population, model.mutate);

    if (!stop) {
      nextGeneration(config, timeout, population, generation + 1, model, stateCallback, solutionCallback);
    }
  }, timeout);
};

const start = (timeout, algo, config, stateCallback, endCallback) => {
  const model = getModel(algo);
  const modelConfig = Object.assign({}, model.getConfig(), config);

  let population = createPopulation(modelConfig, model.initState);
  nextGeneration(
    modelConfig,
    timeout,
    population,
    1,
    model,
    stateCallback ? stateCallback : model.stateCallback,
    endCallback ? endCallback : model.endCallback,
  );
};

const getConfig = (algo) => getModel(algo).getConfig();

const getModel = (algo) => {
  if (algo === 'sentence') {
    return sentenceModel;
  } else if (algo === 'calculation') {
    return calculationModel;
  } else if (algo === 'mastermind') {
    return mastermindModel;
  }
};

module.exports = {
  createPopulation,
  evaluatePopulation,
  breedPopulation,
  mutatePopulation,
  start,
  getConfig,
};
