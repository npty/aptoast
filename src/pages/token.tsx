import type { NextPage } from "next";
import { createRef, useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import { Types, AptosClient, HexString } from "aptos";
import React from "react";
import { CoinClient } from "../client";
import { NODE_URL } from "../config";

declare global {
  interface Window {
    aptos: any;
  }
}

const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");
const coinClient = new CoinClient();
const Token: NextPage = () => {
  const [address, setAddress] = useState("");
  const [account, setAccount] = useState<Types.AccountData | null>(null);
  const [balance, setBalance] = useState<string | number>(0);
  const recipientRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (window && window.aptos) {
      window.aptos.connect();
      window.aptos
        .account()
        .then((data: { address: string }) => setAddress(data.address));
    }
  }, []);

  useEffect(() => {
    if (!address) return;

    client
      .getAccount(address)
      .then((data: Types.AccountData) => {
        if (data.authentication_key === address) {
          console.log(data);
          setAccount(data);
        }
      })
      .catch((e) => console.log(e));
  }, [address]);

  useEffect(() => {
    if (!address) return;
    coinClient.getBalance(address, new HexString(address)).then((bal) => {
      setBalance(bal);
    });
  }, [address]);

  async function handleMint() {
    if (!account) return;
    const tx = {
      function: "0x1::managed_coin::mint",
      type_arguments: [`${coinClient.coinTypeAddress}::toast_coin::ToastCoin`],
      arguments: [new HexString(address).hex(), 1000000000],
    };

    const res = await window.aptos.signAndSubmitTransaction(tx);
    console.log(res);
  }

  async function handleRegister() {
    if (!account) return;

    const tx = {
      function: "0x1::managed_coin::register",
      type_arguments: [`${coinClient.coinTypeAddress}::toast_coin::ToastCoin`],
      arguments: [],
    };

    const res = await window.aptos.signAndSubmitTransaction(tx);
    console.log(res);
  }

  async function handleMintForBob() {
    if (!account) return;
    const tx = {
      function: "0x1::managed_coin::mint",
      type_arguments: [`${coinClient.coinTypeAddress}::toast_coin::ToastCoin`],
      arguments: [recipientRef.current?.value, 1000000],
    };

    const res = await window.aptos.signAndSubmitTransaction(tx);
    console.log(res);
  }

  return (
    <div>
      <div>Hello {address}</div>
      <div>Balance: {balance}</div>
      <button onClick={handleMint}>mint</button>
      <button onClick={handleRegister}>register</button>
      <input type="text" placeholder="bob address" ref={recipientRef} />
      <button onClick={handleMintForBob}>mint for bob</button>
    </div>
  );
};

export default Token;
