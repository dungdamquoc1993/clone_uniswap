const { expect } = require("chai");
const { parseUnits } = require("ethers/lib/utils");
const { ethers } = require("hardhat");


describe("uniswap-v2", () => {
    let coinAContract, coinBConTract, coinCContract, swapFactoryContract, swapRouterContract, WETH9Contract
    let a0 = 0, a1 = 0, a2 = 0, a3 = 0
    let deadline = 0
    beforeEach(async () => {
        const [b0, b1, b2, b3] = await ethers.getSigners()
        a0 = b0, a1 = b1, a2 = b2, a3 = b3

        const coinAFactory = await ethers.getContractFactory('ERC20')
        coinAContract = await coinAFactory.deploy("Coin A", "A")
        await coinAContract.deployed();
        const coinBFactory = await ethers.getContractFactory('ERC20')
        coinBConTract = await coinBFactory.deploy("Coin A", "A")
        await coinAContract.deployed();
        const coinCFactory = await ethers.getContractFactory('ERC20')
        coinCContract = await coinCFactory.deploy("Coin A", "A")
        await coinCContract.deployed();

        const WETH9Factory = await ethers.getContractFactory('WETH9')
        WETH9Contract = await WETH9Factory.deploy()
        await WETH9Contract.deployed()
        const swapFactoryFactory = await ethers.getContractFactory('UniswapV2Factory')
        swapFactoryContract = await swapFactoryFactory.deploy(a0.address)
        await swapFactoryContract.deployed()

        // const pairArtifacts = await ethers.getContractFactory('UniswapV2Pair')
        // console.log(ethers.utils.keccak256(pairArtifacts.bytecode))
        // bytes memory bytecode = type(UniswapV2Pair).creationCode;
        // hex"31ce0ca85e4121a425783ad17d7181cc307b47c799527650712e46073cf73794" // init code hash

        const swapRouterFactory = await ethers.getContractFactory('UniswapV2Router02')
        swapRouterContract = await swapRouterFactory.deploy(swapFactoryContract.address, WETH9Contract.address)
        await swapRouterContract.deployed()

        await coinAContract.mint(a0.address, parseUnits("1000", 12))
        await coinBConTract.mint(a0.address, parseUnits("1000", 12))
        await coinCContract.mint(a0.address, parseUnits("1000", 12))
        deadline = new Date().getTime() + 60 * 60 * 24 * 1000
    })

    it("create new pair when first time add liquidity", async () => {
        let addLiquidity = await swapRouterContract.addLiquidity(coinAContract.address, coinBConTract.address,
            parseUnits("10", 12), parseUnits("200", 12), 0, 0, a0.address, deadline)
        console.log(addLiquidity)
    })
})