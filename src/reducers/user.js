import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn : false,
    id:'',
    email:'',
    token:'',
    aiPoints:'',
    tokenReward : 0.0,
    verified: false,
    referralID:'',
    memberType:''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        loadUser : (state,action) =>{
            state.loggedIn = true;
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.token = action.payload.token;
            state.tokenReward = action.payload.tokens;
            state.aiPoints = action.payload.aiPoints;
            state.referralID = action.payload.referralID;
            state.memberType = action.payload.memberType;
            localStorage.setItem("token",action.payload.token);
        },
        updateTokens : (state, action) => {
            state.aiPoints = action.payload
        }
    }
});

export const {loadUser, updateTokens} = userSlice.actions;
export default userSlice.reducer;