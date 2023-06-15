import { WebhookMessageCreateOptions } from "discord.js";

export abstract class Client {
  abstract sendMessage(message: WebhookMessageCreateOptions): Promise<void>;
  abstract clientId: string; // This should be a unique id to identify the client
}

export class Emitter {
  private _clients: Map<string, Client>; // Use a Map instead of an array to easily check for duplicates

  constructor() {
    this._clients = new Map();
  }

  addClient(client: Client) {
    if (this._clients.has(client.clientId)) {
      return;
    }
    this._clients.set(client.clientId, client);
  }

  async emit(message: WebhookMessageCreateOptions) {
    const messagePromises = Array.from(this._clients.values()).map((client) =>
      client.sendMessage(message)
    );
    await Promise.all(messagePromises);
  }
}

export const emitter = new Emitter();
