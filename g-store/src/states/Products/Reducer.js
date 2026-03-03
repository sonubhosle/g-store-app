import {
    CREATE_PRODUCT_REQUEST, CREATE_PRODUCT_SUCCESS, CREATE_PRODUCT_FAILED,
    UPDATE_PRODUCT_REQUEST, UPDATE_PRODUCT_SUCCESS, UPDATE_PRODUCT_FAILED,
    DELETE_PRODUCT_REQUEST, DELETE_PRODUCT_SUCCESS, DELETE_PRODUCT_FAILED,
    GET_ALL_PRODUCTS_REQUEST, GET_ALL_PRODUCTS_SUCCESS, GET_ALL_PRODUCTS_FAILED,
    GET_PRODUCT_BY_ID_REQUEST, GET_PRODUCT_BY_ID_SUCCESS, GET_PRODUCT_BY_ID_FAILED,
    GET_HOT_DEALS_REQUEST, GET_HOT_DEALS_SUCCESS, GET_HOT_DEALS_FAILED,
    GET_PRODUCTS_BY_CATEGORY_REQUEST, GET_PRODUCTS_BY_CATEGORY_SUCCESS, GET_PRODUCTS_BY_CATEGORY_FAILED,
    GET_RELATED_PRODUCTS_REQUEST, GET_RELATED_PRODUCTS_SUCCESS, GET_RELATED_PRODUCTS_FAILED,
    CLEAR_PRODUCT_ERRORS,
} from './Types';

const initialState = {
    products: [],             
    product: null,            
    hotDeals: [],             
    categoryProducts: [],     
    relatedProducts: [],      
    loading: false,
    error: null,
    createSuccess: false,     
    updateSuccess: false,     
    deleteSuccess: false,     
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {

        case CREATE_PRODUCT_REQUEST:
            return { ...state, loading: true, error: null, createSuccess: false };

        case CREATE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: [action.payload, ...state.products],
                createSuccess: true,
                error: null,
            };

        case CREATE_PRODUCT_FAILED:
            return { ...state, loading: false, error: action.payload, createSuccess: false };

        case UPDATE_PRODUCT_REQUEST:
            return { ...state, loading: true, error: null, updateSuccess: false };

        case UPDATE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: state.products.map((p) =>
                    p._id === action.payload._id ? action.payload : p
                ),
                product: action.payload,
                updateSuccess: true,
                error: null,
            };

        case UPDATE_PRODUCT_FAILED:
            return { ...state, loading: false, error: action.payload, updateSuccess: false };

        case DELETE_PRODUCT_REQUEST:
            return { ...state, loading: true, error: null, deleteSuccess: false };

        case DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: state.products.filter((p) => p._id !== action.payload),
                deleteSuccess: true,
                error: null,
            };

        case DELETE_PRODUCT_FAILED:
            return { ...state, loading: false, error: action.payload, deleteSuccess: false };

        case GET_ALL_PRODUCTS_REQUEST:
            return { ...state, loading: true, error: null };

        case GET_ALL_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload,
                error: null,
            };

        case GET_ALL_PRODUCTS_FAILED:
            return { ...state, loading: false, error: action.payload };

        case GET_PRODUCT_BY_ID_REQUEST:
            return { ...state, loading: true, error: null, product: null };

        case GET_PRODUCT_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                product: action.payload,
                error: null,
            };

        case GET_PRODUCT_BY_ID_FAILED:
            return { ...state, loading: false, error: action.payload, product: null };

        case GET_HOT_DEALS_REQUEST:
            return { ...state, loading: true, error: null };

        case GET_HOT_DEALS_SUCCESS:
            return {
                ...state,
                loading: false,
                hotDeals: action.payload,
                error: null,
            };

        case GET_HOT_DEALS_FAILED:
            return { ...state, loading: false, error: action.payload };

        case GET_PRODUCTS_BY_CATEGORY_REQUEST:
            return { ...state, loading: true, error: null };

        case GET_PRODUCTS_BY_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categoryProducts: action.payload,
                error: null,
            };

        case GET_PRODUCTS_BY_CATEGORY_FAILED:
            return { ...state, loading: false, error: action.payload };

        case GET_RELATED_PRODUCTS_REQUEST:
            return { ...state, loading: true, error: null };

        case GET_RELATED_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                relatedProducts: action.payload,
                error: null,
            };

        case GET_RELATED_PRODUCTS_FAILED:
            return { ...state, loading: false, error: action.payload };

        case CLEAR_PRODUCT_ERRORS:
            return { ...state, error: null };

        default:
            return state;
    }
};

export default productReducer;
