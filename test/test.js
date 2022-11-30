const { expect } = require("chai");

describe("Claim contract", function () {

    let pndc;
    let token;
    let factory;
    let drop;
    let owner;
    let addr1;
    let addr2;

    it("deploys", async () => {
        const NFTDrop = await hre.ethers.getContractFactory("NFTDrop");
        const TokenFactory = await hre.ethers.getContractFactory("TokenFactory")
        const PNDC_ERC721 = await hre.ethers.getContractFactory("PNDC_ERC721")
        const TokenERC721 = await hre.ethers.getContractFactory("TokenERC721")
        const [a, b, c] = await ethers.getSigners();

        owner = a;
        addr1 = b;
        addr2 = c;
        pndc = await PNDC_ERC721.deploy("NFT", "NFT");
        token = await TokenERC721.deploy("Token", "TKN");
        factory = await TokenFactory.deploy();
        drop = await NFTDrop.deploy(pndc.address, factory.address);
    })

    it("should safely mint the tokens", async () => {
        await pndc.safeMint(owner.address, "uri", [[owner.address, 100]]);
        await pndc.safeMint(owner.address, "uri", [[owner.address, 100]]);
        await pndc.safeMint(owner.address, "uri", [[owner.address, 100]]);
        await pndc.safeMint(owner.address, "uri", [[owner.address, 100]]);
        await pndc.safeMint(owner.address, "uri", [[owner.address, 100]]);
        await pndc.safeMint(owner.address, "uri", [[owner.address, 100]]);
        await pndc.safeMint(owner.address, "uri", [[owner.address, 100]]);
        await pndc.safeMint(owner.address, "uri", [[owner.address, 100]]);
        await pndc.safeMint(owner.address, "uri", [[owner.address, 100]]);
        await pndc.safeMint(owner.address, "uri", [[owner.address, 100]]);
        await token.safeMint(owner.address, "uri", [true, [[owner.address, 100]]]);

        expect(await pndc.ownerOf(0)).to.equal(owner.address);
        expect(await pndc.ownerOf(1)).to.equal(owner.address);
        expect(await pndc.ownerOf(2)).to.equal(owner.address);
        expect(await pndc.ownerOf(3)).to.equal(owner.address);
        expect(await pndc.ownerOf(4)).to.equal(owner.address);
        expect(await pndc.ownerOf(5)).to.equal(owner.address);
        expect(await pndc.ownerOf(6)).to.equal(owner.address);
        expect(await pndc.ownerOf(7)).to.equal(owner.address);
        expect(await pndc.ownerOf(8)).to.equal(owner.address);
        expect(await pndc.ownerOf(9)).to.equal(owner.address);
        expect(await token.ownerOf(0)).to.equal(owner.address);
    })

    it("should create a claim", async () => {
        await pndc.approve(drop.address, 0);
        await pndc.approve(drop.address, 1);
        await pndc.approve(drop.address, 2);
        await pndc.approve(drop.address, 3);
        await pndc.approve(drop.address, 4);
        await pndc.approve(drop.address, 5);
        await pndc.approve(drop.address, 6);
        await pndc.approve(drop.address, 7);
        await pndc.approve(drop.address, 8);
        await token.approve(drop.address, 0);
        await factory.addCollection(token.address);
        await drop.createClaim(pndc.address, addr1.address, 0, 300, 0);
        await drop.createClaim(pndc.address, addr1.address, 1, 300, 0);
        await drop.createClaim(pndc.address, addr1.address, 2, 300, 0);
        await drop.createClaim(pndc.address, addr1.address, 3, 300, 0);
        await drop.createClaim(pndc.address, addr1.address, 4, 300, 0);
        await drop.createClaim(pndc.address, addr1.address, 5, 300, 0);
        await drop.createClaim(pndc.address, addr1.address, 6, 300, 0);
        await drop.createClaim(pndc.address, addr1.address, 7, 300, 0);
        await drop.createClaim(pndc.address, addr1.address, 8, 300, 0);
        await drop.createClaim(token.address, addr1.address, 0, 300, 100);

        let claims = await drop.getClaims(addr1.address);

        expect(claims[0].moderator).to.equal(owner.address);
        expect(claims[0].collection).to.equal(pndc.address)
        expect(claims[0].tokenId).to.equal(0)
        // expect(claims[0].endTime).to.equal(Math.floor(Date.now() / 1000) + 300)
        expect(claims[0].price).to.equal(0)

        expect(claims[9].moderator).to.equal(owner.address);
        expect(claims[9].collection).to.equal(token.address)
        expect(claims[9].tokenId).to.equal(0)
        // expect(claims[9].endTime).to.equal(Math.floor(Date.now() / 1000) + 300)
        expect(claims[9].price).to.equal(100)
    })

    it("should disallow more than 10 claims", async () => {
        await pndc.approve(drop.address, 9);
        await expect(drop.createClaim(pndc.address, addr1.address, 9, 300, 0)).to.be.revertedWith("claimee's pending claims limit reached")
    })

    it("should be able to claim", async () => {
        await drop.connect(addr1).claim({value: 100});

        expect(await pndc.ownerOf(0)).to.equal(addr1.address);
        expect(await token.ownerOf(0)).to.equal(addr1.address);
    })

})