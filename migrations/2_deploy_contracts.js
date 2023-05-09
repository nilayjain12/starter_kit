const Marketplace = artifacts.require("Marketplace");

module.exports = function(deployer) {
  deployer.deploy(Marketplace);
};

const SocialNetwork = artifacts.require("SocialNetwork");

module.exports = function(deployer) {
  deployer.deploy(SocialNetwork);
}
  const ProductLikes = artifacts.require("ProductLikes");

  module.exports = function(deployer) {
    deployer.deploy(ProductLikes); 
};