export const InternalMessageCodes = {
  ShopNotFound: {
    message: 'Shop not found',
    code: 'SHOP_NOT_FOUND',
    status: 404
  }
};

export const TourCodes = {
  TourAlreadyExists: {
    message: 'Tour already exists for this shop and type',
    code: 'TOUR_ALREADY_EXISTS',
    status: 409
  }
};

export const MessageCodes = {

  UnauthorizedError: {
    message: 'Unauthorized',
    code: 'UNAUTHORIZED_ERROR',
    status: 401
  },
  UnexpectedError: {
    message: 'Unexpected error from server',
    code: 'UNEXPECTED_ERROR',
    status: 500
  },
  ShopNotFound: {
    message: 'Error: shop not found',
    code: 'SHOP_NOT_FOUND',
    status: 404
  },
  MessageNotFound: {
    message: 'Message not found',
    code: 'MESSAGE_NOT_FOUND',
    status: 404
  },
  GenericErrorMessage: {
    message: 'An error occurred, please try again later. Details: {details}',
    code: 'GENERIC_ERROR_MESSAGE',
    status: 500
  },
  HttpException: {
    message: 'An error occurred, please try again later. Details: {details}',
    code: 'HTTP_EXCEPTION',
    status: 500
  }
};

export const AssistantCodes = {
  AssistantNotFound: {
    message: 'Assistant not found',
    code: 'ASSISTANT_NOT_FOUND',
    status: 404
  },
  TopicNotFound: {
    message: 'Topic not found',
    code: 'TOPIC_NOT_FOUND',
    status: 404
  },
  SummaryRunFailed: {
    message: 'An error occurred, please try again later',
    code: 'SUMMARY_RUN_FAILED',
    status: 500
  },
  ConflictError: {
    message: 'No se puede habilitar el asistente. Conflicto con: {conflictsDescription}',
    code: 'CONFLICT_ERROR',
    status: 409
  }
};

export const ChatCodes = {
  ChatNotFound: {
    message: 'Chat not found',
    code: 'CHAT_NOT_FOUND',
    status: 404
  },
  ChatAlreadyExists: {
    message: 'Chat already exists',
    code: 'CHAT_ALREADY_EXISTS',
    status: 409
  },
  ChatHasMessages: {
    message: 'Chat has messages',
    code: 'CHAT_HAS_MESSAGES',
    status: 409
  },
  MessageNotFound: {
    message: 'Message not found',
    code: 'MESSAGE_NOT_FOUND',
    status: 404
  }
};

export const FunnelCodes = {
  FunnelNotFound: {
    message: 'Funnel not found',
    code: 'FUNNEL_NOT_FOUND',
    status: 404
  },
  FunnelAlreadyExists: {
    message: 'Funnel already exists',
    code: 'FUNNEL_ALREADY_EXISTS',
    status: 409
  },
  FunnelHasStages: {
    message: 'Funnel has stages',
    code: 'FUNNEL_HAS_STAGES',
    status: 409
  },
  ChatIsNotInFunnel: {
    message: 'Chat is not in funnel',
    code: 'CHAT_IS_NOT_IN_FUNNEL',
    status: 409
  },
  FunnelHasChats: {
    message: 'Funnel has chats',
    code: 'FUNNEL_HAS_CHATS',
    status: 409
  },
  ChatIsNotInStage: {
    message: 'Chat is not in the specified stage',
    code: 'CHAT_IS_NOT_IN_STAGE',
    status: 409
  }
};

export const UserMessageCodes = {
  UsernameAlreadyExists: {
    message: 'Nombre de usuario ya existe',
    code: 'USERNAME_ALREADY_EXISTS',
    status: 500
  },
  UserHasChats: {
    message: 'El usuario tiene chats registrados, reasigne los chats antes de deshabilitar el usuario',
    code: 'USER_HAS_CHATS',
    status: 409
  },
  AlreadyReferred: {
    message: 'El usuario ya esta vinculado a otro usuario',
    code: 'ALREADY_REFERRED',
    status: 409
  },
  MissingPartnerCode: {
    message: 'Código de afiliado no existente',
    code: 'MISSING_PARTNER_CODE',
    status: 409
  },
  SelfReferralNotAllowed: {
    message: 'Auto referirse no esta permitido',
    code: 'SELF_REFERRAL_NOT_ALLOWED',
    status: 409
  },
  UserNotFound: {
    message: 'Usuario no encontrado',
    code: 'USER_NOT_FOUND',
    status: 404
  },
  DuplicatedUser: {
    message: 'Usuario ya existe',
    code: 'DUPLICATED_USER',
    status: 409
  },
  EmptyPasswordFields: {
    message: 'Campos de contraseña vacíos',
    code: 'EMPTY_PASSWORD_FIELDS',
    status: 400
  },
  PasswordsDoNotMatch: {
    message: 'Las contraseñas no coinciden',
    code: 'PASSWORDS_DO_NOT_MATCH',
    status: 400
  },
  IncorrectPassword: {
    message: 'Contraseña incorrecta',
    code: 'INCORRECT_PASSWORD',
    status: 400
  },
  ActivationTokenExpired: {
    message: 'Token de activación expirado',
    code: 'ACTIVATION_TOKEN_EXPIRED',
    status: 400
  },
  ChatNotFound: {
    message: 'Chat not found',
    code: 'CHAT_NOT_FOUND',
    status: 404
  },
  ShopNotFound: {
    message: 'Shop not found',
    code: 'SHOP_NOT_FOUND',
    status: 404
  },
  ReferredPartner: {
    message: 'Partner already associated',
    code: 'SHOP_NOT_FOUND',
    status: 404
  }
};

export const TeamMessageCodes = {
  TeamNameAlreadyExists: {
    message: 'Nombre de Equipo ya existe',
    code: 'TEAM_NAME_ALREADY_EXISTS',
    status: 500
  },
  TeamNotFound: {
    message: 'Equipo no encontrado',
    code: 'TEAM_NOT_FOUND',
    status: 404
  },
  DuplicatedTeam: {
    message: 'Equipo ya existe',
    code: 'DUPLICATED_TEAM',
    status: 409
  },
  TeamNoHaveUsers: {
    message: 'El equipo no tiene usuarios',
    code: 'TEAM_NO_HAVE_USERS',
    status: 409
  },
  CannotDeleteDefaultTeam: {
    message: 'No se puede eliminar el equipo por defecto',
    code: 'CANNOT_DELETE_DEFAULT_TEAM',
    status: 409
  }

};

export const BroadcastMessageCodes = {
  BroadcastNotFound: {
    message: 'Broadcast not found',
    code: 'BROADCAST_NOT_FOUND',
    status: 404
  },
  WhatsAppConfigNotFound: {
    message: 'WhatsApp config not found',
    code: 'WHATSAPP_CONFIG_NOT_FOUND',
    status: 404
  }
};

export const ConfigMessageCodes = {
  WhatsAppConfigNotFound: {
    message: 'WhatsApp config not found',
    code: 'WHATSAPP_CONFIG_NOT_FOUND',
    status: 404
  },
  WhatsAppWebInstanceAlreadyExists: {
    message: 'WhatsApp Web instance already exists',
    code: 'WHATSAPP_WEB_INSTANCE_ALREADY_EXISTS',
    status: 409
  },
  MessengerConfigNotFound: {
    message: 'Messenger config not found',
    code: 'MESSENGER_CONFIG_NOT_FOUND',
    status: 404
  },
  ElevenlabConfigNotFound: {
    message: 'Elevenlab config not found',
    code: 'ElevenlabConfigNotFound',
    status: 404
  },
  GoogleConfigNotFound: {
    message: 'Google config not found',
    code: 'GoogleConfigNotFound',
    status: 404
  }
};

export const ChatLabelMessageCodes = {
  DuplicatedChatLabel: {
    message: 'Chat Label already exists',
    code: 'DUPLICATED_CHAT_LABEL',
    status: 409
  }
};

export const BoardMessageCodes = {
  BoardNotFound: {
    message: 'Board not found',
    code: 'NO_KANBAN_BOARD_FOUND',
    status: 404
  },
  DuplicatedBoard: {
    message: 'Board Board already exists',
    code: 'DUPLICATED_KANBAN_BOARD',
    status: 409
  }

};

export const QuickReplyMessageCodes = {
  DuplicatedQuickReply: {
    message: 'Quick Reply already exists',
    code: 'DUPLICATED_QUICK_REPLY',
    status: 409
  },
  NoGroupRelationFound: {
    message: 'No group relation found',
    code: 'NO_GROUP_RELATION_FOUND',
    status: 404
  },
  NoQuickReplyFound: {
    message: 'Quick Reply not found',
    code: 'NO_QUICK_REPLY_FOUND',
    status: 409
  },
  NoGroupFound: {
    message: 'No group found',
    code: 'NO_GROUP_FOUND',
    status: 404
  },
  DuplicatedQuickReplyGroup: {
    message: 'Quick Reply group already exists',
    code: 'DUPLICATED_QUICK_REPLY_GROUP',
    status: 409
  },
  InvalidPayload: {
    message: 'Invalid payload',
    code: 'INVALID_PAYLOAD',
    status: 409
  },
  ShopNotFound: {
    message: 'Shop not found',
    code: 'SHOP_NOT_FOUND',
    status: 409
  }
};

export const MessageTemplateMessageCodes = {
  TooEarlyToReEdit: {
    message: 'Too early to re-edit message template',
    code: 'TOO_EARLY_TO_RE_EDIT',
    status: 400
  }

};

export const RoleMessageCodes = {
  DuplicatedRole: {
    message: 'Role already exists',
    code: 'DUPLICATED_ROLE',
    status: 409
  },
  RoleNotFound: {
    message: 'Role not found',
    code: 'NO_ROLE_FOUND',
    status: 404
  },
  NoGroupRelationFound: {
    message: 'No group relation found for the role',
    code: 'NO_GROUP_RELATION_FOUND',
    status: 404
  },
  InvalidRoleId: {
    message: 'Invalid Role ID',
    code: 'INVALID_ROLE_ID',
    status: 400
  },
  RoleUpdateFailed: {
    message: 'Failed to update the role',
    code: 'ROLE_UPDATE_FAILED',
    status: 500
  },
  RoleDeleteFailed: {
    message: 'Failed to delete the role',
    code: 'ROLE_DELETE_FAILED',
    status: 500
  },
  DuplicatedRoleGroup: {
    message: 'Role group already exists',
    code: 'DUPLICATED_ROLE_GROUP',
    status: 409
  }
};

export const MarketplaceMessageCodes = {
  InvalidInputData: {
    message: 'Invalid input data',
    code: 'INVALID_INPUT_DATA',
    status: 400
  },
  AppNotFound: {
    message: 'App not found',
    code: 'APP_NOT_FOUND',
    status: 404
  },
  AppAlreadyExists: {
    message: 'App already exists',
    code: 'APP_ALREADY_EXISTS',
    status: 409
  },
  AppHasChats: {
    message: 'App has chats',
    code: 'APP_HAS_CHATS',
    status: 409
  },
  DuplicatedApp: {
    message: 'App already exists',
    code: 'DUPLICATED_APP',
    status: 409
  },
  AppGalleryNotFound: {
    message: 'App gallery not found',
    code: 'APP_GALLERY_NOT_FOUND',
    status: 404
  },
  AppReviewNotFound: {
    message: 'App review not found',
    code: 'APP_REVIEW_NOT_FOUND',
    status: 404
  },
  AppNoHaveReviews: {
    message: 'App no have reviews',
    code: 'APP_NO_HAVE_REVIEWS',
    status: 409
  }

};

export const AttendantMessageCodes = {
  InvalidAttendantDescription: {
    message: '{message}',
    code: 'INVALID_ATTENDANT_DESCRIPTION',
    status: 409
  }
};

export const UtilitiesMessageCodes = {
  InvalidJSON: {
    message: 'Invalid JSON format',
    code: 'INVALID_JSON',
    status: 400
  }

}
