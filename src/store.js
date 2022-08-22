import {configureStore} from '@reduxjs/toolkit';
import userReducer from './reducers/user.js';
import articleReducer from './reducers/articles';
import walletReducer from './reducers/wallet';


export const store = configureStore({
    reducer: {
       user : userReducer,
       article: articleReducer,
       wallet: walletReducer
    },
})