const { expect, assert } = require("chai")
const { web3, ethers } = require("hardhat")
const { BN, time, balance, expectEvent, expectRevert } = require("@openzeppelin/test-helpers")
const ether = require("@openzeppelin/test-helpers/src/ether")

let nft, mockERC1155
let owner, acc1, acc2, acc3

describe("NFT", function () {
	beforeEach(async function () {
		let NFTContract = await ethers.getContractFactory("Pets")

		//deploy an erc1155 nft
		let mockERC1155Contract = await ethers.getContractFactory("ERC1155Mock")
		mockERC1155 = await mockERC1155Contract.deploy()
		await mockERC1155.deployed()

		nft = await NFTContract.deploy(mockERC1155.address)
		await nft.deployed()
		;[owner, acc1, acc2, acc3] = await ethers.getSigners()

		await mockERC1155.setApprovalForAll(nft.address, true, { from: owner.address })
	})

	it("simple test....", async function () {
		expect(await nft.owner()).to.equal(owner.address)
	})

	it("getting the pet works", async function () {
		//it doesn't have the pet
		let balanceOf5 = Number(await nft.balanceOf(owner.address, 5))
		expect(balanceOf5).to.equal(0)

		//it has the cat
		let balanceOf5Cat = Number(await mockERC1155.balanceOf(owner.address, 5))
		expect(balanceOf5Cat).to.equal(1)

		await nft.mint(5)

		//it has the pet & the cat
		balanceOf5 = Number(await nft.balanceOf(owner.address, 5))
		expect(balanceOf5).to.equal(1)
		balanceOf5Cat = Number(await mockERC1155.balanceOf(owner.address, 5))
		expect(balanceOf5Cat).to.equal(1)
	})

	it("getting the pet doesn't work if you don't own the cat", async function () {
		//it doesn't have the pet
		let balanceOf5 = Number(await nft.balanceOf(owner.address, 15))
		expect(balanceOf5).to.equal(0)

		//it doesn't the cat
		let balanceOf5Cat = Number(await mockERC1155.balanceOf(owner.address, 15))
		expect(balanceOf5Cat).to.equal(0)

		await expect(nft.mint(15)).to.be.revertedWith("you have to own this cat with this id")

		//it doesn't have the pet
		balanceOf5 = Number(await nft.balanceOf(owner.address, 15))
		expect(balanceOf5).to.equal(0)
	})

	it("getting the pet works from another account", async function () {
		//it doesn't have the pet
		await mockERC1155.safeTransferFrom(owner.address, acc1.address, 7, 1, 0x00)

		let balanceOf7 = Number(await mockERC1155.balanceOf(acc1.address, 7))
		expect(balanceOf7).to.equal(1)

		await nft.connect(acc1).mint(7)

		//it has the pet & the cat
		balanceOf7 = Number(await nft.balanceOf(acc1.address, 7))
		expect(balanceOf7).to.equal(1)
		let balanceOf7Cat = Number(await mockERC1155.balanceOf(acc1.address, 7))
		expect(balanceOf7Cat).to.equal(1)
	})

	it("token uri changes after the reveal", async function () {
		await nft.mint(1)
		balanceOf5 = Number(await nft.balanceOf(owner.address, 1))
		expect(balanceOf5).to.equal(1)
		let tokenURI = await nft.uri(1)
		expect(tokenURI).to.equal(
			"https://raw.githubusercontent.com/nftinvesting/pets/master/other/default.json"
		)
		// some time passes
		await time.increase(time.duration.days(2))
		let tokenURINew = await nft.uri(1)
		expect(tokenURINew).to.equal("https://guttercatgang.s3.us-east-2.amazonaws.com/TODO/1")
	})

	it("can transfer the pet around...", async function () {
		await nft.mint(7)
		await nft.safeTransferFrom(owner.address, acc2.address, 7, 1, 0x00)

		//it has the pet & the cat
		balanceOf7 = Number(await nft.balanceOf(acc2.address, 7))
		expect(balanceOf7).to.equal(1)
	})
})
