export enum UserRoleType {
  SystemAdmin = 'system-admin',
  Admin = 'admin',
  ChatAdvisor = 'chat-advisor',
  Custom = 'custom',
  Partner = 'partner'
}

export const UserRoleTypeMetadata = {
  [UserRoleType.SystemAdmin]: {
    name: 'Administrador del sistema',
  },
  [UserRoleType.Admin]: {
    name: 'Administrador',
  },
  [UserRoleType.ChatAdvisor]: {
    name: 'Asesor',
  },
  [UserRoleType.Custom]: {
    name: 'Custom',
  },
  [UserRoleType.Partner]: {
    name: 'Socio',
  },
};