import { MessageCodes } from "./internal-message-code";
import { MessageCode } from "./message-code";

export class CustomError implements Error {

  messageCode: MessageCode;

  constructor(messageCode?: MessageCode, params?: any) {
    if (!messageCode) {
      this.messageCode = MessageCodes.UnexpectedError;
    } else {
      this.messageCode = messageCode;
    }

    if (params) {
      this.messageCode.message = this.messageCode.message.replace(/{(\w+)}/g, (_, key) => {
        return params[key] || '';
      });
    }
  }

  name: string;
  message: string;
  stack?: string | undefined;

}