import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Role } from "src/model/account/role.entity";
import { RoleResponse } from "src/dto/role/role-response.dto";
import { plainToInstance } from "class-transformer";
import { createPage } from "src/dto/common/page";
import { RoleSearchRequest } from "src/dto/role/role-search-request.dto";

@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  async searchRoles(query: RoleSearchRequest) {

    const { search, page, size } = query;

    const qb: SelectQueryBuilder<Role> = this.roleRepository
      .createQueryBuilder('r')
      .orderBy('r.id', 'ASC');

    if (search) {
      qb.andWhere('r.name LIKE :search', {
        search: `%${search.trim()}%`
      });
    }
    if (size > 0)
      qb.skip(page * size).take(size);

    const [roles, total] = await qb.getManyAndCount();

    const result = plainToInstance(RoleResponse, roles, {
      excludeExtraneousValues: true
    });

    return createPage(result, page, size, total);
  }
}
