export type Message =
  | { type: "FETCH_FAVICON"; url: string }
  | { type: "GET_ACTIVE_TAB_URL" };

export type MessageResponse<T extends Message["type"]> =
  T extends "FETCH_FAVICON"
    ? { dataUri: string | null }
    : T extends "GET_ACTIVE_TAB_URL"
      ? { url: string | null }
      : never;
