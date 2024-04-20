import { Injectable } from '@nestjs/common';
import { LocalStorageRepository } from '../database/LocalStorageRepository';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatData } from '../database/IDataRepository';
import { ConnectUserDto } from './dto/connect-user.dto';

interface UserConnection {
  userId: string,
  userName: string
}

@Injectable()
export class ChatService {
  private userConnections: UserConnection[];

  public connectUser(connectUserDto: ConnectUserDto): void {
    this.userConnections
  }
}
