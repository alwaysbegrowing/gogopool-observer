import { ethers } from "ethers";

class JsonRpcProvider {
  provider: ethers.providers.JsonRpcProvider | null;
  constructor() {
    this.provider = null;
  }

  init(url: string) {
    if (!this.provider) {
      this.provider = new ethers.providers.JsonRpcProvider(url);
    }
  }

  getProvider() {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }
    return this.provider;
  }
}

export const jsonRpcProvider = new JsonRpcProvider();
