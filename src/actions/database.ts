import { MongoClient } from "mongodb";
import { WebhookMessageCreateOptions } from "discord.js";
import { Client } from "./emitter";

export class DatabaseClient extends Client {
  _databaseClient: MongoClient | null;
  _databaseUrl: string | null;
  _databaseName: string | null;
  _collectionName: string | null;
  clientId: string = "database";
  constructor() {
    super();
    this._databaseClient = null;
    this._databaseUrl = null;
    this._databaseName = null;
    this._collectionName = null;
  }

  async init(url: string, databaseName: string, collectionName: string) {
    this._databaseUrl = url;
    this._databaseName = databaseName;
    this._collectionName = collectionName;
    this._databaseClient = new MongoClient(url);
    this._databaseClient.connect();
  }

  async sendMessage(message: WebhookMessageCreateOptions) {
    if (!this._databaseClient) {
      throw new Error("Database client not initialized");
    }
    if (!this._databaseName || !this._collectionName) {
      throw new Error("Database name or collection name not initialized");
    }
    const collection = this._databaseClient
      .db(this._databaseName)
      .collection(this._collectionName);
    await collection.insertOne({ message, timestamp: Date.now() });
  }
}

export const databaseClient = new DatabaseClient();
