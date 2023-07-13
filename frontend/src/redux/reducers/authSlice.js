import { createSlice } from '@reduxjs/toolkit'
import { userLogin, userLogout, authCheck } from '../actions/authActions';
import { removeToken, getStoredToken } from '../actions/authActions';

// initialize user token from local storage
const init_userToken = localStorage.getItem('auth_token') ? localStorage.getItem('auth_token') : null

const initialState = {
    initLoading: false,
    loading: false,
    userToken: init_userToken,
    userInfo: null,
    error: null
};



// This creates authReducer function -- The function responsible for updating the 'auth' state in the store' --
const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        // logout: state =>
        // {
        //     console.log('token removed');
        //     state.userToken = null;
        //     state.userInfo = null
        //     removeToken();

        // },
        // login: (state, action) =>
        // {
        //     console.log('login action:, ', action);
        //     state.userToken = action.payload.token
        //     state.userInfo.userName = action.payload.username
        //     state.userInfo.role = action.payload.isAdmin ? 1 : 0
        // }

    },
    extraReducers: {
        // login user
        [userLogin.pending]: (state) =>
        {
            state.loading = true
            state.error = ''
        },
        [userLogin.fulfilled]: (state, { payload }) =>
        {
            console.log('fulfilled');
            state.loading = false
            state.userInfo = {
                userName: payload.username,
                isAdmin: payload.isAdmin
            }
            state.userToken = payload.token
            state.error = ''
        },
        [userLogin.rejected]: (state, { payload }) =>
        {
            state.loading = false
            state.error = payload
        },

        // auth check
        [authCheck.pending]: (state) =>
        {
            state.loading = true
            state.initLoading = true
        },
        [authCheck.fulfilled]: (state, { payload }) =>
        {
            state.loading = false
            state.initLoading = false
            state.userInfo = {
                userName: payload.username,
                isAdmin: payload.isAdmin
            }
            state.userToken = getStoredToken()
        },
        [authCheck.rejected]: (state, { payload }) =>
        {
            state.loading = false
            state.initLoading = false
        },

        // logout user
        [userLogout.pending]: (state) =>
        {
            state.loading = true
            state.error = ''
        },
        [userLogout.fulfilled]: (state, { payload }) =>
        {
            console.log('logout fulfilled');
            state.loading = false
            state.userToken = null;
            state.userInfo = null
            state.error = ''
        },
        [userLogout.rejected]: (state, { payload }) =>
        {
            state.loading = false
            state.error = payload
        }
    }
})


// When we write the postAdded reducer function, createSlice will automatically 
// generate an "action creator" function with the same name. 
// We can export that action creator and use it in our UI components to dispatch the action when the user clicks "Save Post".
export const { logout } = authSlice.actions
export default authSlice.reducer;