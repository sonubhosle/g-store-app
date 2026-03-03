import axios from "axios";
import {
  CART_FIND_USER_REQUEST,
  CART_FIND_USER_SUCCESS,
  CART_FIND_USER_FAILURE,
  CART_ADD_ITEM_REQUEST,
  CART_ADD_ITEM_SUCCESS,
  CART_ADD_ITEM_FAILURE,
  CART_UPDATE_ITEM_REQUEST,
  CART_UPDATE_ITEM_SUCCESS,
  CART_UPDATE_ITEM_FAILURE,
  CART_REMOVE_ITEM_REQUEST,
  CART_REMOVE_ITEM_SUCCESS,
  CART_REMOVE_ITEM_FAILURE,
  CART_CLEAR,
} from "./Types";
import { api } from "../../config/apiConfig";




export const findUserCart = () => async (dispatch) => {
  dispatch({ type: CART_FIND_USER_REQUEST });
  try {
    const { data } = await api.get('/api/v1/cart/user');
    dispatch({ type: CART_FIND_USER_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: CART_FIND_USER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const addItemToCart = (productId) => async (dispatch) => {
  dispatch({ type: CART_ADD_ITEM_REQUEST });
  try {
    const { data } = await api.put(`/api/v1/cart/add`, { productId }); // ← wrap in object
    dispatch({ type: CART_ADD_ITEM_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: CART_ADD_ITEM_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateCartItemQuantity = (cartItemId, quantity) => async (dispatch) => {
  dispatch({ type: CART_UPDATE_ITEM_REQUEST });
  try {
    const { data } = await api.put(`/api/v1/cart/${cartItemId}`, { quantity });
    dispatch({ type: CART_UPDATE_ITEM_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: CART_UPDATE_ITEM_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const removeCartItem = (cartItemId) => async (dispatch) => {
  dispatch({ type: CART_REMOVE_ITEM_REQUEST });
  try {
    await api.delete(`/api/v1/cart/${cartItemId}`);
    dispatch({ type: CART_REMOVE_ITEM_SUCCESS, payload: { cartItemId } });
  } catch (error) {
    dispatch({
      type: CART_REMOVE_ITEM_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const clearCart = () => ({ type: CART_CLEAR });