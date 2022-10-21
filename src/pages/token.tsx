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

const Token: NextPage = () => {
  return <div>Hello</div>;
};

export default Token;
