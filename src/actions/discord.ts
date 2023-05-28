import { WebhookClient, WebhookMessageCreateOptions } from "discord.js";
import { Client } from "./emitter";

export class DiscordWebhookClient extends Client {
  _webhookClient: WebhookClient | null;
  clientId: string = "discord";
  constructor() {
    super();
    this._webhookClient = null;
  }

  init(url: string) {
    if (!this._webhookClient) {
      this._webhookClient = new WebhookClient({ url });
    }
  }

  getWebhookClient() {
    return this._webhookClient;
  }
  async sendMessage(message: WebhookMessageCreateOptions) {
    if (!this._webhookClient) {
      throw new Error("Webhook client not initialized");
    }
    await this._webhookClient.send(message);
  }
}

export const discordClient = new DiscordWebhookClient();
