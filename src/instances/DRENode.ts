import { NodeStatus } from "../types/node";

export default class DRENode {
  #url: string;

  /**
   * @param url URL of the node
   * 
   * https://academy.warp.cc/docs/dre/overview
   */
  constructor(url: string) {
    this.#url = url;
  }

  /**
   * Fetch something from the DRE node
   * 
   * @param path Path of the request
   * @param config Fetch config
   */
  public async fetch<T = unknown>(path: string, config?: RequestInit) {
    return await fetch(new URL(path, this.#url).href, config) as T;
  }

  public async getStatus() {
    return await this.fetch<NodeStatus>("/status");
  }
}
