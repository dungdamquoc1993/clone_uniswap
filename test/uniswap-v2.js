const { expect } = require("chai");
const { parseUnits, parseEther } = require("ethers/lib/utils");
const { ethers, waffle } = require("hardhat");



describe("uniswap-v2", () => {
    let UniswapV2PairArtifacts, provider
    let coinAContract, coinBContract, coinCContract, swapFactoryContract, swapRouterContract, WETH9Contract
    let a0 = 0, a1 = 0, a2 = 0, a3 = 0
    let pairABAddress, pairBCAddress, pairAEthAddress, pairBEthAddress, pairCEthAddress
    let contractPairAB, contractPairBC, contractPairAEth, contractPairBEth, contractCEth
    let deadline = 0
    beforeEach(async () => {
        provider = waffle.provider;
        UniswapV2PairArtifacts = require('../artifacts/contracts/v2-core/UniswapV2Pair.sol/UniswapV2Pair.json');

        const [b0, b1, b2, b3] = await ethers.getSigners()
        a0 = b0, a1 = b1, a2 = b2, a3 = b3

        const coinAFactory = await ethers.getContractFactory('ERC20')
        coinAContract = await coinAFactory.deploy("Coin A", "A")
        await coinAContract.deployed();
        const coinBFactory = await ethers.getContractFactory('ERC20')
        coinBContract = await coinBFactory.deploy("Coin A", "A")
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
        await coinBContract.mint(a0.address, parseUnits("1000", 12))
        await coinCContract.mint(a0.address, parseUnits("1000", 12))


        await coinAContract.connect(a0).approve(swapRouterContract.address, parseUnits('1000', 12))
        await coinBContract.connect(a0).approve(swapRouterContract.address, parseUnits('1000', 12))
        await coinCContract.connect(a0).approve(swapRouterContract.address, parseUnits('1000', 12))

        deadline = new Date().getTime() + 60 * 60 * 24 * 1000

        await swapRouterContract.addLiquidity(coinAContract.address, coinBContract.address,
            parseUnits("10", 12), parseUnits("200", 12), 0, 0, a0.address, deadline) // add liquidity A B
        await swapRouterContract.addLiquidity(coinAContract.address, coinBContract.address,
            parseUnits("10", 12), parseUnits("200", 12), 0, 0, a0.address, deadline) // add liquidity A B
        await swapRouterContract.addLiquidity(coinBContract.address, coinCContract.address,
            parseUnits("100", 12), parseUnits("10", 12), 0, 0, a0.address, deadline) // add liquidity B C
        await swapRouterContract.addLiquidity(coinBContract.address, coinCContract.address,
            parseUnits("100", 12), parseUnits("10", 12), 0, 0, a0.address, deadline) // add liquidity B C


        await swapRouterContract.connect(a0).addLiquidityETH(coinAContract.address,
            parseUnits('300', 12), 0, 0, a0.address, deadline, { value: parseEther('1') })  // add liquidity A Eth
        await swapRouterContract.connect(a0).addLiquidityETH(coinBContract.address,
            parseUnits('200', 12), 0, 0, a0.address, deadline, { value: parseEther('1') }) // add liquidity B Eth
        await swapRouterContract.connect(a0).addLiquidityETH(coinCContract.address,
            parseUnits('100', 12), 0, 0, a0.address, deadline, { value: parseEther('1') }) // add liquidity C Eth

        pairABAddress = await swapFactoryContract.getPair(coinAContract.address, coinBContract.address)
        pairBCAddress = await swapFactoryContract.getPair(coinCContract.address, coinBContract.address)
        pairAEthAddress = await swapFactoryContract.getPair(coinAContract.address, WETH9Contract.address)
        pairBEthAddress = await swapFactoryContract.getPair(coinBContract.address, WETH9Contract.address)
        pairCEthAddress = await swapFactoryContract.getPair(coinCContract.address, WETH9Contract.address)

        contractPairAB = await ethers.getContractAt(UniswapV2PairArtifacts.abi, pairABAddress)
        contractPairBC = await ethers.getContractAt(UniswapV2PairArtifacts.abi, pairBCAddress)
        contractPairAEth = await ethers.getContractAt(UniswapV2PairArtifacts.abi, pairAEthAddress)
        contractPairBEth = await ethers.getContractAt(UniswapV2PairArtifacts.abi, pairBEthAddress)
        contractCEth = await ethers.getContractAt(UniswapV2PairArtifacts.abi, pairCEthAddress)

    })
    it('swap A to C', async () => {
        console.log(await coinAContract.balanceOf(a0.address))
        console.log(await coinBContract.balanceOf(a0.address))
        console.log(await coinCContract.balanceOf(a0.address))

        await swapRouterContract.connect(a0).swapExactTokensForTokens(parseUnits('1', 12), 0, [coinAContract.address, coinBContract.address, coinCContract.address], a0.address, deadline)

        console.log(await coinAContract.balanceOf(a0.address))
        console.log(await coinBContract.balanceOf(a0.address))
        console.log(await coinCContract.balanceOf(a0.address))
    })
    // it('swap exact eth for tokens', async () => {
    //     console.log(await coinAContract.balanceOf(a0.address))
    //     console.log(await coinAContract.balanceOf(pairAEthAddress))
    //     console.log(await WETH9Contract.balanceOf(pairAEthAddress))
    //     console.log(await provider.getBalance(a0.address))
    //     await swapRouterContract.swapTokensForExactETH(parseUnits('0.5', 18), parseUnits('300', 12), [coinAContract.address, WETH9Contract.address], a0.address, deadline)
    //     console.log(await coinAContract.balanceOf(a0.address))
    //     console.log(await coinAContract.balanceOf(pairAEthAddress))
    //     console.log(await WETH9Contract.balanceOf(pairAEthAddress))
    //     console.log(await provider.getBalance(a0.address))

    // })
    // it('add liquidity ETH', async () => {
    //     console.log(await coinAContract.balanceOf(a0.address))
    //     console.log(await coinAContract.balanceOf(pairAEthAddress))
    //     console.log(await WETH9Contract.balanceOf(pairAEthAddress))
    //     console.log()

    //     console.log(await coinBContract.balanceOf(a0.address))
    //     console.log(await coinBContract.balanceOf(pairBEthAddress))
    //     console.log(await WETH9Contract.balanceOf(pairBEthAddress))
    //     console.log()

    //     console.log(await coinCContract.balanceOf(a0.address))
    //     console.log(await coinCContract.balanceOf(pairCEthAddress))
    //     console.log(await WETH9Contract.balanceOf(pairCEthAddress))
    //     console.log()
    //     console.log(await provider.getBalance(a0.address))

    // })
    // it('swap exact eth for tokens', async () => {
    //     console.log(await coinAContract.balanceOf(a0.address))
    //     console.log(await coinAContract.balanceOf(pairAEthAddress))
    //     console.log(await WETH9Contract.balanceOf(pairAEthAddress))
    //     console.log(await provider.getBalance(a0.address))
    //     await swapRouterContract.swapExactETHForTokens(parseUnits('0', 12), [WETH9Contract.address, coinAContract.address], a0.address, deadline, { value: parseEther('5') })
    //     console.log(await coinAContract.balanceOf(a0.address))
    //     console.log(await coinAContract.balanceOf(pairAEthAddress))
    //     console.log(await WETH9Contract.balanceOf(pairAEthAddress))
    //     console.log(await provider.getBalance(a0.address))
    // })

    // it("create new pair when first time add liquidity", async () => {
    //     expect(parseInt(await coinAContract.balanceOf(a0.address)) / 1e12).to.equal(990)
    //     expect(parseInt(await coinBContract.balanceOf(a0.address)) / 1e12).to.equal(700)
    //     expect(parseInt(await coinCContract.balanceOf(a0.address)) / 1e12).to.equal(990)
    //     expect(parseInt(await coinAContract.balanceOf(await swapFactoryContract.getPair(coinAContract.address, coinBContract.address))) / 10 ** 12).to.equal(10)
    //     expect(parseInt(await coinBContract.balanceOf(await swapFactoryContract.getPair(coinAContract.address, coinBContract.address))) / 10 ** 12).to.equal(200)
    //     expect(parseInt(await coinBContract.balanceOf(await swapFactoryContract.getPair(coinBContract.address, coinCContract.address))) / 10 ** 12).to.equal(100)
    //     expect(parseInt(await coinCContract.balanceOf(await swapFactoryContract.getPair(coinBContract.address, coinCContract.address))) / 10 ** 12).to.equal(10)
    // })

    // it("remove liquidity form pair coinA and coinB", async () => {
    //     expect(parseInt(await contractPairAB.balanceOf(a0.address)) / 1e12).to.equal(89.44271909899)
    //     expect(parseInt(await contractPairBC.balanceOf(a0.address)) / 1e12).to.equal(63.245553202366)
    //     await contractPairAB.approve(swapRouterContract.address, parseUnits('100', 12))
    //     await contractPairBC.approve(swapRouterContract.address, parseUnits('100', 12))
    //     await swapRouterContract.removeLiquidity(coinBContract.address, coinAContract.address, parseUnits("89.44271909899", 12), 0, 0, a0.address, deadline)
    //     await swapRouterContract.removeLiquidity(coinBContract.address, coinCContract.address, parseUnits("63.245553202366", 12), 0, 0, a0.address, deadline)

    //     console.log(await contractPairAB.balanceOf(a0.address))
    //     console.log(await contractPairBC.balanceOf(a0.address))
    //     console.log(await coinAContract.balanceOf(a0.address))
    //     console.log(await coinBContract.balanceOf(a0.address))
    //     console.log(await coinCContract.balanceOf(a0.address))

    //     console.log(await coinAContract.balanceOf(pairABAddress))
    //     console.log(await coinBContract.balanceOf(pairABAddress))
    //     console.log(await coinBContract.balanceOf(pairBCAddress))
    //     console.log(await coinCContract.balanceOf(pairBCAddress))
    // })


})