import { toast } from "react-toastify";
import { api } from "../../config/apiConfig";
import {
    ADD_ITEM_TO_WISHLIST_FAILURE, ADD_ITEM_TO_WISHLIST_REQUEST, ADD_ITEM_TO_WISHLIST_SUCCESS,
    GET_WISHLIST_FAILURE, GET_WISHLIST_REQUEST, GET_WISHLIST_SUCCESS,
    REMOVE_ITEM_FROM_WISHLIST_FAILURE, REMOVE_ITEM_FROM_WISHLIST_REQUEST, REMOVE_ITEM_FROM_WISHLIST_SUCCESS
} from "./Types";

export const getWishlist = () => async (dispatch) => {
    dispatch({ type: GET_WISHLIST_REQUEST });
    try {
        const { data } = await api.get("/api/v1/wishlist");
        dispatch({ type: GET_WISHLIST_SUCCESS, payload: data.data });
    } catch (error) {
        dispatch({ type: GET_WISHLIST_FAILURE, payload: error.message });
    }
};

export const addItemToWishlist = (productId) => async (dispatch) => {
    dispatch({ type: ADD_ITEM_TO_WISHLIST_REQUEST });
    try {
        const { data } = await api.post("/api/v1/wishlist/add", { productId });
        dispatch({ type: ADD_ITEM_TO_WISHLIST_SUCCESS, payload: data.data });
        toast.success("Added to Wishlist!");
    } catch (error) {
        dispatch({ type: ADD_ITEM_TO_WISHLIST_FAILURE, payload: error.message });
        toast.error(error.response?.data?.message || "Failed to add to wishlist");
    }
};

export const removeItemFromWishlist = (productId) => async (dispatch) => {
    dispatch({ type: REMOVE_ITEM_FROM_WISHLIST_REQUEST });
    try {
        const { data } = await api.delete(`/api/v1/wishlist/remove/${productId}`);
        dispatch({ type: REMOVE_ITEM_FROM_WISHLIST_SUCCESS, payload: data.data });
        toast.success("Removed from Wishlist!");
    } catch (error) {
        dispatch({ type: REMOVE_ITEM_FROM_WISHLIST_FAILURE, payload: error.message });
        toast.error(error.response?.data?.message || "Failed to remove from wishlist");
    }
};
