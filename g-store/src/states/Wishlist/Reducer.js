import {
    ADD_ITEM_TO_WISHLIST_FAILURE, ADD_ITEM_TO_WISHLIST_REQUEST, ADD_ITEM_TO_WISHLIST_SUCCESS,
    GET_WISHLIST_FAILURE, GET_WISHLIST_REQUEST, GET_WISHLIST_SUCCESS,
    REMOVE_ITEM_FROM_WISHLIST_FAILURE, REMOVE_ITEM_FROM_WISHLIST_REQUEST, REMOVE_ITEM_FROM_WISHLIST_SUCCESS
} from "./Types";

const initialState = {
    wishlist: null,
    loading: false,
    error: null,
};

const wishlistReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_WISHLIST_REQUEST:
        case ADD_ITEM_TO_WISHLIST_REQUEST:
        case REMOVE_ITEM_FROM_WISHLIST_REQUEST:
            return { ...state, loading: true, error: null };

        case GET_WISHLIST_SUCCESS:
        case ADD_ITEM_TO_WISHLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                wishlist: {
                    wishlistItems: action.payload || []
                }
            };

        case REMOVE_ITEM_FROM_WISHLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                wishlist: {
                    wishlistItems: action.payload || []
                }
            };

        case GET_WISHLIST_FAILURE:
        case ADD_ITEM_TO_WISHLIST_FAILURE:
        case REMOVE_ITEM_FROM_WISHLIST_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default wishlistReducer;
