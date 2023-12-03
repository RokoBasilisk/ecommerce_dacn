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
  PRODUCT_UPDATE_ADMIN_REQUEST,
  PRODUCT_UPDATE_ADMIN_SUCCESS,
  PRODUCT_UPDATE_ADMIN_FAIL,
  PRODUCT_CREATE_ADMIN_REQUEST,
  PRODUCT_CREATE_ADMIN_SUCCESS,
  PRODUCT_CREATE_ADMIN_FAIL,
  PRODUCT_CREATE_REVIEW_CLEAR,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,
  PRODUCT_FEATURED_REQUEST,
  PRODUCT_FEATURED_SUCCESS,
  PRODUCT_FEATURED_FAIL,
  PRODUCT_MODAL_SUCCESS,
  PRODUCT_MODAL_REQUEST,
  PRODUCT_MODAL_FAIL,
  PRODUCT_UPLOAD_IMAGE_REQUEST,
  PRODUCT_UPLOAD_IMAGE_SUCCESS,
  PRODUCT_UPLOAD_IMAGE_FAIL,
} from "../types";

export const productListReducer = (
  state = { products: [], pages: [], page: [] },
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] };
    case PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        products: payload.products,
        pages: payload.pages,
        page: payload.page,
      };
    case PRODUCT_LIST_FAIL:
      return { loading: false, error: payload };
    case PRODUCT_DELETE_ADMIN_REQUEST:
      return { ...state, loading: true };
    case PRODUCT_DELETE_ADMIN_SUCCESS:
      var newProducts = state.products.filter((el) => el._id !== payload);
      return {
        ...state,
        loading: false,
        delSuccess: true,
        products: newProducts,
      };
    case PRODUCT_DELETE_ADMIN_FAIL:
      return { ...state, loading: false, delError: payload };
    case PRODUCT_UPDATE_ADMIN_SUCCESS:
      var updateProducts = state.products.map((el) => {
        if (el._id === payload._id) {
          return payload;
        } else {
          return el;
        }
      });
      return { ...state, products: updateProducts };
    default:
      return state;
  }
};

export const productDetailsReducer = (
  state = { product: { reviews: [] }, isModalOn: false },
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case PRODUCT_UPDATE_ADMIN_REQUEST:
      return { ...state, loading: true };
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true };
    case PRODUCT_MODAL_REQUEST:
      return { loading: true, isModalOn: false };
    case PRODUCT_UPDATE_ADMIN_SUCCESS:
      return { loading: false, isModalOn: false, product: payload };
    case PRODUCT_CREATE_REVIEW_SUCCESS:
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: payload, isModalOn: false };
    case PRODUCT_MODAL_SUCCESS:
      return { loading: false, product: payload, isModalOn: true };
    case PRODUCT_UPDATE_ADMIN_FAIL:
      return { loading: false, error: payload };
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: payload };
    case PRODUCT_MODAL_FAIL:
      return { loading: false, error: payload, isModalOn: true };
    case PRODUCT_DETAILS_CLEAR:
      return { loading: false, product: { reviews: [] }, isModalOn: false };

    default:
      return state;
  }
};

export const productReviewCreateReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case PRODUCT_CREATE_REVIEW_REQUEST:
      return { loading: true };
    case PRODUCT_CREATE_REVIEW_SUCCESS:
      return { loading: false, success: true };
    case PRODUCT_CREATE_REVIEW_FAIL:
      return { loading: false, error: payload };
    case PRODUCT_CREATE_REVIEW_CLEAR:
      return {};

    default:
      return state;
  }
};

export const productTopRatedReducer = (
  state = { loading: true, products: [] },
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case PRODUCT_TOP_REQUEST:
      return { loading: true, products: [] };
    case PRODUCT_TOP_SUCCESS:
      return { loading: false, products: payload };
    case PRODUCT_TOP_FAIL:
      return { loading: false, error: payload };

    default:
      return state;
  }
};

export const productFeaturedReducer = (
  state = { loading: true, products: [] },
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case PRODUCT_FEATURED_REQUEST:
      return { loading: true, products: [] };
    case PRODUCT_FEATURED_SUCCESS:
      return { loading: false, products: payload };
    case PRODUCT_FEATURED_FAIL:
      return { loading: false, error: payload };

    default:
      return state;
  }
};

export const productImageReducer = (
  state = {
    loading: false,
    image: "",
    error: null,
  },
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case PRODUCT_UPLOAD_IMAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case PRODUCT_UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        image: payload,
      };
    case PRODUCT_UPLOAD_IMAGE_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};

export const productCreateReducer = (
  state = {
    loading: false,
    image: null,
    error: null,
  },
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case PRODUCT_CREATE_ADMIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case PRODUCT_CREATE_ADMIN_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case PRODUCT_CREATE_ADMIN_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};
