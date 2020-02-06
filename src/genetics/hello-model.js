const utils = require('./utils.js');

const RIGHT_ANSWER = 'je ne suis pas un dildo';
const POPULATION_SIZE = 10000;
const MUTATION_RATE = 0.5;
const GENE_MUTATION_CHANCE = 6;

const ALLOWED_LETTERS = 'qwertyuiopasdfghjklzxcvbnm ';

const initState = () => {
  let state = '';
  for (let i = 0; i < RIGHT_ANSWER.length; i++) {
    state += ALLOWED_LETTERS[utils.getRandomNumberBetween(0, ALLOWED_LETTERS.length)];
  }
  return state;
};

const evaluate = individual => {
  let score = 0;
  for (let i = 0; i < individual.state.length; i++) {
    const c = individual.state[i];
    if (RIGHT_ANSWER.match(c)) {
      if (RIGHT_ANSWER.charAt(i) === c) {
        score += 10;
      } else {
        score += 1;
      }
    }
  }
  return { score, found: score === RIGHT_ANSWER.length * 10 };
};

const breed = (parent1, parent2) => {
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
  return [ child ];
};

const mutate = individual => {
  const mutatedIndividual = { state: individual.state };

  const shouldMutates = [];
  while (shouldMutates.length < individual.state.length) {
    shouldMutates.push(utils.getRandomNumberBetween(0, GENE_MUTATION_CHANCE));
  }
  for (const i in shouldMutates) {
    const index = parseInt(i);
    if (shouldMutates[index] === 0) {
      mutatedIndividual.state =
        mutatedIndividual.state.substr(0, index) +
        ALLOWED_LETTERS[utils.getRandomNumberBetween(0, ALLOWED_LETTERS.length)] +
        mutatedIndividual.state.substr(index + 1, mutatedIndividual.state.length - index);
    }
  }
  return mutatedIndividual;
};

const chuck = population => {
  const bestScore = population[0].score;
  const minPopulation = 6;
  let acceptedPopulationIndex = 0;
  while (acceptedPopulationIndex < minPopulation - 1 && population[acceptedPopulationIndex].score > bestScore / 2) {
    acceptedPopulationIndex++;
  }
  return population.slice(0, acceptedPopulationIndex + 1);
};

module.exports = {
  initState,
  evaluate,
  breed,
  mutate,
  chuck,
  populationSize: POPULATION_SIZE,
  mutationRate: MUTATION_RATE,
};
