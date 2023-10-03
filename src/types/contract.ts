import { Manifest } from "./node";

/** Validity of a contract */
export interface ContractValidity {
  validity: boolean;
}

export interface ContractState<T = unknown> {
  status: "evaluated" | "blacklisted";
  contractTxId?: string;
  state: T;
  sortKey: string;
  timestamp: string;
  signature: string;
  stateHash: string;
  manifest: Manifest;
}

export interface StateConfig {
  state?: boolean;
  validity?: boolean;
  errorMessages?: boolean;
  errors?: boolean;
  events?: boolean;
}
