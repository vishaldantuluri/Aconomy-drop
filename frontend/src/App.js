import React, { Component } from "react";
import "./App.css";
import NFTDrop from "./artifacts/contracts/NFTDrop.sol/NFTDrop.json";
import PNDC_ERC721 from "./artifacts/contracts/PNDC_ERC721.sol/PNDC_ERC721.json";
import TokenERC721 from "./artifacts/contracts/TokenERC721.sol/TokenERC721.json";
import Web3 from "web3";

const addressDrop = "0x3be68538C53B09247ce0b24e32847224fF3B9E17";
const addressPNDC = "0xf02c627B3Ae533D488cb25F072e542ee7CCc1D10"
const abi = NFTDrop.abi;

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const account = await window.ethereum.selectedAddress;
    this.setState({ account });

    const contractDrop = new web3.eth.Contract(abi, addressDrop);
    const contractPNDC = new web3.eth.Contract(PNDC_ERC721.abi, addressPNDC);

    this.setState({ contractDrop });
    this.setState({ contractPNDC });
  }

  constructor(props) {
    super(props);
    this.state = {
      contractDrop: null,
      contractPNDC: null,
      account: null,
      address: null,
      id: null,
      uri: null,
      royalty: [[]],
      time: null,
      collection: null,
    };
  }

  captureId = async (event) => {
    event.preventDefault();

    console.log("capturing Id");
    const id = event.target.value;
    this.setState({ id });

    const account = await window.ethereum.selectedAddress;
    this.setState({ account });
  };

  captureAddress = async (event) => {
    event.preventDefault();

    console.log("capturing Address");
    const address = event.target.value;
    this.setState({ address });

    const account = await window.ethereum.selectedAddress;
    this.setState({ account });
  }

  captureUri = async (event) => {
    event.preventDefault();

    console.log("capturing Uri");
    const uri = event.target.value;
    this.setState({ uri });

    const account = await window.ethereum.selectedAddress;
    this.setState({ account });
  }

  captureRoyalties = async (event) => {
    event.preventDefault();

    console.log("capturing Royalties");
    const royalty = event.target.value;
    //const royalty = Array(r);
    this.setState({ royalty:[this.state.royalty, royalty] });

    const account = await window.ethereum.selectedAddress;
    this.setState({ account });
  }

  captureTime = async (event) => {
    event.preventDefault();

    console.log("capturing time");
    const time = event.target.value;

    this.setState({ time });

    const account = await window.ethereum.selectedAddress;
    this.setState({ account });
  }

  captureCollection = async (event) => {
    event.preventDefault();

    console.log("capturing collection");
    const collection = event.target.value;

    this.setState({ collection });

    const account = await window.ethereum.selectedAddress;
    this.setState({ account });
  }

  onSafeMint = async (event) => {
    event.preventDefault();

    const account = await window.ethereum.selectedAddress;
    this.setState({ account });

    const royalties = [[account, 1000]];
    const uri = this.state.uri;
    const address = this.state.address;

    console.log(account);

    this.state.contractDrop.methods.safeMint(address, uri, royalties).send({from: account}).then((r) => {
      console.log("mint result:", r);
    })
    
  };

  onCreateClaim = async (event) => {
    event.preventDefault();

    const account = await window.ethereum.selectedAddress;
    this.setState({ account });

    const web3 = window.web3;

    const address = this.state.address;
    const id = this.state.id;
    const time = this.state.time;
    const collection = this.state.collection;

    if(collection === addressPNDC) {
      await this.state.contractPNDC.methods.approve(addressDrop, id).send({from: account}).then((r) => {
        console.log("approve return:", r);
      })
    }
    else {
      const contract = new web3.eth.Contract(TokenERC721.abi, collection);
      await contract.methods.approve(addressDrop, id).send({from: account}).then((r) => {
        console.log("approve return:", r);
      })
    }

    await this.state.contractDrop.methods.createClaim(collection, address, id, time).send({from: account}).then((r) => {
      console.log("create claim result:", r) })
  }

  onClaim = async (event) => {
    event.preventDefault();

    const account = await window.ethereum.selectedAddress;
    this.setState({ account });

    await this.state.contractDrop.methods.claim().send({from: account}).then((r) => {
      console.log("claim result:", r);
    })
  };

  onBatchMint = async (event) => {
    event.preventDefault();

    const account = await window.ethereum.selectedAddress;
    this.setState({ account });

    const address = this.state.address;
    const royalty = this.state.royalty;
    const uri = this.state.uri;
    const collection = this.state.collection;

    await this.state.contractDrop.methods.batchMint(collection, address, uri, royalty).send({from: account}).then((r) => {
      console.log("batchMint return:",r);
    })
  };

  onAddMod = async (event) => {
    event.preventDefault();

    const account = await window.ethereum.selectedAddress;
    this.setState({ account });

    const address = this.state.address;

    await this.state.contractDrop.methods.addMod(address).send({from: account}).then((r) => {
      console.log("Add mod return:", r);
    })
  }

  onRemoveMod = async (event) => {
    event.preventDefault();

    const account = await window.ethereum.selectedAddress;
    this.setState({ account });

    const address = this.state.address;

    await this.state.contractDrop.methods.removeMod(address).send({from: account}).then((r) => {
      console.log("Remove mod return:", r);
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <h1>NFT Drop test</h1>
          <br></br>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <div>
                  <p>Account : {this.state.account}</p>
                </div>
                <br></br>
                <h4>Safe Mint (Only Moderator)</h4>
                <p>Allows the contract mod to mint an nft. The royalties have been hardcoded for now but would require some input in realistic use cases. <br></br> royalty structure for safeMint: [[address, value],[address, value],...]<br></br> royalty structure for batchMint(functionality not included in this frontend): [[[address, value],[address, value],...], [[address, value],[address, value],...],...]</p>
                <form onSubmit={this.onSafeMint}>
                  <input placeholder="Address to" onChange={this.captureAddress} />
                  <input placeholder="Uri" onChange={this.captureUri} />
                  <input type="submit" />
                </form>
                <br></br>
                <br></br>
                <h4>Make Claim (Only Moderator)</h4>
                <p>Allows the contract mod to create a claim with a claimee address, claimable token Id, and claim time.<br></br> The claimable tokens for a single claimee cannot exceed 10 </p>
                <br></br>
                <form onSubmit={this.onCreateClaim}>
                  <input placeholder="Collection Address" onChange={this.captureCollection} />
                  <input placeholder="Claimee" onChange={this.captureAddress} />
                  <input placeholder="Token Id" onChange={this.captureId} />
                  <input placeholder="Time" onChange={this.captureTime} />
                  <br></br>
                  <input type="submit" />
                </form>
                <br></br>
                <h4>Claim Tokens</h4>
                <p>Allows a claimee to claim their tokens as long as claimable tokens is more than 0</p>
                <br></br>
                <form onSubmit={this.onClaim}>
                  <input type="submit" />
                </form>
                <br></br>
                <h4>Add moderator (Only Owner)</h4>
                <p>Allows the contract owner to add a moderator (The owner is already a moderator)</p>
                <br></br>
                <form onSubmit={this.onAddMod}>
                  <input placeholder="Address" onChange={this.captureAddress} />
                  <input type="submit" />
                </form>
                <br></br>
                <h4>Remove moderator (Only Owner)</h4>
                <p>Allows the contract owner to remove a moderator (The owner is already a moderator)</p>
                <br></br>
                <form onSubmit={this.onRemoveMod}>
                  <input placeholder="Address" onChange={this.captureAddress} />
                  <input type="submit" />
                </form>
                <br></br>
                <br></br>
                <br></br>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
