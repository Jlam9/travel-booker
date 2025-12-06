import { DataSource, In } from 'typeorm';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { Role } from 'src/model/account/role.entity';
import { Permission } from 'src/model/account/permission.entity';
import { RolePermission } from 'src/model/account/role-permission.entity';
import { PermissionType } from 'src/type/account/permission.type';

import { User } from 'src/model/account/user.entity';
import { UserRole } from 'src/model/account/user-role.entity';
import { UserStatusType } from 'src/type/account/user-status.type';

export async function seedRBAC(dataSource: DataSource) {
  const logger = new Logger('RBACSeed');

  logger.log('Iniciando proceso de seed para RBAC...');

  const roleRepo = dataSource.getRepository(Role);
  const permissionRepo = dataSource.getRepository(Permission);
  const rolePermissionRepo = dataSource.getRepository(RolePermission);
  const userRepo = dataSource.getRepository(User);
  const userRoleRepo = dataSource.getRepository(UserRole);

  try {
    // ============================================================
    // 1. PERMISOS
    // ============================================================
    logger.log('Creando permisos...');

    const permissionsToSeed = Object.values(PermissionType).map(p => ({
      name: p,
      description: `Permiso: ${p}`,
    }));

    const existingPermissions = await permissionRepo.find({
      where: { name: In(permissionsToSeed.map(p => p.name)) },
    });
    const permissionsToCreate = permissionsToSeed.filter(
      p => !existingPermissions.some(ep => ep.name === p.name),
    );

    const createdPermissions = permissionsToCreate.length
      ? await permissionRepo.save(permissionsToCreate)
      : [];
    const permissions = [...existingPermissions, ...createdPermissions];

    logger.log(
      `Permisos listos: ${permissions.length} (creados ${createdPermissions.length})`,
    );

    const findPermission = (name: PermissionType) =>
      permissions.find(p => p.name === name);

    // ============================================================
    // 2. ROLES
    // ============================================================
    logger.log('Creando roles...');

    const rolesToSeed = [
      { name: 'ADMIN', description: 'Acceso total al sistema' },
      { name: 'AGENT', description: 'Gestion de reservas y destinos' },
      { name: 'VIEWER', description: 'Solo lectura' },
    ];
    const existingRoles = await roleRepo.find({
      where: { name: In(rolesToSeed.map(r => r.name)) },
    });
    const rolesToCreate = rolesToSeed.filter(
      r => !existingRoles.some(er => er.name === r.name),
    );
    const createdRoles = rolesToCreate.length
      ? await roleRepo.save(rolesToCreate)
      : [];
    const roles = [...existingRoles, ...createdRoles];

    const ADMIN = roles.find(r => r.name === 'ADMIN');
    const AGENT = roles.find(r => r.name === 'AGENT');
    const VIEWER = roles.find(r => r.name === 'VIEWER');

    if (!ADMIN || !AGENT || !VIEWER) {
      throw new Error('No se pudieron cargar correctamente los roles.');
    }

    logger.log(
      `Roles listos: ${roles.length} (creados ${createdRoles.length})`,
    );

    // ============================================================
    // 3. ASIGNACION DE PERMISOS A ROLES
    // ============================================================
    logger.log('Asignando permisos a los roles...');

    const adminPermissions = permissions.map(p => ({
      role: ADMIN,
      permission: p,
    }));

    const agentPermList: PermissionType[] = [
      PermissionType.BOOKING_VIEW,
      PermissionType.BOOKING_CREATE,
      PermissionType.BOOKING_EDIT,
      PermissionType.BOOKING_CANCEL,
      PermissionType.DESTINATION_VIEW,
      PermissionType.DESTINATION_CREATE,
      PermissionType.DESTINATION_EDIT,
    ];

    const agentPermissions = agentPermList.map(p => ({
      role: AGENT,
      permission: findPermission(p),
    }));

    const viewerPermList: PermissionType[] = [
      PermissionType.BOOKING_VIEW,
      PermissionType.DESTINATION_VIEW,
    ];

    const viewerPermissions = viewerPermList.map(p => ({
      role: VIEWER,
      permission: findPermission(p),
    }));

    const allRolePermissions = [
      ...adminPermissions,
      ...agentPermissions,
      ...viewerPermissions,
    ];

    let createdRolePermissions = 0;
    for (const rp of allRolePermissions) {
      if (!rp.permission) {
        continue;
      }

      const exists = await rolePermissionRepo.findOne({
        where: {
          role: { id: rp.role.id },
          permission: { id: rp.permission.id },
        },
      });

      if (!exists) {
        await rolePermissionRepo.save(rp);
        createdRolePermissions += 1;
      }
    }
    logger.log(
      `Permisos asignados: ${allRolePermissions.length} (nuevos ${createdRolePermissions})`,
    );

    // ============================================================
    // 4. CREACION DE USUARIOS BASE
    // ============================================================
    logger.log('Creando usuario admin, agent y viewer...');

    const defaultUsers = [
      {
        email: 'admin@example.com',
        name: 'Administrador',
        role: ADMIN,
        status: UserStatusType.Active,
      },
      {
        email: 'agent@example.com',
        name: 'Agent Test',
        role: AGENT,
        status: UserStatusType.Active,
      },
      {
        email: 'viewer@example.com',
        name: 'Viewer Test',
        role: VIEWER,
        status: UserStatusType.Active,
      },
    ];

    for (const u of defaultUsers) {
      let user = await userRepo.findOne({ where: { email: u.email } });

      if (!user) {
        user = await userRepo.save({
          name: u.name,
          email: u.email,
          passwordHash: await bcrypt.hash('password123', 10),
          status: u.status,
        });

        logger.log(`Usuario creado: ${u.email}`);
      } else {
        logger.log(`Usuario ya existia: ${u.email}`);
      }

      const existsRole = await userRoleRepo.findOne({
        where: { user: { id: user.id }, role: { id: u.role.id } },
      });

      if (!existsRole) {
        await userRoleRepo.save({
          user,
          role: u.role,
        });
        logger.log(`Rol ${u.role.name} asignado a ${u.email}`);
      }
    }

    logger.log('Seed RBAC completado exitosamente');
  } catch (error) {
    logger.error('Error durante seed RBAC:', error);
    throw error;
  }
}
