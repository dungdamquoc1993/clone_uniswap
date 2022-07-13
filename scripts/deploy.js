
const { parseUnits } = require("ethers/lib/utils");
const hre = require("hardhat");
const { ethers } = require("hardhat");
const swapRouterJSON = require('../artifacts/contracts/router/UniswapV2Router02.sol/UniswapV2Router02.json')

async function main() {
  // WETH Kovan 0xd0A1E359811322d97991E03f863a0C30C2cF029C
  // const pairArtifacts = await ethers.getContractFactory('UniswapV2Pair')
  // console.log(ethers.utils.keccak256(pairArtifacts.bytecode))
  // bytes memory bytecode = type(UniswapV2Pair).creationCode;
  // hex"31ce0ca85e4121a425783ad17d7181cc307b47c799527650712e46073cf73794" // init code hash

  // const WETH9Factory = await ethers.getContractFactory('WETH9')
  // WETH9Contract = await WETH9Factory.deploy()
  // await WETH9Contract.deployed()
  // console.log(WETH9Contract.address)

  // const swapFactoryFactory = await ethers.getContractFactory('UniswapV2Factory')
  // swapFactoryContract = await swapFactoryFactory.deploy('0xe5f084144d8ff52b6FF61e5e5E551562B7bB270c')
  // await swapFactoryContract.deployed()
  // console.log(swapFactoryContract.address) 

  // const swapRouterFactory = await ethers.getContractFactory('UniswapV2Router02')
  // swapRouterContract = await swapRouterFactory.deploy(swapFactoryContract.address, WETH9Contract.address)
  // await swapRouterContract.deployed()
  // console.log(swapRouterContract.address)


  const swapRouterFactory = await ethers.getContractFactory('UniswapV2Router02')
  const swapRouterContract = await swapRouterFactory.deploy('0x5558C5D2eba6f1eDebBc730c4E6F48ea25D48bbB', '0xd0A1E359811322d97991E03f863a0C30C2cF029C')
  await swapRouterContract.deployed()
  console.log(swapRouterContract.address)

  // const provider = new ethers.providers.JsonRpcProvider('https://kovan.infura.io/v3/8bf322110b8c4fbf87055c7fd3981adf')
  // const wallet = new ethers.Wallet('9164744f372f6a73c3788a5436ac0fbc58977df91b852eef53c1ef5250414b86', provider)
  // const swapRouterFactory = await ethers.getContractFactory('UniswapV2Router02')
  // const swapRouterContract = await swapRouterFactory.connect(wallet).deploy('0x5558C5D2eba6f1eDebBc730c4E6F48ea25D48bbB', '0xd0A1E359811322d97991E03f863a0C30C2cF029C', {gasPrice: 8000000000})
  // await swapRouterContract.deployed()
  // console.log(swapRouterContract.address)


}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

runMain()

