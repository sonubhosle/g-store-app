import { api } from '../../config/apiConfig';
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


export const createProduct = (productData) => async (dispatch) => {
    dispatch({ type: CREATE_PRODUCT_REQUEST });
    try {
        const formData = new FormData();
        
        Object.keys(productData).forEach((key) => {
            if (key !== 'images' && productData[key] !== null && productData[key] !== undefined) {
                formData.append(key, productData[key]);
            }
        });

        // Append images if provided
        if (productData.images && productData.images.length > 0) {
            productData.images.forEach((image) => {
                formData.append('images', image); // multer reads as req.files
            });
        }

        const { data } = await api.post('/api/v1/product/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        dispatch({ type: CREATE_PRODUCT_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({ type: CREATE_PRODUCT_FAILED, payload: message });
    }
};


export const updateProduct = (productId, productData) => async (dispatch) => {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });
    try {
        const formData = new FormData();
        
        Object.keys(productData).forEach((key) => {
            if (key !== 'images' && productData[key] !== null && productData[key] !== undefined) {
                formData.append(key, productData[key]);
            }
        });

        if (productData.images && productData.images.length > 0) {
            productData.images.forEach((image) => {
                formData.append('images', image);
            });
        }

        const { data } = await api.put(`/api/v1/product/update/${productId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({ type: UPDATE_PRODUCT_FAILED, payload: message });
    }
};


export const deleteProduct = (productId) => async (dispatch) => {
    dispatch({ type: DELETE_PRODUCT_REQUEST });
    try {
        const { data } = await api.delete(`/api/v1/product/delete/${productId}`);
        dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: productId });
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({ type: DELETE_PRODUCT_FAILED, payload: message });
    }
};

export const getAllProducts = (queryParams = {}) => async (dispatch) => {
    dispatch({ type: GET_ALL_PRODUCTS_REQUEST });
    try {
        const queryString = new URLSearchParams(queryParams).toString();
        const url = queryString ? `/api/v1/products/?${queryString}` : '/api/v1/products/';
        
        const { data } = await api.get(url);
        dispatch({ type: GET_ALL_PRODUCTS_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({ type: GET_ALL_PRODUCTS_FAILED, payload: message });
    }
};


export const getProductById = (productId) => async (dispatch) => {
    dispatch({ type: GET_PRODUCT_BY_ID_REQUEST });
    try {
        const { data } = await api.get(`/api/v1/product/${productId}`);
        dispatch({ type: GET_PRODUCT_BY_ID_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({ type: GET_PRODUCT_BY_ID_FAILED, payload: message });
    }
};

export const getHotDeals = () => async (dispatch) => {
    dispatch({ type: GET_HOT_DEALS_REQUEST });
    try {
        const { data } = await api.get('/api/v1/products/hot-deals');
        dispatch({ type: GET_HOT_DEALS_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({ type: GET_HOT_DEALS_FAILED, payload: message });
    }
};


export const getProductsByCategory = (category) => async (dispatch) => {
    dispatch({ type: GET_PRODUCTS_BY_CATEGORY_REQUEST });
    try {
        const { data } = await api.get(`/api/v1/products/category/${category}`);
        dispatch({ type: GET_PRODUCTS_BY_CATEGORY_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({ type: GET_PRODUCTS_BY_CATEGORY_FAILED, payload: message });
    }
};


export const getRelatedProducts = (productId) => async (dispatch) => {
    dispatch({ type: GET_RELATED_PRODUCTS_REQUEST });
    try {
        const { data } = await api.get(`/api/v1/products/${productId}/related`);
        dispatch({ type: GET_RELATED_PRODUCTS_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({ type: GET_RELATED_PRODUCTS_FAILED, payload: message });
    }
};


export const clearProductErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_PRODUCT_ERRORS });
};
