module axelar::axelar_gas_service {
  use std::string;
  use std::hash;
  use std::signer;
  use aptos_std::aptos_hash::keccak256;
  use aptos_framework::event;

  struct GasServiceHandler {
    nativeGasPaidForContractCallEvents: event::EventHandle<NativeGasPaidForContractCallEvent>,
  }

  struct NativeGasPaidForContractCallEvent has key {
    sourceAddress: address;
    destinationChain: string::String;
    destinationAddress: string::String;
    payloadHash: vector<u8>,
    gasFeeAmount: u128,
    refundAddress: address
  }

  fun payNativeGasForContractCall(sender: &signer, destinationChain: string::String, contractAddress: string::String, payload: vector<u8>) acquires GatewayCall {
    let source_address = signer::address_of(sender);
    let gateway_call = borrow_global_mut<GatewayCallHandler>(source_address);

    event::emit_event(&mut gateway_call.contract_call_events, ContractCallEvent {
      sender: source_address,
      destinationChain: destinationChain,
      destinationContractAddress: contractAddress,
      payloadHash: keccak256(payload),
      payload: payload,
    });
  }
}
