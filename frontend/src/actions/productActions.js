import axios from "axios";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_CLEAR,
  PRODUCT_DELETE_ADMIN_REQUEST,
  PRODUCT_DELETE_ADMIN_SUCCESS,
  PRODUCT_DELETE_ADMIN_FAIL,
  PRODUCT_CREATE_ADMIN_REQUEST,
  PRODUCT_CREATE_ADMIN_SUCCESS,
  PRODUCT_CREATE_ADMIN_FAIL,
  PRODUCT_UPDATE_ADMIN_REQUEST,
  PRODUCT_UPDATE_ADMIN_SUCCESS,
  PRODUCT_UPDATE_ADMIN_FAIL,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_CREATE_REVIEW_CLEAR,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,
  PRODUCT_FEATURED_REQUEST,
  PRODUCT_FEATURED_SUCCESS,
  PRODUCT_FEATURED_FAIL,
  PRODUCT_MODAL_REQUEST,
  PRODUCT_MODAL_SUCCESS,
  PRODUCT_MODAL_FAIL,
  prefixAPI,
  PRODUCT_UPLOAD_IMAGE_REQUEST,
  PRODUCT_UPLOAD_IMAGE_SUCCESS,
  PRODUCT_UPLOAD_IMAGE_FAIL,
} from "../types";

export const listProducts = (keyword = "", pageNumber = "") => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: PRODUCT_LIST_REQUEST,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };
    const { data } = await axios.get(
      `${prefixAPI}/api/products/shop/?keyword=${keyword}&pageNumber=${pageNumber}`,
      config
    );
    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const uploadImage = (file) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_UPLOAD_IMAGE_REQUEST });

    const formData = new FormData();
    formData.append("image", file);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await axios.post(
      `${prefixAPI}/api/upload`,
      formData,
      config
    );

    dispatch({
      type: PRODUCT_UPLOAD_IMAGE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_UPLOAD_IMAGE_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const createProduct = (formData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_ADMIN_REQUEST,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };
    const { data } = await axios.post(
      `${prefixAPI}/api/products/`,
      formData,
      config
    );
    dispatch({
      type: PRODUCT_CREATE_ADMIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_ADMIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateProduct = (pId, formData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_UPDATE_ADMIN_REQUEST,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };
    const { data } = await axios.patch(
      `${prefixAPI}/api/products/${pId}`,
      formData,
      config
    );
    dispatch({
      type: PRODUCT_UPDATE_ADMIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_ADMIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteProduct = (pId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_ADMIN_REQUEST,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };
    const { data } = await axios.delete(
      `${prefixAPI}/api/products/${pId}`,
      config
    );
    dispatch({
      type: PRODUCT_DELETE_ADMIN_SUCCESS,
      payload: pId,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_ADMIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listProductDetails = (pId) => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_DETAILS_REQUEST,
    });

    const { data } = await axios.get(`${prefixAPI}/api/products/` + pId);
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listProductModalDetails = (pId) => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_MODAL_REQUEST,
    });

    const { data } = await axios.get(`${prefixAPI}/api/products/${pId}`);
    dispatch({
      type: PRODUCT_MODAL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_MODAL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const clearProductDetails = () => async (dispatch) => {
  dispatch({
    type: PRODUCT_DETAILS_CLEAR,
  });
};

export const listCategoryProducts = (category = "", pageNumber = 1) => async (
  dispatch
) => {
  try {
    dispatch({
      type: PRODUCT_LIST_REQUEST,
    });

    const { data } = await axios.get(
      `${prefixAPI}/api/products/category/${category}?pageNumber=${pageNumber}`
    );
    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createProductReview = (objectId, formData) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };
    const { data } = await axios.post(
      `${prefixAPI}/api/products/${objectId}/reviews`,
      formData,
      config
    );
    dispatch({
      type: PRODUCT_CREATE_REVIEW_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const clearProductReview = () => (dispatch) => {
  dispatch({
    type: PRODUCT_CREATE_REVIEW_CLEAR,
  });
};

export const listTopProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_TOP_REQUEST,
    });
    const { data } = await axios.get(`${prefixAPI}/api/products/top`);
    dispatch({
      type: PRODUCT_TOP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_TOP_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listFeaturedProducts = (categoryName = "", pageSize = 3) => async (
  dispatch
) => {
  try {
    dispatch({
      type: PRODUCT_FEATURED_REQUEST,
    });
    const { data } = await axios.get(
      `${prefixAPI}/api/products/featured/${categoryName}?pageSize=${pageSize}`
    );
    dispatch({
      type: PRODUCT_FEATURED_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_FEATURED_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
