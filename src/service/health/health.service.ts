import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CustomError } from "src/config/exception/custom.error";
import { MessageCodes } from "src/config/exception/internal-message-code";

@Injectable()
export class HealthService {

  constructor(private readonly dataSource: DataSource) { }

  async checkDatabase() {
    try {
      await this.dataSource.query("SELECT 1");

      return { database: "up" };

    } catch (error) {
      throw new CustomError(MessageCodes.DatabaseConnectionError, {
        details: error.message
      });
    }
  }
}
