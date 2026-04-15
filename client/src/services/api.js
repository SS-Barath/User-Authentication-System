import api from "../api/axiosInstance";

export const signup = (userData) => {
    return api.post("/auth/signup",userData);
};

export const signin = (userData) => {
    return api.post("/auth/signin", userData);
};

export const forgotPassword = (email) => {
    return api.post('/auth/forgot-password', { email });
}

export const resetPassword = (token, password) => {
    return api.post('/auth/reset-password', { token, password });
}