import React, { Component } from 'react';
import Web3 from 'web3';
import Color from '../abis/Color.json';
import logo from '../logo.png';
import './App.css';

class App extends Component {

  //2. Define Web3 load in React Lifecycle Method: component will mount
  async componentWillMount() {
    await this.loadWeb3()
    console.log("web3 may be attatched!")
    await this.loadBlockchainData()
  }

  //1. Generate Web3.js connection
  //This is how to get web3 from blog
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    //load the account, see web3 eth doc.
    const accounts = await web3.eth.getAccounts()
    //Set account 0 as a React state (user)
    this.setState({account: accounts[0]})

    //Deployed smart contract instance, taken by web3.
    //Color is defined by grabbing abi json file from /src/abis
    const networkId = await web3.eth.net.getId()
    const networkData = Color.networks[networkId]
    //Prevents app to blow up.
    if(networkData) {
      const abi = Color.abi
      const address = networkData.address
      //get contract and save it to the state
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract });
      console.log(contract)
      //get totalSupply (token number) and save it to the state
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply });
      //get each colors and save it to the color state (array form)
      for(var i = 1; i <= totalSupply; i++) {
        var color = await contract.methods.colors(i-1).call()
        this.setState({
          //This is how to push items into array in the state
          colors:[...this.state.colors, color]
        })
      }
    } else {
      window.alert("smart contract is not deployed on this network")
    }
  }

  //When declaring function in React, has to be anonymous.
  mint = (color) => {
    //Reading from the Blockchain, call. Writing to the Blockchain, send.
    this.state.contract.methods.mint(color).send({ from: this.state.account }).once('receipt', (receipt) => {
      this.setState({
        colors:[...this.state.colors, color]
      })
    })
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      colors: []
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <div
            className="text-white navbar-brand col-sm-3 col-md-2 mr-0"
            rel="noopener noreferrer"
          >
            Color NFTs using ERC-721
          </div>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {/* Form goes here */}
                <h1>Issue Token</h1>
                <form onSubmit={(event)=>{
                  event.preventDefault()
                  var color = this.color.value
                  this.mint(color)
                }}>
                  <input 
                    type='text' 
                    className='form-control mb-1' 
                    placeholder='e.g. #FFFFFF'
                    ref={(input) => {this.color = input}}
                  />
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
            </main>
          </div>
          <hr/>
          {/* Tokens goes here */}
          <div className="row text-center">
          {this.state.colors.map((color, key) => {
            return(
              <div key={key} className="col-md-3 mb-3">
                <div className="token" style={{ backgroundColor: color }}></div>
                <div>{color}</div>
              </div>
            )
          })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
