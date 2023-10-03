/** Status of a DRE node */
export interface NodeStatus {
  manifest: Manifest;
  workersConfig: WorkersConfig;
  queues_totals: {
    update: UpdateOrRegister;
    register: UpdateOrRegister;
  };
  queues_details: {
    update: Queue;
    register: Queue;
  };
}

export interface Queue {
  active: string[];
  waiting: string[];
}

export interface Manifest {
  gitCommitHash: string;
  warpSdkConfig: WarpSdkConfig;
  evaluationOptions: EvaluationOptions;
  owner: string;
  walletAddress: string;
}

export interface WarpSdkConfig {
  [mod: string]: string;
}

export interface EvaluationOptions {
  maxCallDepth: number;
  maxInteractionEvaluationTimeSeconds: number;
  allowBigInt: boolean;
  unsafeClient: string;
  internalWrites: boolean;
}

export interface WorkersConfig {
  register: number;
  update: number;
  jobIdRefreshSeconds: number;
  maxFailures: number;
  maxStateSizeB: number;
}

export interface UpdateOrRegister {
  active: number;
  waiting: number;
}

/** List of all cached contracts on a DRE node */
export interface CachedContracts {
  cachedContracts: number;
  ids: string[];
}

/** List of all errors from all contracts on a DRE node */
export type NodeErrors = NodeError[];

export interface NodeError {
  contract_tx_id: string;
  evaluation_options: string;
  sdk_config: string;
  job_id: string,
  failure: string;
  timestamp: string;
}

export interface TypesResponse<T = unknown> extends Response {
  json(): Promise<T>;
}

export type NodeBlacklist = BlacklistedContract[];

export interface BlacklistedContract {
  contract_tx_id: string;
  failures: number;
}
