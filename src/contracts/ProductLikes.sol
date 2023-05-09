pragma solidity ^0.5.0;

contract ProductLikes {
    struct Product {
        uint256 id;
        string name;
        uint256 likes;
    }

    Product[] public products;

    mapping(uint256 => uint256) public productIndex;

    event ProductCreated(uint256 id, string name, uint256 likes);
    event ProductLiked(uint256 id, uint256 likes);

    function createProduct(string memory _name) public {
        uint256 id = products.length;
        products.push(Product(id, _name, 0));
        productIndex[id] = products.length - 1;

        emit ProductCreated(id, _name, 0);
    }

    function likeProduct(uint256 _id) public {
        require(productIndex[_id] != 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, "Product does not exist");

        Product storage product = products[productIndex[_id]];
        product.likes++;

        emit ProductLiked(_id, product.likes);
    }
}