import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Identicon from 'identicon.js';
import './App.css';
import { Dropdown } from "react-bootstrap";


class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showProducts: true,
            postContent: false,
            selectedProduct: null, // add this line
        }
    }

    toggleProducts = () => {
        this.setState({ showProducts: !this.state.showProducts });
    }

    toggleComments = () => {
        this.setState({ postContent: !this.state.postContent });
    }

    showComments = () => {
        this.setState(prevState => ({
            showComments: !prevState.showComments
        }));
    }

    showProducts = () => {
        this.setState({ showProducts: !this.state.showProducts });
    }

    getOwnerName = (ownerAddress) => {
        const buyerAddress = this.props.accounts[0];
        const sellerAddress = this.props.accounts[1];
        if (ownerAddress === buyerAddress) {
            return 'buyer';
        } else if (ownerAddress === sellerAddress) {
            return 'seller';
        } else {
            return ownerAddress;
        }
    }

    // handleProductSelect = (eventKey, event) => {
    //     event.preventDefault();
    //     const selectedProduct = this.props.products[eventKey].name;
    //     this.setState({ selectedProduct });
    // }

    render() {
        return (
            <div id='content'>
                <br></br>
                <br></br>

                <button
                    className="btn btn-success"
                    title="Ethereum"
                    onClick={this.props.loadBalance}>
                    <img src={require('C:/Users/njain12/MarketPlace_DAPP/src/wallet.png')} width="22px" height="22px" />
                    {this.state.showBalance ? ' Hide Balance' : ' Show Balance'}
                </button>
                <br></br>
                <br></br>
                <span className="label label-warning"><h4>{this.props.balance + " ETH"}</h4></span>
                <br></br>
                <h1>List Your Items</h1>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    const name = this.productName.value
                    const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
                    this.props.createProduct(name, price)
                }}>
                    <div className="form-group mr-sm-2">
                        <input
                            id="productName"
                            type="text"
                            ref={(input) => { this.productName = input }}
                            className="form-control"
                            placeholder="Product Name"
                            required />
                    </div>
                    <div className="form-group mr-sm-2">
                        <input
                            id="productPrice"
                            type="text"
                            ref={(input) => { this.productPrice = input }}
                            className="form-control"
                            placeholder="Product Price"
                            required />
                    </div>
                    <button type="submit" className="btn btn-warning"><img src={require('C:/Users/njain12/MarketPlace_DAPP/src/cart.png')} width="25px" height="25px" />{" "} Add Product
                    </button>
                </form>
                <br></br>
                <p> </p>
                <div className='container'>
                    <div className='left-div'>
                        <h2>Product Details</h2>
                        <div className="scrollable">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Item Number</th>
                                        <th scope="col">Product Name</th>
                                        <th scope="col">Product Price</th>
                                        <th scope="col">Owner Address</th>
                                    </tr>
                                </thead>
                                <tbody id="productList" style={{ display: this.state.showProducts ? 'table-row-group' : 'none' }}>
                                    {this.props.products.map((product, key) => {
                                        return (
                                            <tr key={key}>
                                                <th scope="row">{product.id.toString()}</th>
                                                <td>{product.name}</td>
                                                <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                                                <td><i>...{product.owner.substr(product.owner.length - 5)}</i></td>
                                                <td>
                                                    {!product.purchased ?
                                                        <button
                                                            type="button"
                                                            className="btn btn-warning"
                                                            name={product.id}
                                                            value={product.price}
                                                            onClick={(event) => {
                                                                this.props.purchaseProduct(event.target.name, event.target.value)
                                                            }}
                                                        >
                                                            Buy
                                                        </button>
                                                        : null
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <br></br>
                        <button onClick={this.showProducts} className="btn btn-warning">
                            {this.state.showProducts ? (
                                <>
                                    <img src={require("C:/Users/njain12/MarketPlace_DAPP/src/lurker.png")} width="25px" height="25px" /> Hide Products
                                </>
                            ) : (
                                <>
                                    <img src={require("C:/Users/njain12/MarketPlace_DAPP/src/delivery-box.png")} width="25px" height="25px" /> Show Products
                                </>
                            )}
                        </button>
                    </div>
                    <div className='middlespace'></div>
                    <div className='right-div'>
                        <h2>Product Reviews</h2>
                        <div className="row">
                            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
                                <div className="content mr-auto ml-auto">
                                    <p>&nbsp;</p>
                                    <form onSubmit={(event) => {
                                        event.preventDefault()
                                        const content = this.postContent.value
                                        this.props.createPost(content)
                                    }}>
                                        <div className="form-group mr-sm-2">
                                            <input
                                                id="postContent"
                                                type="text"
                                                ref={(input) => { this.postContent = input }}
                                                className="form-control"
                                                placeholder="What's your review?"
                                                required />
                                        </div>
                                        <button type="submit" className="btn btn-warning"><img src={require('C:/Users/njain12/MarketPlace_DAPP/src/send.png')} width="20px" height="20px" />{"  "} Share</button>
                                    </form>
                                    <br></br>
                                    <button onClick={this.toggleComments} className="btn btn-warning">
                                        {this.state.postContent ?
                                            <span>
                                                <img src={require("C:/Users/njain12/MarketPlace_DAPP/src/lurker.png")} width="25px" height="25px" alt="Hide Comments" />{" "}
                                                Hide Comments
                                            </span> :
                                            <span>
                                                <img src={require("C:/Users/njain12/MarketPlace_DAPP/src/comments.png")} width="25px" height="25px" alt="Show Comments" />{" "}
                                                Show Comments
                                            </span>
                                        }
                                    </button>
                                    <p>&nbsp;</p>
                                    <div style={{ display: this.state.postContent ? 'table-row-group' : 'none' }}>
                                        <div className='scrollable_'>
                                            {this.props.posts.map((post, key) => {
                                                return (
                                                    <div className="card mb-4" key={key} >
                                                        <div className="card-header">
                                                            <img
                                                                className='mr-2'
                                                                width='30'
                                                                height='30'
                                                                src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}
                                                            />
                                                            <small className="text-muted">{post.author}</small>
                                                        </div>
                                                        <ul id="postList" className="list-group list-group-flush">
                                                            <li className="list-group-item">
                                                                <p>{post.content}</p>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
                <br></br>
                {/* <h2>Which Product You Like The Most ?</h2>
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        {this.state.selectedProduct || 'Select a Product'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {this.props.products.map((product, key) => (
                            <Dropdown.Item key={key} eventKey={key} onSelect={this.handleProductSelect}>
                                {product.name}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown> */}
                <br></br>
            </div >
        );
    }
}

export default Main;
