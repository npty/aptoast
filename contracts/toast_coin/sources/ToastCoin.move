module ToastCoin::toast_coin {
  struct ToastCoin {}

  fun init_module(sender: &signer) {
    aptos_framework::managed_coin::initialize<ToastCoin>(
      sender,
      b"ToastCoin",
      b"TOAST",
      6,
      false,
    )

    aptos_framework::managed_coin::mint<ToastCoin>(
      sender,
      1000000000,
    )
  }
}
