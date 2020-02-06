const genetics = require('./src/genetics/genetics.js')
const model = require('./src/genetics/hello-model.js')

genetics.start(0, model, (generation, state) => {
  console.log(`Generation ${generation}'s best individual : ${state}`);
}, (generation, state) => {
  console.log(`Solution found : ${state}`);
});
