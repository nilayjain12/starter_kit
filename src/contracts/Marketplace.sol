pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;
    mapping(address => string) public userNames;
    mapping(uint => uint) public likes;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductLiked(uint id, uint likes);

    constructor() public {
        name = "Titans Marketplace";
    }

    function createProduct(string memory _name, uint _price) public {
        // Require a name
        require(bytes(_name).length > 0);
        // Require a valid price
        require(_price > 0);
        // Increment product count
        productCount++;
        // Create a product
        products[productCount] = Product(
            productCount,
            _name,
            _price,
            msg.sender,
            false
        );
        //User Info
        userNames[msg.sender] = "seller";
        // Trigger an event
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable {
        // Fetch the product
        Product memory _product = products[_id];
        // Fetch the owner
        address payable _seller = _product.owner;
        // Make sure the product has valid id
        require(_product.id > 0 && _product.id <= productCount);
        // Require that there is enough Ether in the transaction
        require(msg.value >= _product.price);
        // Required that the product has not been purchased already
        require(!_product.purchased);
        // Require that the buyer is not the seller
        require(_seller != msg.sender);
        // Transfer ownership to buyer
        _product.owner = msg.sender;
        // Mark as purchased
        _product.purchased = true;
        // Update the product
        products[_id] = _product;
        // Pay the seller by sending them ether
        address(_seller).transfer(msg.value);
        // Trigger an event
        emit ProductPurchased(
            productCount,
            _product.name,
            _product.price,
            msg.sender,
            true
        );
    }

    function likeProduct(uint _id) public payable {
        // Fetch the product
        Product memory _product = products[_id];
        // Make sure the product has valid id
        require(_product.id > 0 && _product.id <= productCount);
        // Require some ether to be sent with the transaction
        require(msg.value > 0);
        // Increment the number of likes
        likes[_id]++;
        // Trigger an event
        emit ProductLiked(_id, likes[_id]);
    }
}
