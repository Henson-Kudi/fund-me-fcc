// SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol";
import "./PriceConverter.sol";

error FundMe__NotOwner();

/// @title A smart contract for crowd funding.
/// @author Henson Kudi Amah - FCC Course by Patrick
/// @notice This is a sample smart contract for crowd funding
/// @dev This smart contract implements pricefeeds as our library

contract FundMe {
    using PriceConverter for uint256;

    AggregatorV3Interface public s_priceFeed;

    mapping(address => uint256) public s_addressToAmountFunded;
    address[] public s_funders;

    // Could we make this constant?  /* hint: no! We should make it immutable! */
    address public immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10**18;

    // modifiers

    modifier onlyOwner() {
        // require(msg.sender == owner);
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    // constructors

    constructor(AggregatorV3Interface priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // receive and fallbacks
    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /// @notice This function funds the smart contract and update the funders list with the amount funded

    function fund() public payable {
        console.log("Received fund request, checking infos...");
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "You need to spend more ETH!"
        );
        console.log("Requirements validated.... Funding smart contract");
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    /// @notice This function gets the version of the AggregatorV3Interface

    function getVersion() public view returns (uint256) {
        AggregatorV3Interface priceFeedElement = AggregatorV3Interface(
            s_priceFeed
        );
        return priceFeedElement.version();
    }

    /// @notice This function lets the owner of the smart contract to withdraw the funds of the smart contract

    function withdraw() public payable onlyOwner {
        address[] memory funders = s_funders; // optimized for gas efficiency

        console.log("Withdrawal request received, confirming owner");

        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
        console.log("Owner confirmed... Funds withdrawn");
    }
    // Explainer from: https://solidity-by-example.org/fallback/
    // Ether is sent to contract
    //      is msg.data empty?
    //          /   \
    //         yes  no
    //         /     \
    //    receive()?  fallback()
    //     /   \
    //   yes   no
    //  /        \
    //receive()  fallback()
}
