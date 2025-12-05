export const MessageCodes = {
  // Auth & Users
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

  // Destinations
  DestinationNotFound: {
    message: 'Destination {id} was not found',
    code: 'DESTINATION_NOT_FOUND',
    status: 404
  },

  DestinationAlreadyExists: {
    message: 'A destination with these values already exists: {details}',
    code: 'DESTINATION_ALREADY_EXISTS',
    status: 400
  },

  DestinationHasActiveBookings: {
    message: 'Destination {id} cannot be deleted because it has active bookings',
    code: 'DESTINATION_HAS_ACTIVE_BOOKINGS',
    status: 400
  },

  DestinationDeleteNotAllowed: {
    message: 'Destination {id} cannot be deleted',
    code: 'DESTINATION_DELETE_NOT_ALLOWED',
    status: 400
  },

  // Generic
  UnexpectedError: {
    message: 'Unexpected error from server',
    code: 'UNEXPECTED_ERROR',
    status: 500
  },
};
