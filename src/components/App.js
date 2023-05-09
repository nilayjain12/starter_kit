import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Marketplace from '../abis/Marketplace.json';
import Navbar from './Navbar';
import Main from './Main';
import 'bootstrap/dist/css/bootstrap.min.css';
import SocialNetwork from '../abis/SocialNetwork.json'


class App extends Component {

  async componentWillMount() {
    // Loading the blockchain connectivity through the web application
    await this.loadWeb3()
    // Loading the current account address
    await this.loadBlockchainData()


    const { marketplace } = this.state;
    // Listen for the ProductLiked event
    marketplace.events.ProductLiked({}, (error, event) => {
      if (error) {
        console.error(error);
      } else {
        const { id, likes } = event.returnValues;
        // Update the likes state for the corresponding product
        this.setState(prevState => ({
          likes: {
            ...prevState.likes,
            [id]: likes
          }
        }));
      }
    });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      console.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]
    const networkData_ = SocialNetwork.networks[networkId]

    if (networkData) {
      const marketplace = new web3.eth.Contract(Marketplace.abi, networkData.address)
      this.setState({ marketplace })
      const productCount = await marketplace.methods.productCount().call()
      this.setState({ productCount })
      // Load Products
      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({ loading: false })
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }

    if (networkData_) {
      const socialNetwork = new web3.eth.Contract(SocialNetwork.abi, networkData_.address)
      this.setState({ socialNetwork })
      const postCount = await socialNetwork.methods.postCount().call()
      this.setState({ postCount })
      // Load Posts
      for (var j = 1; j <= postCount; j++) {
        const post = await socialNetwork.methods.posts(j).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }
      // Sort posts. Show highest tipped posts first
      this.setState({ loading: false })
    } else {
      window.alert('SocialNetwork contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      balance: '',
      socialNetwork: null,
      postCount: 0,
      productCount: 0,
      posts: [],
      products: [],
      loading: true,

      selectedProduct: '',
      likes: [],
    }

    this.createProduct = this.createProduct.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)
    this.createPost = this.createPost.bind(this)
    this.loadBalance = this.loadBalance.bind(this);

  }

  selectProduct = (event) => {
    this.setState({ selectedProduct: event.target.value });
  }

  handleLike = async () => {
    const productId = parseInt(this.state.selectedProduct);
    const price = window.web3.utils.toWei('0.01', 'Ether');
    await this.state.marketplace.methods.likeProduct(productId).send({ from: this.state.account, value: price });
    const likes = [...this.state.likes];
    likes[productId] = likes[productId] ? likes[productId] + 1 : 1;
    this.setState({ likes });
  }

  handleShowLikes = async () => {
    const likes = await Promise.all(
      this.state.products.map(async (product) => {
        const likesCount = await this.state.marketplace.methods.likes(product.id).call();
        return likesCount;
      })
    );
    this.setState({ likes });
  }

  createPost(content) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.createPost(content).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

  async loadBalance() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts()
    let weibalance = await window.web3.eth.getBalance(accounts[0])
    let ethbalance = await window.web3.utils.fromWei(weibalance)
    this.setState({ balance: ethbalance });
  }

  createProduct(name, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.createProduct(name, price).send({ from: this.state.account }).once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  purchaseProduct(id, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.purchaseProduct(id).send({ from: this.state.account, value: price }).once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  //   likeProduct = async (productId) => {
  //     // Get the contract instance
  //     const marketplace = this.state.marketplace;
  //     // Call the likeProduct function on the contract
  //     await marketplace.methods.likeProduct(productId).send({from: this.state.account});
  //     // Update the state to trigger a re-render
  //     this.setState({showLikeButton: true});
  // }

  render() {

    return (
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <Navbar account={this.state.account}
            currentAccount={this.state.accountName} />
          <div className='container-fluid mt-5'>
            <div className='row'>
              <br></br>
              <br></br>
              <main role='main' className='col-lg-12 d-flex'>
                {this.state.loading
                  ? <div id='loader' className='text-center'><p className='text-center'>Loading...</p></div>
                  : <Main
                    products={this.state.products}
                    createProduct={this.createProduct}
                    purchaseProduct={this.purchaseProduct}
                    posts={this.state.posts}
                    createPost={this.createPost}
                    loadBalance={this.loadBalance}
                    balance={this.state.balance}
                  />
                }
              </main>

              <div className="App">
                <h2 className="mb-4">Which Product Do You Like The Most?</h2>

                <div className="justify-content align-items-center mb-4">
                  <p className="m-0"><b>Current User:</b> {this.state.account}</p>
                  <button className="btn btn-info" onClick={this.handleShowLikes}><img src={require('C:/Users/njain12/MarketPlace_DAPP/src/icons8-sharingan-100.png')} width="28px" height="28px" />{"  "} Show Likes</button>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <select className="form-select select-product" onChange={this.selectProduct}>
                      <option value="">Select a product</option>
                      {this.state.products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 d-flex justify-content-end">
                    <button className="btn btn-success" onClick={this.handleLike}><img src={require("C:/Users/njain12/MarketPlace_DAPP/src/icons8-heart-50.png")} width="23px" height="23px" alt="Like" />{" "} Like</button>
                  </div>
                </div>

                <hr />

                <h2>Show Likes</h2>
                <div className="scrollable">
                  <ul className="list-group">
                    {this.state.products.map((product) => (
                      <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {product.name}
                        <span className="badge bg-dark rounded-pill text-white">{this.state.likes[product.id] || 0}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
