import { IMessageWithChat } from '../interfaces/message.js';
import { createMessage } from '../libs/axiosWPP.js';
import dayLib from '../libs/dayjs.js';
import {
  generateDbMsg,
  saudacao,
  updateIntoTable,
  validatePhoneNumber,
} from '../utils/helperFunctions.js';

import Chat from './chat.js';
import ModelWPP from './modelWPP.js';

class Message extends ModelWPP {
  private id: string;
  private from_me: boolean;
  private chat_id: string;
  private client_id: string;
  private chat: Chat;

  constructor({
    id,
    from_me,
    chat_id,
    client_id,
    chat_is_group,
    chat_name,
  }: IMessageWithChat) {
    super();
    this.id = id;
    this.from_me = from_me;
    this.chat_id = chat_id;
    this.client_id = client_id;
    this.chat = new Chat({
      id: chat_id,
      is_group: chat_is_group,
      name: chat_name,
    });
  }

  private async read() {
    await updateIntoTable(this.poolWPP, 'messages', {
      id: this.id,
      is_new: false,
    });
  }

  private async sendAndGenerateMSG() {
    let message = '';
    const chat = this.chat.getData();
    const salute = saudacao(dayLib().toDate());
    const link = 'https://agendar.barbearia.theborges.nom.br';
    const baseDict = { salute, link_site: link };

    if (!chat.is_group) {
      if (chat.name.length > 2 && !validatePhoneNumber(chat.name)) {
        message = await generateDbMsg(this.pool, 'WPP_INBOX_NAME', {
          ...baseDict,
          nome_cliente: chat.name,
        });
      } else {
        message = await generateDbMsg(this.pool, 'WPP_INBOX', baseDict);
      }
      await createMessage({
        message,
        number: chat.id,
      });
    }
  }

  public async salute() {
    if (!this.from_me) {
      const resultOldMessage = await this.poolWPP.query(
        `SELECT created_at FROM messages WHERE is_new = false 
        AND chat_id = $1 AND client_id = $2
        ORDER BY created_at DESC;`,
        [this.chat_id, this.client_id],
      );

      if (resultOldMessage.rowCount) {
        const oldMessage = resultOldMessage.rows[0] as { created_at: Date };
        if (dayLib().diff(oldMessage.created_at, 'h') >= 36)
          await this.sendAndGenerateMSG();
      } else {
        await this.sendAndGenerateMSG();
      }
    }
    await this.read();
  }
}

export default Message;
