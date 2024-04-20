export interface MessageSendDto {
    destId: string,
    content: string
}

export interface MessageReceiveDto {
    senderId: string,
    destId: string,
    content: string
}