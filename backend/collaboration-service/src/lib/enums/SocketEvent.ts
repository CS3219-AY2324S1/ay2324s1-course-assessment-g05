export enum SocketEvent {
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
  JOIN_ROOM = "join_room",
  CODE_CHANGE = "code_change",
  CODE_UPDATE = "code_update",
  SEND_CHAT_MESSAGE = "send_chat_message",
  UPDATE_CHAT_MESSAGE = "update_chat_message",
  END_SESSION = "end_session",
  CONFIRM_END_SESSION = "confirm_end_session",
  SESSION_TIMER = "session_timer",
  GET_SESSION_TIMER = "get_session_timer",
  PARTNER_CONNECTION = "partner_connection",
  SEND_CHAT_LIST = "send_chat_list",
  UPDATE_CHAT_LIST = "update_chat_list"
}
