const utils = require('./utils.js');
const sentenceModel = require('./sentence-model.js');

const createPopulation = (number, initStateFunction) => {
  const population = [];
  for (let i = 0; i < number; i++) {
    population.push({ state: initStateFunction() });
  }
  return population;
};

const evaluatePopulation = (population, evaluateFunction) => {
  const orderedPopulation = [];
  for (let individual of population) {
    const result = evaluateFunction(individual);
    orderedPopulation.push(Object.assign({}, individual, { score: result.score, found: result.found }));
  }
  return orderedPopulation.sort((i1, i2) => i2.score - i1.score);
};

const breedPopulation = (populationSize, population, breedFunction) => {
  let newGeneration = [];
  while (newGeneration.length < populationSize) {
    const parent1Index = utils.getRandomNumberBetween(0, population.length);
    const parent2Index = utils.getRandomNumberBetween(0, population.length);
    const newIndividuals = breedFunction(population[parent1Index], population[parent2Index]);
    newGeneration = newGeneration.concat(newIndividuals);
  }
  return newGeneration;
};

const mutatePopulation = (population, mutationRate, mutationFunction) => {
  const mutatedPopulation = [];
  for (let i in population) {
    const individual = population[i];
    if (Math.random() < mutationRate) {
      mutatedPopulation.push(mutationFunction(individual));
    } else {
      mutatedPopulation.push(individual);
    }
  }
  return mutatedPopulation;
};

const nextGeneration = (timeout, population, generation, model, stateCallback, solutionCallback) => {
  let stop = false;
  setTimeout(() => {
    population = evaluatePopulation(population, model.evaluate);
    stateCallback({ generation, best: population[0].state });
    if (population[0].found === true) {
      solutionCallback({ generation, best: population[0].state });
      stop = true;
    }
    population = model.chuck(population);
    population = breedPopulation(model.populationSize, population, model.breed);
    population = mutatePopulation(population, model.mutationRate, model.mutate);

    if (!stop) {
      nextGeneration(timeout, population, generation + 1, model, stateCallback, solutionCallback);
    }
  }, timeout);
};

const setup = (timeoutP, algoP, setupP, stateCallbackP, endCallbackP) => {
  timeout = timeoutP;
  if (algoP === 'sentence') {
    model = sentenceModel;
  }
  stateCallback = stateCallbackP;
  endCallback = endCallbackP;
};

const start = () => {
  let population = createPopulation(model.populationSize, model.initState);
  nextGeneration(timeout, population, 1, model, stateCallback, endCallback)
};

let timeout = null;
let model = null;
let stateCallback = null;
let endCallback = null;

module.exports = {
  createPopulation,
  evaluatePopulation,
  breedPopulation,
  mutatePopulation,
  setup,
  start,
};