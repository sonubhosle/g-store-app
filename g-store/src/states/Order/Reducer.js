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

const initialState = {
    orders: [],
    order: null,
    loading: false,
    error: null,
    paymentVerified: false,
    orderHistoryItems: [],
};

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_ORDER_REQUEST:
        case GET_ORDER_BY_ID_REQUEST:
        case GET_ORDER_HISTORY_REQUEST:
        case GET_ALL_ORDERS_REQUEST:
        case UPDATE_ORDER_STATUS_REQUEST:
        case DELETE_ORDER_REQUEST:
        case CANCEL_ORDER_REQUEST:
        case GET_ORDER_ITEM_HISTORY_REQUEST:
        case DELETE_ORDER_ITEM_HISTORY_REQUEST:
            return { ...state, loading: true, error: null };

        case CREATE_ORDER_SUCCESS:
            return { ...state, loading: false, order: action.payload };

        case GET_ORDER_BY_ID_SUCCESS:
            return { ...state, loading: false, order: action.payload };

        case GET_ORDER_HISTORY_SUCCESS:
        case GET_ALL_ORDERS_SUCCESS:
            return { ...state, loading: false, orders: action.payload };

        case GET_ORDER_ITEM_HISTORY_SUCCESS:
            return { ...state, loading: false, orderHistoryItems: action.payload };

        case CANCEL_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: state.orders.map((order) =>
                    order._id === action.payload._id ? action.payload : order
                ),
                order: action.payload
            };

        case DELETE_ORDER_ITEM_HISTORY_SUCCESS:
            return {
                ...state,
                loading: false,
                orderHistoryItems: state.orderHistoryItems.filter((item) => item._id !== action.payload)
            };

        case UPDATE_ORDER_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: state.orders.map((order) =>
                    order._id === action.payload._id ? action.payload : order
                ),
                order: action.payload
            };

        case DELETE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: state.orders.filter((order) => order._id !== action.payload),
            };
        case GET_ORDER_BY_ID_FAILURE:
        case GET_ORDER_HISTORY_FAILURE:
        case CREATE_ORDER_FAILURE:
        case GET_ALL_ORDERS_FAILURE:
        case UPDATE_ORDER_STATUS_FAILURE:
        case DELETE_ORDER_FAILURE:
        case VERIFY_PAYMENT_FAILURE:
        case CANCEL_ORDER_FAILURE:
        case GET_ORDER_ITEM_HISTORY_FAILURE:
        case DELETE_ORDER_ITEM_HISTORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case VERIFY_PAYMENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case VERIFY_PAYMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                paymentVerified: true,
                order: action.payload
            };
        default:
            return state;
    }
};

export default orderReducer;
