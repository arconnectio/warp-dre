import { CachedContracts, NodeErrors, NodeStatus } from "../types/node";

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
  public async fetch<T = unknown>(path: string, config?: RequestInit) {
    return await fetch(new URL(path, this.#url).href, config) as T;
  }

  /**
   * Get the current status of a DRE node
   */
  public async getStatus() {
    return await this.fetch<NodeStatus>("/status");
  }

  /**
   * Get the list of cached contracts by the DRE node
   */
  public async getCached() {
    return await this.fetch<CachedContracts>("/cached");
  }

  /**
   * Get all errors for all contracts cached in the DRE node
   */
  public async getErrors() {
    return await this.fetch<NodeErrors>("/cached");
  }
}
