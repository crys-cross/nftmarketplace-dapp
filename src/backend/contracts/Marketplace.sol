// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error PriceMustNotBeZero();
error ItemDoesntExist();
error NotEnoughETHforItemPriceAndFee();
error ItemAlreadySold();

contract Marketplace is ReentrancyGuard {
    // State Variables
    address payable public immutable feeAccount;
    uint256 public immutable feePercent;
    uint256 public itemCount;
    struct Item {
        uint256 itemId;
        IERC721 nft;
        uint256 tokenId;
        uint256 price;
        address payable seller;
        bool sold;
    }

    event Offered(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller
    );

    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    //ItemId(key) -> Item(return value)
    mapping(uint256 => Item) public items;

    constructor(uint256 _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function makeItem(
        IERC721 _nft,
        uint256 _tokenId,
        uint256 _price
    ) external nonReentrant {
        if (_price < 1) {
            revert PriceMustNotBeZero();
        }
        // increment itemCount
        itemCount++;
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        //add new item to items mapping
        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
        // emit Offered event
        emit Offered(itemCount, address(_nft), _tokenId, _price, msg.sender);
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        // checks here
        if (_itemId < 0 && _itemId > itemCount) {
            revert ItemDoesntExist();
        }
        if (msg.value < _totalPrice) {
            revert NotEnoughETHforItemPriceAndFee();
        }
        if (item.sold) {
            revert ItemAlreadySold();
        }
        // pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        // update item to sold
        item.sold = true;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        // emit Bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }

    function getTotalPrice(uint _itemId) public view returns (uint) {
        return ((items[_itemId].price * (100 + feePercent)) / 100);
    }
}
