import * as React from "react";
import { IFeedResponse, IMarketTickRecord } from "./types";
import ReactTable from "react-table";
import "react-table/react-table.css";
import classNames from "classnames";
import styled from "styled-components";
import { FlexBox } from "./Elements";
import { CURRENCY_PAIRS } from "./Constants";

interface IPriceTableProps {
  feedResponses: IFeedResponse[];
  currencyPair: string;
}

const PriceTable = (props: IPriceTableProps) => {
  const { feedResponses, currencyPair } = props;
  const currencyPairData = CURRENCY_PAIRS.find(
    (pair) => pair.pair === currencyPair
  );
  const isHigh = (dataKey: keyof IMarketTickRecord, index: number) => {
    const { payload: currentFeedPayload } = feedResponses[index];
    const currentFeedData = currentFeedPayload[dataKey];
    let prevFeedData = currentFeedData;
    if (index < feedResponses.length - 1) {
      prevFeedData = feedResponses?.[index + 1]?.payload?.[dataKey];
    }
    if (
      typeof currentFeedData === "number" &&
      typeof prevFeedData === "number"
    ) {
      const isDataHigh =
        index < feedResponses.length - 1
          ? currentFeedData - prevFeedData > 0
          : true;
      return isDataHigh;
    }

    return true;
  };
  const getRows = () => {
    return feedResponses.map((response, index) => {
      const { payload } = response;
      const isVolumeHigh = isHigh("volume", index);
      const isAmountHigh = isHigh("amount", index);
      const isPricingHigh = isHigh("vwap", index);
      return {
        pair: payload.pair,
        amount: (
          <FlexBox
            className={classNames({
              high: isAmountHigh,
              low: !isAmountHigh,
              "latest-feed": index === 0,
            })}
          >
            {isAmountHigh ? (
              <span className="arrow">&#8593;</span>
            ) : (
              <span className="arrow">&#8595;</span>
            )}
            <span>{payload.amount}</span>
          </FlexBox>
        ),
        baseCurrency: currencyPairData?.baseCurrency,
        exchange: payload.exchange.toUpperCase(),
        last: payload.last,
        high: payload.high,
        low: payload.low,
        open: payload.open,
        route: payload.route,
        source: payload.source.toUpperCase(),
        timestamp: payload.timestamp,
        volume: (
          <FlexBox
            className={classNames({
              high: isVolumeHigh,
              low: !isVolumeHigh,
              "latest-feed": index === 0,
            })}
          >
            {isVolumeHigh ? (
              <span className="arrow">&#8593;</span>
            ) : (
              <span className="arrow">&#8595;</span>
            )}
            <span> {payload.volume}</span>
          </FlexBox>
        ),
        vwap: (
          <FlexBox
            className={classNames({
              high: isPricingHigh,
              low: !isPricingHigh,
              "latest-feed": index === 0,
            })}
          >
            {isPricingHigh ? (
              <span className="arrow">&#8593;</span>
            ) : (
              <span className="arrow">&#8595;</span>
            )}
            <div>{`${currencyPairData?.quoteCurrency} ${parseFloat(
              payload.vwap.toString()
            ).toFixed(10)}`}</div>
          </FlexBox>
        ),
      };
    });
  };
  return (
    <TABLE
      data={getRows()}
      columns={COLUMNS}
      defaultPageSize={25}
      className="-striped -highlight"
      NoDataComponent={NoData}
    />
  );
};

export default PriceTable;

const NoData = () => <NoDataText>Fetching data....</NoDataText>;

const NoDataText = styled.div`
  position: absolute;
  left: 45%;
  top: 40%;
`;

const COLUMNS = [
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Base currency",
    accessor: "baseCurrency",
    maxWidth: 150,
  },
  {
    Header: "Exchange",
    accessor: "exchange",
  },
  {
    Header: "Volume",
    accessor: "volume",
  },
  {
    Header: "Price",
    accessor: "vwap",
  },
];

const TABLE = styled(ReactTable)`
  .rt-resizable-header-content {
    font-weight: bold;
  }
  ${FlexBox} {
    span {
      flex-basis: 30%;
    }
  }
  .high {
    color: green;
  }
  .low {
    color: red;
  }
  .arrow {
    margin-right: 10px;
    flex-basis: 15%;
  }
  @keyframes blinker {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  .latest-feed {
    text-decoration: blink;
    animation-name: blinker;
    -webkit-animation-name: blinker;
    -webkit-animation-duration: 0.8s;
    animation-duration: 0.8s;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
    -webkit-animation-direction: alternate;
    animation-direction: alternate;
  }
`;
