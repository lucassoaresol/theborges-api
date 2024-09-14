import { IMessageWithChat } from '../interfaces/message.js';

import Message from './message.js';
import ModelWPP from './modelWPP.js';

class MessageManager extends ModelWPP {
  private messages: Map<string, Message> = new Map();

  private async addMessage(data: IMessageWithChat) {
    let message = this.messages.get(data.id);

    if (!message) {
      message = new Message(data);
      this.messages.set(data.id, message);
    }

    await message.salute();
  }

  private async addMessageArray(messages: IMessageWithChat[]) {
    await Promise.all(
      messages.map(async (data) => {
        await this.addMessage(data);
        console.log(`Message with ID ${data.id} has been added and started.`);
      }),
    );
  }

  public async read() {
    try {
      const resultMessages = (
        await this.poolWPP.query<IMessageWithChat>(
          `SELECT m.id, m.from_me, m.client_id, m.chat_id, c.name AS chat_name,
          c.is_group AS chat_is_group FROM messages m
          JOIN chats c ON c.id = m.chat_id
          WHERE m.is_new = true AND m.client_id = 'theborges'
          ORDER BY created_at;`,
        )
      ).rows;

      await this.addMessageArray(resultMessages);
    } catch (error) {
      console.error('Error loading processes from database:', error);
    }
  }
}

export default MessageManager;
