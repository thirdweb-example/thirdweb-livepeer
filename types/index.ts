export type Chain = {
  name: string;
  rpc: string;
};

export type TokenInfo = {
  chain: string;
  tokenAddress: string;
  tokenAmount: string;
};

export type Requirement = {
  token: TokenInfo;
  userAddress: string;
};

export type GenerateJwtPayload = {
  requirement: Requirement;
  userAddress: string;
};
