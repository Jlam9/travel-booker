export const MessageCodes = {
  UnauthorizedError: {
    message: 'Unauthorized',
    code: 'UNAUTHORIZED_ERROR',
    status: 401
  },

  ForbiddenError: {
    message: 'You do not have permission to perform this action',
    code: 'FORBIDDEN_ERROR',
    status: 403
  },

  UserNotFound: {
    message: 'User {email} was not found',
    code: 'USER_NOT_FOUND',
    status: 404
  },

  InvalidCredentials: {
    message: 'Invalid email or password',
    code: 'INVALID_CREDENTIALS',
    status: 401
  },

  UserDisabled: {
    message: 'User account is disabled',
    code: 'USER_DISABLED',
    status: 403
  },

  RoleNotFound: {
    message: 'Role {role} does not exist',
    code: 'ROLE_NOT_FOUND',
    status: 400
  },

  MissingPermissions: {
    message: 'Missing required permissions: {details}',
    code: 'MISSING_PERMISSIONS',
    status: 403
  },

  EmailAlreadyExists: {
    message: 'The email {email} is already registered',
    code: 'EMAIL_ALREADY_EXISTS',
    status: 400
  },

  UnexpectedError: {
    message: 'Unexpected error from server',
    code: 'UNEXPECTED_ERROR',
    status: 500
  },
};
