import { PermissionDto } from "src/dto/account/permission.dto";
import { RoleDto } from "src/dto/account/role.dto";

export function createMockRepository() {
  return {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    query: jest.fn(),
  };
}

export const mockPermission = (name: string) => ({
  id: Math.floor(Math.random() * 1000),
  name,
  description: `${name} permission`
});
export const mockRole = (name: string, permissions: any[]) => ({
  id: Math.floor(Math.random() * 1000),
  name,
  description: `${name} role`,
  permissions
});
export const mockUserWithPermissions = (role: any) => ({
  id: 1,
  email: "viewer@example.com",
  name: "Viewer Test",
  status: "active",
  roles: [role]
});
