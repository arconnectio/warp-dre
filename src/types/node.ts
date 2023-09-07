/** Status of a DRE node */
export interface NodeStatus {
  // TODO
}

/** List of all cached contracts on a DRE node */
export interface CachedContracts {

}

/** List of all errors from all contracts on a DRE node */
export interface NodeErrors {

}

export interface TypesResponse<T = unknown> extends Response {
  json(): Promise<T>;
}
