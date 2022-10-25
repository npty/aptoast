module nptytn::call_contract_tester {
  use std::string;
  use aptos_std::aptos_hash::keccak256;
  use axelar_framework::axelar_gateway;
  use axelar_framework::axelar_gas_service;

  public entry fun call(sender: &signer, destination_chain: string::String, contract_address: string::String, payload: vector<u8>, fee_amount: u64) {
    axelar_gas_service::payNativeGasForContractCall(sender, destination_chain, contract_address, keccak256(payload), fee_amount, @nptytn);
    axelar_gateway::call_contract(sender, destination_chain, contract_address, payload);
  }
}
