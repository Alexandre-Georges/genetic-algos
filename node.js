const genetics = require('./src/genetics/genetics.js')

genetics.setup(0, 'sentence', {}, state => {
  console.log(`Generation ${state.generation}'s best individual : ${state.best}`);
}, state => {
  console.log(`Solution found after ${state.generation} generation(s) : ${state.best}`);
});
genetics.start();
