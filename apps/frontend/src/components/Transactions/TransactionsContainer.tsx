"use client";

import InfoCardContainer from "./InfoCardContainer";
import React from "react";
import TransactionRow from "./TransactionRow";
import { TransactionType } from "./TransactionRow";

// Header Component
function Header() {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex gap-[5px] items-center justify-start w-full">
        <div className="text-[#545454] text-6xl text-center font-bold uppercase">transactions</div>
        <div className="h-[50px] relative rounded-full w-[100px] border-[6px] border-[#FF2323] border-solid flex items-center justify-center">
          <span className="text-[#FF2323] text-4xl text-center font-extrabold uppercase leading-none">04</span>
        </div>
      </div>
      <div className="flex flex-col leading-none gap-1">
        <span className="text-text-secondary text-[16px] ">
          Below is a list of transactions waiting for your confirmation.
        </span>
        <span className="text-text-secondary text-[16px] ">
          Transactions are created by wallet addresses added as signers.
        </span>
      </div>
    </div>
  );
}

export default function TransactionsContainer() {
  return (
    <div className="flex flex-col gap-5 p-2">
      <div className="flex flex-row h-[100px] w-full justify-between">
        <div className="w-full relative">
          <img src="/misc/coin.svg" alt="clock" className="w-[150px]" />
          <div className="absolute -bottom-5 left-0 right-0 h-23 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        </div>
        <InfoCardContainer />
      </div>

      {/* header */}
      <Header />

      {/* body */}
      <div className="content-stretch flex flex-col gap-0.5 items-start justify-start relative size-full">
        <TransactionRow
          type={TransactionType.SEND}
          amount="$1,000,000,000 USDT"
          to="Tim Cook"
          showButtons={true}
          showChevron={true}
        />

        <TransactionRow
          type={TransactionType.SWAP}
          amount="$1,000,000,000 USDT"
          to="10 BTC"
          showButtons={true}
          showChevron={true}
        />

        <TransactionRow type={TransactionType.THRESHOLD} showButtons={true} showChevron={true} />

        <TransactionRow
          type={TransactionType.ADD_SIGNER}
          signers={["0xd...s78", "0xe...aK8"]}
          status="success"
          showButtons={false}
          showChevron={false}
          showExternalLink={true}
        />

        <TransactionRow
          type={TransactionType.BATCH}
          status="success"
          showButtons={false}
          showChevron={false}
          showExternalLink={true}
        />

        <TransactionRow
          type={TransactionType.REMOVE_SIGNER}
          signers={["0xB...bf8", "0xE...aS5"]}
          status="failed"
          showButtons={false}
          showChevron={false}
          showExternalLink={true}
        />
      </div>
    </div>
  );
}
