import { CachedContracts, NodeErrors, NodeStatus, TypesResponse, NodeBlacklist } from "../types/node";

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

  /** Get the URL of the active DRE node */
  public getURL() {
    return this.#url;
  }

  /**
   * Fetch something from the DRE node
   * 
   * @param path Path of the request
   * @param config Fetch config
   */
  public async fetch<T = unknown>(path: string, config?: RequestInit): Promise<TypesResponse<T>> {
    const res = await fetch(new URL(path, this.#url).href, config);

    // throw error
    if (res.status < 200 || res.status >= 300) {
      throw new Error(res.statusText);
    }

    return res;
  }

  /**
   * Get the current status of a DRE node
   */
  public async getStatus() {
    const res = await this.fetch<NodeStatus>("/status");

    return await res.json();
  }

  /**
   * Get the list of cached contracts by the DRE node
   */
  public async getCached() {
    const res = await this.fetch<CachedContracts>("/cached");

    return await res.json();
  }

  /**
   * Get all errors for all contracts cached in the DRE node
   */
  public async getErrors() {
    const res = await this.fetch<NodeErrors>("/errors");

    return await res.json();
  }

  /**
   * Get the list of blacklisted contracts on the DRE node
   */
  public async getBlacklist() {
    const res = await this.fetch<NodeBlacklist>("/blacklist");

    return await res.json();
  }
}
