import { IChat } from '../interfaces/chat.js';

class Chat {
  private id: string;
  private name: string;
  private is_group: boolean;

  constructor({ id, is_group, name }: IChat) {
    this.id = id;
    this.name = name;
    this.is_group = is_group;
  }

  public getData(): IChat {
    return { id: this.id, is_group: this.is_group, name: this.name };
  }
}

export default Chat;
