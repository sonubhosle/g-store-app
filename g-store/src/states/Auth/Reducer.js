import {
    REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, REGISTER_USER_FAILED,
    LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILED,
    LOGOUT_USER,
    GET_USER_PROFILE_REQUEST, GET_USER_PROFILE_SUCCESS, GET_USER_PROFILE_FAILED,
    UPDATE_USER_PROFILE_REQUEST, UPDATE_USER_PROFILE_SUCCESS, UPDATE_USER_PROFILE_FAILED,
    GET_ALL_USERS_REQUEST, GET_ALL_USERS_SUCCESS, GET_ALL_USERS_FAILED,
    FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAILED,
    RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILED,
    GET_USER_ADDRESSES_REQUEST, GET_USER_ADDRESSES_SUCCESS, GET_USER_ADDRESSES_FAILED,
    DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAILED,
} from './Types';

const initialState = {
    user: null,
    users: [],
    jwt: localStorage.getItem('jwt') || null,
    loading: false,
    error: null,
    forgotPasswordMessage: null,
    resetPasswordMessage: null,
    addresses: [],
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {

        /* -------- REGISTER -------- */
        case REGISTER_USER_REQUEST:
            return { ...state, loading: true, error: null };

        case REGISTER_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: null };

        case REGISTER_USER_FAILED:
            return { ...state, loading: false, error: action.payload };

        /* -------- LOGIN -------- */
        case LOGIN_USER_REQUEST:
            return { ...state, loading: true, error: null };

        case LOGIN_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload,
                jwt: localStorage.getItem('jwt'),
                error: null,
            };

        case LOGIN_USER_FAILED:
            return { ...state, loading: false, error: action.payload };

        /* -------- LOGOUT -------- */
        case LOGOUT_USER:
            return { ...initialState, jwt: null };

        /* -------- GET PROFILE -------- */
        case GET_USER_PROFILE_REQUEST:
            return { ...state, loading: true, error: null };

        case GET_USER_PROFILE_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: null };

        case GET_USER_PROFILE_FAILED:
            return { ...state, loading: false, error: action.payload };

        /* -------- UPDATE PROFILE -------- */
        case UPDATE_USER_PROFILE_REQUEST:
            return { ...state, loading: true, error: null };

        case UPDATE_USER_PROFILE_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: null };

        case UPDATE_USER_PROFILE_FAILED:
            return { ...state, loading: false, error: action.payload };

        /* -------- GET ALL USERS (ADMIN) -------- */
        case GET_ALL_USERS_REQUEST:
            return { ...state, loading: true, error: null };

        case GET_ALL_USERS_SUCCESS:
            return { ...state, loading: false, users: action.payload, error: null };

        case GET_ALL_USERS_FAILED:
            return { ...state, loading: false, error: action.payload };

        /* -------- DELETE USER (ADMIN) -------- */
        case DELETE_USER_REQUEST:
            return { ...state, loading: true, error: null };

        case DELETE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                users: state.users.filter((user) => user._id !== action.payload),
                error: null
            };

        case DELETE_USER_FAILED:
            return { ...state, loading: false, error: action.payload };

        /* -------- FORGOT PASSWORD -------- */
        case FORGOT_PASSWORD_REQUEST:
            return { ...state, loading: true, error: null, forgotPasswordMessage: null };

        case FORGOT_PASSWORD_SUCCESS:
            return { ...state, loading: false, forgotPasswordMessage: action.payload };

        case FORGOT_PASSWORD_FAILED:
            return { ...state, loading: false, error: action.payload };

        /* -------- RESET PASSWORD -------- */
        case RESET_PASSWORD_REQUEST:
            return { ...state, loading: true, error: null, resetPasswordMessage: null };

        case RESET_PASSWORD_SUCCESS:
            return { ...state, loading: false, resetPasswordMessage: action.payload };

        case RESET_PASSWORD_FAILED:
            return { ...state, loading: false, error: action.payload };

        /* -------- GET ADDRESSES -------- */
        case GET_USER_ADDRESSES_REQUEST:
            return { ...state, loading: true, error: null };

        case GET_USER_ADDRESSES_SUCCESS:
            return { ...state, loading: false, addresses: action.payload, error: null };

        case GET_USER_ADDRESSES_FAILED:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default authReducer;