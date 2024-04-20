export interface MessageData {
  id: string;
  sender: string;
  time: Date;
  content: string;
}

export interface ChatData {
  id: string;
  participants: string[];
  messages: MessageData[];
}

export interface UserData {
  id: string;
  name: string;
}

export interface DatabaseObject {
  users: UserData[];
  chats: ChatData[];
}

export interface IDataRepository {
  createDB(): Promise<void>;

  getLastNMessages(N: number, chatId: string): Promise<MessageData[]>;
  getNMoreMessages(N: number, chatId: string): Promise<MessageData[]>;
  getAllMsgs(chatId: string): Promise<MessageData[]>;
  addMsg(chatId: string, content: string): Promise<void>;
  updateMsg(chatId: string, msgId: string, item: MessageData): Promise<void>;
  deleteMsg(chatId: string, msgId: string): Promise<void>;

  getAllChats(): Promise<ChatData[]>;
  getChat(chatId: string): Promise<ChatData | undefined>;
  addChat(participants: string[]): Promise<ChatData>;
  updateChat(chatId: string, item: ChatData): Promise<void>;
  deleteChat(chatId: string): Promise<void>;
}
