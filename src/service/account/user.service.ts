import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterRequest } from "src/dto/auth/register-request.dto";
import { User } from "src/model/account/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {

  private readonly logger: Logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ) { }

  async createUser(request: RegisterRequest) {
    const user = this.userRepository.create({
      email: request.email.toLowerCase().trim(),
      name: request.name,
      passwordHash: request.password
    });

    return await this.userRepository.save(user);
  }


  async findByUsername(identifier: string) {
    return await this.userRepository.findOneBy([
      { email: identifier }
    ]);
  }

}
