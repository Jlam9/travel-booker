import { DataSource } from 'typeorm';
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

    const permissions = await permissionRepo.save(permissionsToSeed);
    logger.log(`Permisos creados: ${permissions.length}`);

    const findPermission = (name: PermissionType) =>
      permissions.find(p => p.name === name);

    // ============================================================
    // 2. ROLES
    // ============================================================
    logger.log('Creando roles...');

    const roles = await roleRepo.save([
      { name: 'ADMIN', description: 'Acceso total al sistema' },
      { name: 'AGENT', description: 'Gestión de reservas y destinos' },
      { name: 'VIEWER', description: 'Solo lectura' },
    ]);

    const ADMIN = roles.find(r => r.name === 'ADMIN');
    const AGENT = roles.find(r => r.name === 'AGENT');
    const VIEWER = roles.find(r => r.name === 'VIEWER');

    if (!ADMIN || !AGENT || !VIEWER) {
      throw new Error('No se pudieron cargar correctamente los roles.');
    }

    logger.log(`Roles creados: ${roles.length}`);

    // ============================================================
    // 3. ASIGNACIÓN DE PERMISOS A ROLES
    // ============================================================
    logger.log('Asignando permisos a los roles...');

    // ADMIN → todos los permisos
    const adminPermissions = permissions.map(p => ({
      role: ADMIN,
      permission: p,
    }));

    // AGENT → permisos específicos
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

    // VIEWER → solo lectura
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

    await rolePermissionRepo.save(allRolePermissions);
    logger.log(`Permisos asignados: ${allRolePermissions.length}`);

    // ============================================================
    // 4. CREACIÓN DE USUARIOS BASE
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
        logger.log(`Usuario ya existía: ${u.email}`);
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

    logger.log('Seed RBAC completado exitosamente ✔');
  } catch (error) {
    logger.error('Error durante seed RBAC:', error);
    throw error;
  }
}
