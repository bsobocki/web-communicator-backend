export interface MessageData {
  id: string;
  sender: string;
  time: Date;
  content: string;
}

export interface ChatData {
  id: string;
  title: string;
  participants: string[];
  messages: MessageData[];
}

export interface UserData {
  id: string;
  name: string;
}