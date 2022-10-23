module axelar::axelar_gateway {
  use std::string;
  use std::signer;
  use aptos_framework::account;
  use aptos_std::aptos_hash::keccak256;
  use aptos_framework::event;

  struct GatewayEventStore has key {
    contract_call_events: event::EventHandle<ContractCallEvent>,
  }

  struct ContractCallEvent has store, drop {
    sender: address,
    destinationChain: string::String,
    destinationContractAddress: string::String,
    payloadHash: vector<u8>,
    payload: vector<u8>,
  }

  fun init_module(account: &signer) {
    move_to<GatewayEventStore>(account, GatewayEventStore {
      contract_call_events: account::new_event_handle<ContractCallEvent>(account),
    });
  }

  public entry fun call_contract(sender: &signer, destinationChain: string::String, contractAddress: string::String, payload: vector<u8>) acquires GatewayEventStore {
    let gateway_call = borrow_global_mut<GatewayEventStore>(@axelar);

    let source_address = signer::address_of(sender);
    event::emit_event<ContractCallEvent>(&mut gateway_call.contract_call_events, ContractCallEvent {
      sender: source_address,
      destinationChain: destinationChain,
      destinationContractAddress: contractAddress,
      payloadHash: keccak256(payload),
      payload: payload,
    });
  }

  public entry fun hello() {

  }
}
