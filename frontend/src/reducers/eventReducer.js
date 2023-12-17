import {
  EVENT_LIST_FAIL,
  EVENT_LIST_REQUEST,
  EVENT_LIST_SUCCESS,
} from "../types";

export const eventListReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case EVENT_LIST_REQUEST:
      return { loading: true, events: [] };
    case EVENT_LIST_SUCCESS:
      return {
        loading: false,
        events: payload.events,
      };
    case EVENT_LIST_FAIL:
      return { loading: false, error: payload };
    default:
      return state;
  }
};
