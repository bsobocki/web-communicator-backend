import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ChatData } from 'src/database/IDataRepository';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ConnectUserDto } from './dto/connect-user.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // @Get()
  // async getAllChats(): Promise<ChatData[]> {
  //   return this.chatService.getAllChats();
  // }

  // @Get(':id')
  // async getChatById(@Param('id') id: string): Promise<ChatData> {
  //   return this.chatService.getChat(id);
  // }

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  public connectUser(@Body() connectUserDto: ConnectUserDto): void {
    this.chatService.connectUser(connectUserDto);
  }
}
