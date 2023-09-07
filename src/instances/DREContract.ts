import { ContractValidity } from "../types/contract";
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
}
