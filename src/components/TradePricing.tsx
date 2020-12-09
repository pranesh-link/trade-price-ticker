import * as React from "react";
import { useState, useRef, useEffect } from "react";
import PriceTable from "./PriceTable";
import { CURRENCY_PAIRS } from "./Constants";
import { FlexBox } from "./Elements";
import NavBar from "./NavBar";
import classNames from "classnames";
import styled from "styled-components";
import { IFeedResponse } from "./types";

export const TradePricing = () => {
  const [feedResponses, setFeedResponses] = useState<IFeedResponse[]>([]);
  const [currentPair, setCurrentPair] = useState("btcusd");

  const socket = useRef(new WebSocket("wss://ws.sfox.com/ws"));
  const currencyPairs = CURRENCY_PAIRS.map((pair) => pair.pair);
  const dataFeeds = CURRENCY_PAIRS.map((pair) => pair.feed);

  useEffect(() => {
    socket.current.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.payload) {
        setFeedResponses([data, ...feedResponses]);
      }
    };
    socket.current.onopen = () => {
      socket.current.send(
        JSON.stringify({ type: "subscribe", feeds: dataFeeds })
      );
    };
  });

  useEffect(() => () => socket.current.close(), [socket]);

  const onPairChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const pair = e.currentTarget.getAttribute("data-pair") || "";
    setCurrentPair(pair);
  };

  const pairFeedResponses = feedResponses.filter(
    (response) => response.payload.pair === currentPair
  );

  return (
    <TickerWrap>
      <NavBar title={"Trade Prices"} />
      <FlexBox justifyContent="space-between">
        <>
          {currencyPairs.map((pair) => (
            <button
              key={pair}
              data-pair={pair}
              onClick={onPairChange}
              className={classNames("pair", {
                "active-pair": currentPair === pair,
              })}
            >
              {pair.toUpperCase()}
            </button>
          ))}
        </>
      </FlexBox>
      <PriceTable
        feedResponses={pairFeedResponses}
        currencyPair={currentPair}
      />
    </TickerWrap>
  );
};

const TickerWrap = styled.div`
  .navbar {
    margin: 35px 0;
    .navbar-brand {
      font-size: 25px;
      font-weight: bold;
    }
  }
  button {
    &.pair {
      letter-spacing: 0.5px;
      padding: 10px 20px;
      border-radius: 50px;
      background-color: transparent;
      border: 1px solid #ccc;
      cursor: pointer;
      outline: none;
      margin-left: 10px;
      margin-bottom: 25px;
      margin: 0 10px 25px 10px;
      &:hover {
        &:not(.active-pair) {
          background-color: #0c77b9;
          color: white;
          border-color: transparent;
        }
      }
      &.active-pair {
        background-color: green;
        border-color: transparent;
        color: white;
        font-weight: bold;
      }
    }
  }
`;
