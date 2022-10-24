module axelar::axelar_gas_service {
  use std::string;
  use std::signer;
  use aptos_framework::account;
  use aptos_std::aptos_hash::keccak256;
  use aptos_framework::event;
  use aptos_framework::aptos_coin::{AptosCoin}
  use aptos_framework::coin::{Coin};


  struct GasServiceEventStore {
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

  fun init_module(account: &signer) {
    move_to<GasServiceEventStore>(account, GasServiceAccountStore {
      nativeGasPaidForContractCallEvents: event::new_event_handle<NativeGasPaidForContractCallEvent>(account),
    })

    // register to aptos coin so it's able to receive a fee.
    coin::register<AptosCoin>(account);
  }

  fun payNativeGasForContractCall(sender: &signer, destinationChain: string::String, destinationAddress: string::String, payloadHash: vector<u8>, feeCoin: Coin<AptosCoin>, refundAddress: address) acquires GatewayCall {
    let event_store = borrow_global_mut<GasServiceEventStore>(@axelar);

    let source_address = signer::address_of(sender);

    // transfer the fee to the gas service account
    coin::withdraw(feeCoin, @axelar);

    event::emit_event(&mut event_store.nativeGasPaidForContractCallEvents, NativeGasPaidForContractCallEvent {
      sender: source_address,
      destinationChain: destinationChain,
      destinationAddress: destinationAddress,
      payloadHash: payloadHash,
      gasFeeAmount: coin::value(&feeCoin),
      refundAddress: refundAddress
    });
  }
}
