import { api } from '../../config/apiConfig';
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


export const registerUser = (formData) => async (dispatch) => {
    dispatch({ type: REGISTER_USER_REQUEST });
    try {
        const isFormData = formData instanceof FormData;

        const { data } = await api.post('/api/v1/auth/signup', formData, {
            headers: isFormData
                ? { 'Content-Type': 'multipart/form-data' }
                : { 'Content-Type': 'application/json' },
        });

        if (data.jwt) {
            localStorage.setItem('jwt', data.jwt);
        }

        dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user ?? data });
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message;
        dispatch({ type: REGISTER_USER_FAILED, payload: message });
    }
};


export const loginUser = (credentials) => async (dispatch) => {
    dispatch({ type: LOGIN_USER_REQUEST });
    try {
        const { data } = await api.post('/api/v1/auth/login', credentials);

        if (data.jwt) {
            localStorage.setItem('jwt', data.jwt);
        }

        dispatch({ type: LOGIN_USER_SUCCESS, payload: data.user ?? data });
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message;
        dispatch({ type: LOGIN_USER_FAILED, payload: message });
    }
};

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('jwt');
    dispatch({ type: LOGOUT_USER });
};


export const getUserProfile = () => async (dispatch) => {
    dispatch({ type: GET_USER_PROFILE_REQUEST });
    try {
        const { data } = await api.get('/api/v1/user/profile');
        dispatch({ type: GET_USER_PROFILE_SUCCESS, payload: data });
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message;
        dispatch({ type: GET_USER_PROFILE_FAILED, payload: message });
    }
};



export const updateUserProfile = (updateData) => async (dispatch) => {
    dispatch({ type: UPDATE_USER_PROFILE_REQUEST });
    try {
        // Check if updateData is FormData
        const isFormData = updateData instanceof FormData;

        const { data } = await api.put('/api/v1/user/update', updateData, {
            headers: isFormData
                ? { 'Content-Type': 'multipart/form-data' }
                : { 'Content-Type': 'application/json' },
        });

        dispatch({ type: UPDATE_USER_PROFILE_SUCCESS, payload: data.user });
        return { success: true, data };
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message;
        dispatch({ type: UPDATE_USER_PROFILE_FAILED, payload: message });
        throw error;
    }
};


export const forgotPassword = (email) => async (dispatch) => {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });
    try {
        const { data } = await api.post('/api/v1/auth/forgot-password', { email });
        dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message ?? 'Reset email sent' });
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message;
        dispatch({ type: FORGOT_PASSWORD_FAILED, payload: message });
    }
};


export const getAllUsers = () => async (dispatch) => {
    dispatch({ type: GET_ALL_USERS_REQUEST });
    try {
        const { data } = await api.get('/api/v1/admin/users');
        dispatch({ type: GET_ALL_USERS_SUCCESS, payload: data });
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message;
        dispatch({ type: GET_ALL_USERS_FAILED, payload: message });
    }
};

export const deleteUser = (userId) => async (dispatch) => {
    dispatch({ type: DELETE_USER_REQUEST });
    try {
        await api.delete(`/api/v1/admin/users/${userId}`);
        dispatch({ type: DELETE_USER_SUCCESS, payload: userId });
        return { success: true };
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message;
        dispatch({ type: DELETE_USER_FAILED, payload: message });
        throw error;
    }
};


export const resetPassword = (token, newPassword, confirmPassword) => async (dispatch) => {
    dispatch({ type: RESET_PASSWORD_REQUEST });
    try {
        const { data } = await api.post('/api/v1/auth/reset-password', {
            token,
            newPassword,
            confirmPassword,
        });
        dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.message ?? 'Password reset successful' });
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message;
        dispatch({ type: RESET_PASSWORD_FAILED, payload: message });
    }
};


export const restoreAuth = () => async (dispatch) => {
    dispatch({ type: LOGIN_USER_REQUEST });

    try {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
            dispatch({ type: LOGIN_USER_FAILED, payload: 'No saved session' });
            return;
        }

        const response = await api.get('/api/v1/user/profile', {
            headers: { Authorization: `Bearer ${jwt}` },
        });

        const userData = response.data;

        const completeUser = {
            jwt: jwt,
            message: 'Session restored',
            ...userData
        };

        dispatch({ type: LOGIN_USER_SUCCESS, payload: completeUser });

    } catch (error) {
        localStorage.removeItem("jwt");
        dispatch({ type: LOGOUT_USER });
    }
};

export const getUserAddresses = () => async (dispatch) => {
    dispatch({ type: GET_USER_ADDRESSES_REQUEST });
    try {
        const { data } = await api.get('/api/v1/user/addresses');
        dispatch({ type: GET_USER_ADDRESSES_SUCCESS, payload: data.data });
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message;
        dispatch({ type: GET_USER_ADDRESSES_FAILED, payload: message });
    }
};