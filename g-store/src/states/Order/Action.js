import { api } from "../../config/apiConfig";
import {
    CREATE_ORDER_FAILURE, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS,
    GET_ORDER_BY_ID_FAILURE, GET_ORDER_BY_ID_REQUEST, GET_ORDER_BY_ID_SUCCESS,
    GET_ORDER_HISTORY_FAILURE, GET_ORDER_HISTORY_REQUEST, GET_ORDER_HISTORY_SUCCESS,
    GET_ALL_ORDERS_FAILURE, GET_ALL_ORDERS_REQUEST, GET_ALL_ORDERS_SUCCESS,
    UPDATE_ORDER_STATUS_FAILURE, UPDATE_ORDER_STATUS_REQUEST, UPDATE_ORDER_STATUS_SUCCESS,
    DELETE_ORDER_FAILURE, DELETE_ORDER_REQUEST, DELETE_ORDER_SUCCESS,
    VERIFY_PAYMENT_REQUEST, VERIFY_PAYMENT_SUCCESS, VERIFY_PAYMENT_FAILURE,
    CANCEL_ORDER_REQUEST, CANCEL_ORDER_SUCCESS, CANCEL_ORDER_FAILURE,
    GET_ORDER_ITEM_HISTORY_REQUEST, GET_ORDER_ITEM_HISTORY_SUCCESS, GET_ORDER_ITEM_HISTORY_FAILURE,
    DELETE_ORDER_ITEM_HISTORY_REQUEST, DELETE_ORDER_ITEM_HISTORY_SUCCESS, DELETE_ORDER_ITEM_HISTORY_FAILURE
} from "./Types";

export const createOrder = (reqData) => async (dispatch) => {
    dispatch({ type: CREATE_ORDER_REQUEST });
    try {
        const { data } = await api.post("/api/v1/user/order/create", reqData);
        dispatch({ type: CREATE_ORDER_SUCCESS, payload: data.data });
    } catch (error) {
        dispatch({ type: CREATE_ORDER_FAILURE, payload: error.message });
    }
};

export const getOrderById = (orderId) => async (dispatch) => {
    dispatch({ type: GET_ORDER_BY_ID_REQUEST });
    try {
        const { data } = await api.get(`/api/v1/order/${orderId}`);
        dispatch({ type: GET_ORDER_BY_ID_SUCCESS, payload: data.data });
    } catch (error) {
        dispatch({ type: GET_ORDER_BY_ID_FAILURE, payload: error.message });
    }
};

export const getOrderHistory = () => async (dispatch) => {
    dispatch({ type: GET_ORDER_HISTORY_REQUEST });
    try {
        const { data } = await api.get("/api/v1/user/orders");
        dispatch({ type: GET_ORDER_HISTORY_SUCCESS, payload: data.data });
    } catch (error) {
        dispatch({ type: GET_ORDER_HISTORY_FAILURE, payload: error.message });
    }
};

// Admin Actions
export const getAllOrders = () => async (dispatch) => {
    dispatch({ type: GET_ALL_ORDERS_REQUEST });
    try {
        const { data } = await api.get("/api/v1/admin/orders");
        dispatch({ type: GET_ALL_ORDERS_SUCCESS, payload: data.data });
    } catch (error) {
        dispatch({ type: GET_ALL_ORDERS_FAILURE, payload: error.message });
    }
};

export const updateOrderStatus = (orderId, status) => async (dispatch) => {
    dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });
    try {
        const { data } = await api.put(`/api/v1/order/status/${orderId}`, { status });
        dispatch({ type: UPDATE_ORDER_STATUS_SUCCESS, payload: data.data });
        return data.data;
    } catch (error) {
        dispatch({ type: UPDATE_ORDER_STATUS_FAILURE, payload: error.message });
        throw error;
    }
};

export const deleteOrder = (orderId) => async (dispatch) => {
    dispatch({ type: DELETE_ORDER_REQUEST });
    try {
        await api.delete(`/api/v1/order/delete/${orderId}`);
        dispatch({ type: DELETE_ORDER_SUCCESS, payload: orderId });
    } catch (error) {
        dispatch({ type: DELETE_ORDER_FAILURE, payload: error.message });
    }
};

export const updatePaymentInformation = (reqData) => async (dispatch) => {
    try {
        const { data } = await api.post(`/api/v1/create/payment/${reqData.orderId}`);
        if (data.data.payment_link_url) {
            window.location.href = data.data.payment_link_url;
        }
    } catch (error) {
        console.log("payment error", error);
    }
};

export const verifyPayment = (reqData) => async (dispatch) => {
    dispatch({ type: VERIFY_PAYMENT_REQUEST });
    try {
        const { data } = await api.get(`/api/v1/callback?payment_id=${reqData.paymentId}&order_id=${reqData.orderId}`);
        dispatch({ type: VERIFY_PAYMENT_SUCCESS, payload: data });
        return data;
    } catch (error) {
        dispatch({ type: VERIFY_PAYMENT_FAILURE, payload: error.message });
        throw error;
    }
};

export const cancelOrder = (orderId) => async (dispatch) => {
    dispatch({ type: CANCEL_ORDER_REQUEST });
    try {
        const { data } = await api.put(`/api/v1/user/order/cancel/${orderId}`);
        dispatch({ type: CANCEL_ORDER_SUCCESS, payload: data.data });
    } catch (error) {
        dispatch({ type: CANCEL_ORDER_FAILURE, payload: error.message });
    }
};

export const getOrderItemHistory = () => async (dispatch) => {
    dispatch({ type: GET_ORDER_ITEM_HISTORY_REQUEST });
    try {
        const { data } = await api.get("/api/v1/orders/history");
        dispatch({ type: GET_ORDER_ITEM_HISTORY_SUCCESS, payload: data.data });
    } catch (error) {
        dispatch({ type: GET_ORDER_ITEM_HISTORY_FAILURE, payload: error.message });
    }
};

export const deleteOrderItemHistory = (itemId) => async (dispatch) => {
    dispatch({ type: DELETE_ORDER_ITEM_HISTORY_REQUEST });
    try {
        await api.delete(`/api/v1/order/history/${itemId}`);
        dispatch({ type: DELETE_ORDER_ITEM_HISTORY_SUCCESS, payload: itemId });
    } catch (error) {
        dispatch({ type: DELETE_ORDER_ITEM_HISTORY_FAILURE, payload: error.message });
    }
};
