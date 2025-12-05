
export class MessageCode {

  message: string;
  code: string;
  status?: number;

  constructor(message: string, code: string) {
    this.message = message;
    this.code = code;
  }

}