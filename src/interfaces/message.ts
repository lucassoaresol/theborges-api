export interface IMessage {
  id: string;
  from_me: boolean;
  chat_id: string;
  client_id: string;
}

export interface IMessageWithChat extends IMessage {
  chat_name: string;
  chat_is_group: boolean;
}
