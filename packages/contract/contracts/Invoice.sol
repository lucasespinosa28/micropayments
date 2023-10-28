// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Invoice {
    mapping(address => string[]) public History;
    mapping(string => Payment[]) public Payments;
    mapping(string => Invoices) public mapInvoices;

    struct Payment {
        address receiver;
        uint256 amount;
    }

    struct Invoices {
        address token;
        uint256 timestamp;
        address receiver;
        string payments;
    }

    function create(
        bool onChain,
        string memory id,
        address token,
        address receiver,
        address payment,
        address[] memory receivers,
        uint256[] memory amounts
    ) public {
        for (uint256 i = 0; i < receivers.length; i++) {
            IERC20(token).transferFrom(payment, receivers[i], amounts[i]);
            if (onChain) {
                Payment memory newPayment = Payment(receivers[i], amounts[i]);
                Payments[id].push(newPayment);
                History[receivers[i]].push(id);
            }
        }
        if (onChain) {
            History[receiver].push(id);
            History[payment].push(id);
            Invoices memory newInvoice = Invoices(
                token,
                block.timestamp,
                receiver,
                id
            );
            mapInvoices[id] = newInvoice;
        }
    }

    function getInvoice(
        string memory id
    ) public view returns (Invoices memory) {
        return mapInvoices[id];
    }

    function getHistory(address id) public view returns (string[] memory) {
        return History[id];
    }

    function getPayments(
        string memory id
    ) public view returns (Payment[] memory) {
        return Payments[id];
    }
}
