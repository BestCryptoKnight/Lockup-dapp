export enum ConnectorNames {
  Injected = "injected",
  WalletConnect = "walletconnect",
  BSC = "bsc",
}

export type Login = (id: number) => void;

export interface Config {
  id: number;
  name: string;
  icon: any;
}
