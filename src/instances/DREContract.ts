import { ContractState, ContractValidity, StateConfig } from "../types/contract";
import { stringifyRecordValues } from "../utils";
import { NODES } from "../nodes";
import DRENode from "./DRENode";

export default class DREContract {
  #id: string;
  #node: DRENode;

  /**
   * @param id Contract transaction ID
   * @param node Optional DRE node instance
   * 
   * https://academy.warp.cc/docs/dre/overview
   */
  constructor(id: string, node?: DRENode) {
    this.#id = id;
    this.#node = node || new DRENode(NODES[0]);
  }

  /**
   * Get the DRE node working with this contract
   */
  public getNode() {
    return this.#node;
  }

  /**
   * Fetch thhe contract state
   * 
   * @param config Custom config for the state request
   */
  public async getState<T = unknown>(config: StateConfig = {}) {
    const params = new URLSearchParams({
      id: this.#id,
      // @ts-expect-error
      ...stringifyRecordValues(config)
    });
    const res = await this.#node.fetch<ContractState<T>>(
      "/contract?" + params.toString()
    );

    return await res.json();
  }

  /**
   * Query the state of the contract
   * 
   * @param query [jsonpath-plus](https://npmjs.comjsonpath-plus) query
   */
  public async query<T = unknown[]>(query: string) {
    const params = new URLSearchParams({
      id: this.#id,
      query
    });
    const res = await this.#node.fetch<{
      result: T
    }>("/contract?" + params.toString());
    const data = await res.json();

    return data.result;
  }

  /**
   * Get the validity of this contract, stored on
   * the DRE node
   * 
   * @param id Transaction ID of the interaction to check
   */
  public async getValidity(id: string) {
    const params = new URLSearchParams({
      id,
      contractId: this.#id
    });
    const res = await this.#node.fetch<ContractValidity>("/validity?" + params.toString());
    const data = await res.json();

    return data.validity;
  }

  /** 
   * Schedule force synchronization of this contract
   * on the DRE node
   * 
   * Note: This can't be called more frequent then every 10 seconds
   */
  public async sync() {
    const params = new URLSearchParams({
      id: this.#id
    });

    await this.#node.fetch("/sync?" + params.toString());
  }

  /**
   * Check if the contract state is accessible and
   * not blacklisted from the current DRE node.
   */
  public async healthCheck() {
    try {
      // try to get the state
      const res = await this.getState();

      return res.status === "evaluated";
    } catch {
      return false;
    }
  }

  /**
   * Find a new node for the 
   * 
   * @param nodelist List of nodes to search in
   * @param exclude Nodes to exclude from the search
   */
  public async findNode(nodelist: string[] = NODES, exclude: string[] = []) {
    // exclude the current node
    exclude.push(this.#node.getURL());

    for (let i = 0; i < nodelist.length; i++) {
      try {
        // init node
        const newNode = new DRENode(nodelist[i]);

        // fetch state
        const state = await (
          await newNode.fetch<{
            status: "blacklisted" | "evaluated"
          }>(`/contract?id=${this.#id}`)
        ).json();

        // don't accept blacklisting nodes
        if (state.status === "blacklisted") continue;

        // update node
        this.#node = newNode;
        break;
      } catch {}
    }

    return this.#node.getURL();
  }
}
