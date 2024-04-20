import {
  ChatData,
  DatabaseObject,
  IDataRepository,
  MessageData,
} from "./IDataRepository";

export class LocalStorageRepository implements IDataRepository {
  private readonly key: string;
  private db: DatabaseObject;
  private latestChatID: number;
  private USER: string = 'defaultUsr';

  constructor(key: string) {
    this.key = key;
    this.createDB();
  }

  private nextID(): string {
    this.latestChatID++;
    return '' + this.latestChatID;
  }

  public async createDB(): Promise<void> {
    if (!localStorage.getItem(this.key)) {
      const initialDB: DatabaseObject = {
        users: [],
        chats: [],
      };
      localStorage.setItem(this.key, JSON.stringify(initialDB));
    }
  }

  private findChat(chatId: string): ChatData | undefined {
    return this.db.chats.find((chat) => chat.id === chatId);
  }

  private async fetchDB(): Promise<void> {
    const data = localStorage.getItem(this.key);
    this.db = data
      ? (JSON.parse(data) as DatabaseObject)
      : { users: [], chats: [] };
  }

  private async syncDB(): Promise<void> {
    localStorage.setItem(this.key, JSON.stringify(this.db));
  }

  public async getLastNMessages(N: number, chatId: string): Promise<MessageData[]> {
    const allMessages = await this.getAllMsgs(chatId);
    return allMessages.slice(-N);
  }

  getNMoreMessages(N: number, chatId: string): Promise<MessageData[]> {
    throw new Error("Method not implemented.");
  }

  public async getAllMsgs(chatId: string): Promise<MessageData[]> {
    const chat = await this.getChat(chatId);
    return chat ? chat.messages : [];
  }

  public async addMsg(chatId: string, content: string): Promise<void> {
    await this.fetchDB();
    const chat = this.findChat(chatId);
    if (chat) {
      const id: number = chat.messages.length === 0 ? 1 : +chat.messages[chat.messages.length-1].id + 1;
      const item: MessageData = {
        id: '' + id,
        sender: this.USER,
        time: new Date(),
        content: content
      }
      chat.messages.push(item);
      this.syncDB();
    } else {
      console.log("chat does not exists!");
    }
  }

  public async updateMsg(
    chatId: string,
    msgId: string,
    item: MessageData
  ): Promise<void> {
    await this.fetchDB();
    const chat = this.findChat(chatId);
    if (chat) {
      const index = chat.messages.findIndex((msg) => msg.id === msgId);
      if (index !== -1) {
        chat.messages[index] = item;
        this.syncDB();
      }
    }
  }

  public async deleteMsg(chatId: string, msgId: string): Promise<void> {
    await this.fetchDB();
    const chat = this.findChat(chatId);
    if (chat) {
        const idxToRemove = chat.messages.findIndex(msg => msg.id === msgId);
        chat.messages.splice(idxToRemove, 1);
        this.syncDB();
    }
  }

  public async getAllChats(): Promise<ChatData[]> {
    await this.fetchDB();
    return this.db.chats;
  }

  public async getChat(chatId: string): Promise<ChatData | undefined> {
    await this.fetchDB();
    return this.db.chats.find((chat) => chat.id === chatId);
  }

  public async addChat(participants: string[]): Promise<ChatData> {
    await this.fetchDB();
    const newChat = {id: this.nextID(), participants: participants, messages: []};
    this.db.chats.push(newChat);
    return newChat;
  }

  public async updateChat(chatId: string, item: ChatData): Promise<void> {
    await this.fetchDB();
    const idx = this.db.chats.findIndex(chat => chat.id === chatId);
    this.db.chats[idx] = item;
  }

  public async deleteChat(chatId: string): Promise<void> {
    await this.fetchDB();
    const idx = this.db.chats.findIndex(chat => chat.id === chatId);
    this.db.chats.splice(idx, 1);
  }
}
