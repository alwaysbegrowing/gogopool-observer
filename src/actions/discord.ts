import { isDev } from "./constants";
import axios from "axios";
import { WebhookClient, WebhookMessageCreateOptions } from "discord.js";

class DiscordWebhookClient {
  _webhookClient: WebhookClient | null;
  constructor() {
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

export const sendWebhook = async (webhookUrl: string, messageToSend: any) => {
  isDev
    ? console.log(messageToSend)
    : await axios.post(webhookUrl, messageToSend);
};
