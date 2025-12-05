import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

import { Role } from 'src/model/account/role.entity';
import { Permission } from 'src/model/account/permission.entity';
import { RolePermission } from 'src/model/account/role-permission.entity';
import { PermissionType } from 'src/type/account/permission.type';

export async function seedRBAC(dataSource: DataSource) {

  const logger = new Logger('RBACSeed');

  logger.log('⏳ Iniciando RBAC seed...');

  const roleRepo = dataSource.getRepository(Role);
  const permissionRepo = dataSource.getRepository(Permission);
  const rolePermissionRepo = dataSource.getRepository(RolePermission);

  try {
    // --------------------------
    // 1. Crear permisos
    // --------------------------
    logger.log('➡️  Creando permisos...');

    const permissionsToSeed = Object.values(PermissionType).map(p => ({
      name: p,
      description: `${p} permission`
    }));

    const permissions = await permissionRepo.save(permissionsToSeed);

    logger.log(`✔ Permisos creados: ${permissions.length}`);

    // Utilidad para encontrar permisos por nombre
    const perm = (name: PermissionType) => permissions.find(p => p.name === name);

    // --------------------------
    // 2. Crear roles
    // --------------------------
    logger.log('➡️  Creando roles...');

    const roles = await roleRepo.save([
      { name: 'ADMIN', description: 'Full access' },
      { name: 'AGENT', description: 'Booking manager' },
      { name: 'VIEWER', description: 'Read-only user' }
    ]);

    const ADMIN = roles.find(r => r.name === 'ADMIN');
    const AGENT = roles.find(r => r.name === 'AGENT');
    const VIEWER = roles.find(r => r.name === 'VIEWER');

    logger.log(`✔ Roles creados: ${roles.length}`);

    // --------------------------
    // 3. Asignar permisos por rol
    // --------------------------
    logger.log('➡️  Asignando permisos a roles...');

    // ADMIN: todos los permisos
    const adminPermissions = permissions.map(p => ({
      role: ADMIN,
      permission: p
    }));

    logger.log(`  • ADMIN tendrá ${adminPermissions.length} permisos`);

    // AGENT
    const agentPermList = [
      PermissionType.BOOKING_VIEW,
      PermissionType.BOOKING_CREATE,
      PermissionType.BOOKING_EDIT,
      PermissionType.BOOKING_CANCEL,
      PermissionType.DESTINATION_VIEW,
      PermissionType.DESTINATION_CREATE,
      PermissionType.DESTINATION_EDIT
    ];

    const agentPermissions = agentPermList.map(p => ({
      role: AGENT,
      permission: perm(p)
    }));

    logger.log(`  • AGENT tendrá ${agentPermissions.length} permisos`);

    // VIEWER
    const viewerPermList = [
      PermissionType.BOOKING_VIEW,
      PermissionType.DESTINATION_VIEW
    ];

    const viewerPermissions = viewerPermList.map(p => ({
      role: VIEWER,
      permission: perm(p)
    }));

    logger.log(`  • VIEWER tendrá ${viewerPermissions.length} permisos`);

    // Guardar asignaciones
    const totalRolePerms = [
      ...adminPermissions,
      ...agentPermissions,
      ...viewerPermissions
    ];

    await rolePermissionRepo.save(totalRolePerms);

    logger.log(`✔ RolePermissions insertados: ${totalRolePerms.length}`);

    logger.log('🎉 RBAC seed completado exitosamente');
  } catch (error) {
    logger.error('❌ Error ejecutando RBAC seed', error);
    throw error;
  }
}
