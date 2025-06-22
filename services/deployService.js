const { ethers } = require('ethers');
const MintFactoryABI = require('../abi/MintFactory.json');
const NFTCollectionABI = require('../abi/NFTCollection.json');

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const mintFactory = new ethers.Contract(process.env.MINT_FACTORY_ADDRESS, MintFactoryABI, wallet);

async function deployCollection(name, symbol) {
  const tx = await mintFactory.deployNewCollection(name, symbol);
  const receipt = await tx.wait();

  const event = receipt.logs.find(log => log.topics[0] === ethers.id("CollectionDeployed(address,address)"));
  const deployedAddress = '0x' + event.data.slice(26, 66);
  return deployedAddress;
}

async function mintNFTs(contractAddress, metadataUrls) {
  const contract = new ethers.Contract(contractAddress, NFTCollectionABI, wallet);

  for (const url of metadataUrls) {
    await contract.mintNFT(wallet.address, url);
  }
}

module.exports = {
  deployCollection,
  mintNFTs
};
