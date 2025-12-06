import { MessageCodes } from "./internal-message-code";
import { MessageCode } from "./message-code";

export class CustomError extends Error {

  messageCode: MessageCode;

  constructor(messageCode?: MessageCode, params?: any) {

    super();

    this.name = "CustomError";

    this.messageCode = messageCode || MessageCodes.UnexpectedError;

    let finalMessage = this.messageCode.message;

    if (params) {
      finalMessage = finalMessage.replace(/{(\w+)}/g, (_, key) => params[key] || "");
    }

    this.message = finalMessage;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}
