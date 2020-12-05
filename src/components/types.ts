export interface IFeedResponse {
  sequence: number;
  recipient: string;
  timestamp: number;
  payload: IMarketTickRecord;
}

export interface IMarketTickRecord {
  amount: number;
  exchange: string;
  last: number;
  high: number;
  low: number;
  open: string;
  pair: string;
  route: string;
  source: string;
  timestamp: string;
  volume: number;
  vwap: number;
}
