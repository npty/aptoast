//SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;

import {IAxelarGateway} from "./IAxelarGateway.sol";
import {IAxelarGasService} from "./IAxelarGasService.sol";
import {IAxelarExecutable} from "./IAxelarExecutable.sol";

contract HelloWorld is IAxelarExecutable {
    string public value;
    string public sourceChain;
    string public sourceAddress;
    IAxelarGasService gasReceiver;

    constructor(address _gateway, address _gasReceiver)
        IAxelarExecutable(_gateway)
    {
        gasReceiver = IAxelarGasService(_gasReceiver);
    }

    event Executed();

    // Call this function to update the value of this contract along with all its siblings'.
    function setRemoteValue(
        string memory destinationChain,
        string memory destinationAddress,
        string calldata value_
    ) external payable {
        bytes memory payload = abi.encode(value_);
        if (msg.value > 0) {
            gasReceiver.payNativeGasForContractCall{value: msg.value}(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                msg.sender
            );
        }
        gateway.callContract(destinationChain, destinationAddress, payload);
    }

    // Handles calls created by setAndSend. Updates this contract's value
    function _execute(
        string memory sourceChain_,
        string memory sourceAddress_,
        bytes calldata payload_
    ) internal override {
        (value) = abi.decode(payload_, (string));
        sourceChain = sourceChain_;
        sourceAddress = sourceAddress_;

        emit Executed();
    }
}
