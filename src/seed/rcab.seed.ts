import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

import { Role } from 'src/model/account/role.entity';
import { Permission } from 'src/model/account/permission.entity';
import { RolePermission } from 'src/model/account/role-permission.entity';
import { PermissionType } from 'src/type/account/permission.type';

export async function seedRBAC(dataSource: DataSource) {

  const logger = new Logger('RBACSeed');

  logger.log('Iniciando proceso de seed para RBAC...');

  const roleRepo = dataSource.getRepository(Role);
  const permissionRepo = dataSource.getRepository(Permission);
  const rolePermissionRepo = dataSource.getRepository(RolePermission);

  try {
    // -------------------------------------------------------------------
    // Crear permisos
    // -------------------------------------------------------------------
    logger.log('Creando permisos...');

    const permissionsToSeed = Object.values(PermissionType).map(p => ({
      name: p,
      description: `Permiso: ${p}`
    }));

    const permissions = await permissionRepo.save(permissionsToSeed);

    logger.log(`Permisos creados: ${permissions.length}`);

    const perm = (name: PermissionType) =>
      permissions.find(p => p.name === name);

    // -------------------------------------------------------------------
    // Crear roles
    // -------------------------------------------------------------------
    logger.log('Creando roles...');

    const roles = await roleRepo.save([
      { name: 'ADMIN', description: 'Acceso total al sistema' },
      { name: 'AGENT', description: 'Gestión de reservas y destinos' },
      { name: 'VIEWER', description: 'Solo lectura' }
    ]);

    const ADMIN = roles.find(r => r.name === 'ADMIN');
    const AGENT = roles.find(r => r.name === 'AGENT');
    const VIEWER = roles.find(r => r.name === 'VIEWER');

    logger.log(`Roles creados: ${roles.length}`);

    // -------------------------------------------------------------------
    // Asignar permisos a los roles
    // -------------------------------------------------------------------
    logger.log('Asignando permisos a los roles...');

    //
    // ADMIN → TODOS LOS PERMISOS
    //
    const adminPermissions = permissions.map(p => ({
      role: ADMIN,
      permission: p
    }));
    logger.log(`  • ADMIN recibirá ${adminPermissions.length} permisos`);

    //
    // AGENT → CRUD de bookings + creación/edición de destinos
    //
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
      permission: perm(p)
    }));

    logger.log(`  • AGENT recibirá ${agentPermissions.length} permisos`);

    //
    // VIEWER → solo lectura (bookings y destinos)
    //
    const viewerPermList: PermissionType[] = [
      PermissionType.BOOKING_VIEW,
      PermissionType.DESTINATION_VIEW,
    ];

    const viewerPermissions = viewerPermList.map(p => ({
      role: VIEWER,
      permission: perm(p)
    }));

    logger.log(`  • VIEWER recibirá ${viewerPermissions.length} permisos`);

    // Guardar asignaciones
    const allRolePermissions = [
      ...adminPermissions,
      ...agentPermissions,
      ...viewerPermissions
    ];

    await rolePermissionRepo.save(allRolePermissions);

    logger.log(`Permisos asignados a roles: ${allRolePermissions.length}`);
    logger.log('Seed RBAC completado exitosamente');

  } catch (error) {
    logger.error('Error durante el proceso de seed RBAC:', error);
    throw error;
  }
}
