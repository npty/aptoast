import type { NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { Types, AptosClient } from "aptos";
import React from "react";

declare global {
  interface Window {
    aptos: any;
  }
}

const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");
/** Convert string to hex-encoded utf-8 bytes. */
function stringToHex(text: string) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(text);
  const text2 = Array.from(encoded, (i) =>
    i.toString(16).padStart(2, "0")
  ).join("");
  return text2;
}

function hexToAscii(hex: string) {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

const Home: NextPage = () => {
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [modules, setModules] = useState<Types.MoveModuleBytecode[]>([]);
  const [resources, setResources] = useState<Types.MoveResource[]>([]);
  const [account, setAccount] = useState<Types.AccountData | null>(null);
  const ref = React.createRef<HTMLTextAreaElement>();

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
    client.getAccountModules(address).then(setModules);
  }, [address]);

  useEffect(() => {
    if (!address) return;
    client.getAccountResources(address).then(setResources);
  }, [address]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!ref.current) return;
    const message = ref.current.value;
    const transaction = {
      type: "entry_function_payload",
      function: `${address}::message::set_message`,
      arguments: [stringToHex(message)],
      type_arguments: [],
    };

    try {
      setIsSaving(true);
      const res = await window.aptos.signAndSubmitTransaction(transaction);
      console.log(res);
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    if (!address) return;
    client
      .getEventsByEventHandle(
        address,
        // "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
        `${address}::message::MessageHolder`,
        "message_change_events"
      )
      .then((v) => {
        console.log("MessageEvent", v);
      });
  }, [address]);

  useEffect(() => {
    const resourceType = `${address}::message::MessageHolder`;
    const resource = resources.find((r) => r.type === resourceType);
    const data = resource?.data as { message: string } | undefined;
    const message = hexToAscii(data?.message || "");
    if (message) setMessage(message);
  }, [address, resources]);

  return (
    <div className={styles.container}>
      <p>{address}</p>
      <p>{account?.sequence_number}</p>
      {/* <p>Functions:</p>
      <p>{modules?.[0].abi?.exposed_functions[0].name}</p>
      <p>{modules?.[0].abi?.exposed_functions[1].name}</p> */}

      <form onSubmit={handleSubmit}>
        <textarea ref={ref} defaultValue={message} />
        <input disabled={isSaving} type="submit" />
      </form>
    </div>
  );
};

export default Home;
