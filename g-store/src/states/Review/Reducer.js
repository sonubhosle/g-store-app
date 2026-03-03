import {
    FETCH_REVIEWS_REQUEST, FETCH_REVIEWS_SUCCESS, FETCH_REVIEWS_FAILED,
    CREATE_REVIEW_REQUEST, CREATE_REVIEW_SUCCESS, CREATE_REVIEW_FAILED,
    UPDATE_REVIEW_REQUEST, UPDATE_REVIEW_SUCCESS, UPDATE_REVIEW_FAILED,
    DELETE_REVIEW_REQUEST, DELETE_REVIEW_SUCCESS, DELETE_REVIEW_FAILED,
} from './Types';

const initialState = {
    reviews: [],
    loading: false,
    submitting: false,
    error: null,
};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_REVIEWS_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_REVIEWS_SUCCESS:
            return { ...state, loading: false, reviews: action.payload };
        case FETCH_REVIEWS_FAILED:
            return { ...state, loading: false, error: action.payload };

        case CREATE_REVIEW_REQUEST:
        case UPDATE_REVIEW_REQUEST:
        case DELETE_REVIEW_REQUEST:
            return { ...state, submitting: true, error: null };

        case CREATE_REVIEW_SUCCESS:
            return {
                ...state,
                submitting: false,
                reviews: [action.payload, ...state.reviews],
            };
        case UPDATE_REVIEW_SUCCESS:
            return {
                ...state,
                submitting: false,
                reviews: state.reviews.map((r) =>
                    r._id === action.payload._id ? action.payload : r
                ),
            };
        case DELETE_REVIEW_SUCCESS:
            return {
                ...state,
                submitting: false,
                reviews: state.reviews.filter((r) => r._id !== action.payload),
            };

        case CREATE_REVIEW_FAILED:
        case UPDATE_REVIEW_FAILED:
        case DELETE_REVIEW_FAILED:
            return { ...state, submitting: false, error: action.payload };

        default:
            return state;
    }
};

export default reviewReducer;
