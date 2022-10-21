module ToastCoin::toast_coin {
  struct ToastCoin {}

  fun init_module(sender: &signer) {
    aptos_framework::managed_coin::initialize<MoonCoin>(
      sender,
      b"ToastCoin",
      b"TOAST",
      6,
      false,
    )
  }
}
