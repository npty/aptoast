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

const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");
const coinTypeAddress =
  "0xfb4a696ff785a56b76a80872898829da8d8b17755b17d161f35733a45182ef10";
const Gateway: NextPage = () => {
  useEffect(() => {
    // client.getEventsByCreationNumber(coinTypeAddress, 15).then((events) => {
    //   console.log(events);
    // });
    client
      .getEventsByEventHandle(
        coinTypeAddress,
        `${coinTypeAddress}::axelar_gateway::GatewayEventStore`,
        "contract_call_events"
      )
      .then((ev) => console.log(ev));
  return <div></div>;
};
  }, []);

export default Gateway;
