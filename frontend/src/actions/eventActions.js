import axios from "axios";
import {
  EVENT_LIST_FAIL,
  EVENT_LIST_REQUEST,
  EVENT_LIST_SUCCESS,
  prefixAPI,
} from "../types";

export const getShopEvents = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: EVENT_LIST_REQUEST,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };
    const { data } = await axios.get(`${prefixAPI}/api/events/`, config);
    dispatch({
      type: EVENT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: EVENT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
