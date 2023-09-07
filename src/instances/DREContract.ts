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
   * Get the validity of this contract, stored on
   * the DRE node
   * 
   * @param id Transaction ID of the interaction to check
   */
  public async getValidity(id: string) {
    // TODO
    const res = await this.#node.fetch<ContractValidity>("/validity");

    return res.validity;
  }
}
