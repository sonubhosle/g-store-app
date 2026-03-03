import { api } from '../../config/apiConfig';
import {
    FETCH_REVIEWS_REQUEST, FETCH_REVIEWS_SUCCESS, FETCH_REVIEWS_FAILED,
    CREATE_REVIEW_REQUEST, CREATE_REVIEW_SUCCESS, CREATE_REVIEW_FAILED,
    UPDATE_REVIEW_REQUEST, UPDATE_REVIEW_SUCCESS, UPDATE_REVIEW_FAILED,
    DELETE_REVIEW_REQUEST, DELETE_REVIEW_SUCCESS, DELETE_REVIEW_FAILED,
} from './Types';

export const fetchReviews = (productId) => async (dispatch) => {
    dispatch({ type: FETCH_REVIEWS_REQUEST });
    try {
        const { data } = await api.get(`/api/v1/reviews/all/${productId}`);
        dispatch({ type: FETCH_REVIEWS_SUCCESS, payload: data.reviews });
    } catch (err) {
        dispatch({ type: FETCH_REVIEWS_FAILED, payload: err.response?.data?.error || err.message });
    }
};

export const createReview = (productId, rating, description) => async (dispatch) => {
    dispatch({ type: CREATE_REVIEW_REQUEST });
    try {
        const { data } = await api.post('/api/v1/review/create', { productId, rating, description });
        dispatch({ type: CREATE_REVIEW_SUCCESS, payload: data.review });
    } catch (err) {
        dispatch({ type: CREATE_REVIEW_FAILED, payload: err.response?.data?.error || err.message });
        throw err;
    }
};

export const updateReview = (reviewId, description, rating) => async (dispatch) => {
    dispatch({ type: UPDATE_REVIEW_REQUEST });
    try {
        const { data } = await api.put(`/api/v1/review/update/${reviewId}`, { description, rating });
        dispatch({ type: UPDATE_REVIEW_SUCCESS, payload: data.review });
    } catch (err) {
        dispatch({ type: UPDATE_REVIEW_FAILED, payload: err.response?.data?.error || err.message });
        throw err;
    }
};

export const deleteReview = (reviewId) => async (dispatch) => {
    dispatch({ type: DELETE_REVIEW_REQUEST });
    try {
        await api.delete(`/api/v1/review/delete/${reviewId}`);
        dispatch({ type: DELETE_REVIEW_SUCCESS, payload: reviewId });
    } catch (err) {
        dispatch({ type: DELETE_REVIEW_FAILED, payload: err.response?.data?.error || err.message });
        throw err;
    }
};
