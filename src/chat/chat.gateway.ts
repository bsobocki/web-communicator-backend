import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageReceiveDto, MessageSendDto } from './dto/message.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'], // Ensuring this is an array
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userToSocket = new Map<string, string>();
  private socketToUser = new Map<string, string>();

  @SubscribeMessage('login')
  handleLogin(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: string,
  ): void {
    this.userToSocket.set(userId, client.id);
    this.socketToUser.set(client.id, userId);
    console.log(`User ${userId} logged in on socket ${client.id}`);
  }

  @SubscribeMessage('chat')
  handleChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: MessageSendDto,
  ): void {
    // Only send the message to the client with the id matching 'dest'
    //this.server.to(message.dest).emit('chat', message.text);
    console.log(
      'I received a request from client: ',
      client.id,
      " who's user name is ",
      this.socketToUser[client.id],
      " to send a message '",
      message.content,
      "' to dest client: ",
      message.destId,
    );
    const destSocketId = this.userToSocket.get(message.destId);

    if (destSocketId) {
      const receiveDto: MessageReceiveDto = {
        senderId: this.socketToUser[client.id],
        destId: message.destId,
        content: message.content
      };
      this.server.to(destSocketId).emit('chat', receiveDto);
      console.log(' Sending message to ', destSocketId);
    } else {
      console.log(' there is no user: ', message.destId);
    }
  }

  public handleDisconnect(@ConnectedSocket() client: Socket) {
    // When the client disconnects, remove them from the map
    const userId = this.socketToUser[client.id];
    delete this.userToSocket[userId];
    delete this.socketToUser[client.id];
    console.log(`User ${userId} disconnected`);
  }
}
