import { WebhookMessageCreateOptions } from "discord.js";

export abstract class Client {
  abstract sendMessage(message: WebhookMessageCreateOptions): Promise<void>;
}

export class Emitter {
  _clients: Client[];
  constructor() {
    this._clients = [];
  }
  addClient(client: Client) {
    this._clients.push(client);
  }
  async emit(message: WebhookMessageCreateOptions) {
    const messagePromises = this._clients.map((client) =>
      client.sendMessage(message)
    );
    await Promise.all(messagePromises);
  }
}

export const emitter = new Emitter();
