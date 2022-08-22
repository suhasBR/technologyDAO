import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    openWallet: true,
    signpage: false,
    signamount: 0,
}

export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        walletopen : (state,action) => {
            state.openWallet = true
        },
        signpageopen: (state,action) => {
            state.signpage = true;
            state.signamount=action.payload;
        },
        signpageclose: (state,action) => {
            state.signpage = false;
            state.signamount = 0;
        },
        walletclose : (state,action) => {
            state.openWallet = false;
        }
    }
});


export const {walletopen,walletclose,signpageopen,signpageclose} = walletSlice.actions;

export default walletSlice.reducer;