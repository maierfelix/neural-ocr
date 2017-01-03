const synaptic = require("synaptic");

console.log("Generating training set..");

let data = require("./process");

let bitsToStr = (array) => {
  let bin = array.map((v) => {
    return Math.round(v);
  }).join("");
  return (
    String.fromCharCode(parseInt(bin, 2))
  );
};

const Layer = synaptic.Layer;
const inputs = new Layer(128);
const hiddens = new Layer(125);
const outputs = new Layer(7);

inputs.project(hiddens);
hiddens.project(outputs);

const Network = synaptic.Network;
const nn = new Network({
  input: inputs,
  hidden: [hiddens],
  output: outputs
});

const Trainer = synaptic.Trainer;
const trainer = new Trainer(nn);

const limit = 2500;
let trainset = [];

for (let ii = 0; ii < data.length; ++ii) {
  if (ii > limit) break;
  trainset.push({
    input: data[ii].data,
    output: data[ii].letter
  });
};

console.log("Training network...");

trainer.train(trainset, {
  iterations: 25000,
  log: true,
  shuffle: true
});

let failed = 0;
let length = limit*2;
for (let jj = limit; jj < length; ++jj) {
  let input = data[jj];
  let expect = bitsToStr(input.letter);
  let result = nn.activate(input.data);
  let output = bitsToStr(result);
  if (expect !== output) {
    console.log(output, "!==", expect);
    failed++;
  }
};

let won = (length-failed);
let rate = (won/(won+failed))*1e2 | 0;
console.log(`Success rate: ${rate}%`);

let path = "states/" + Date.now() + ".json";
let json = JSON.stringify(nn.toJSON());
require("fs").writeFileSync(path, json, "utf-8");
console.log(`${failed}/${length} failed!`);