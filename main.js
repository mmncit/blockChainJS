// Creating a blockchain with Javascript
// ref: https://www.youtube.com/watch?v=zVqczFZr124
const SHA256 = require("crypto-js/sha256");
class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  // calculate the hash of the block
  calculateHash() {
    // use crypto-js
    // npm install --save crypto-js
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()]; // initialize with genesis block
  }

  // Genesis block does not have previous hash
  // It's the first block
  createGenesisBlock() {
    return new Block(0, "20/08/2019", "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // validate the hash
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // check lineage of blocks
      if (currentBlock.previousHash != previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

let mmnCoin = new BlockChain();
mmnCoin.addBlock(new Block(1, "21/08/2019", { amount: 4 }));
mmnCoin.addBlock(new Block(1, "23/08/2019", { amount: 10 }));

console.log(JSON.stringify(mmnCoin, null, 4));

console.log("Is blockchain valid?", mmnCoin.isChainValid());

// temper the block chain
mmnCoin.chain[1].data = { amount: 100 }; // temper the data
mmnCoin.chain[1].hash = mmnCoin.chain[1].calculateHash(); // recalculate hash
console.log("Is blockchain valid?", mmnCoin.isChainValid()); // lineage is broken

// run from command line: node main.js
