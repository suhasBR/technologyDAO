import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    articles:[],
    currentArticle:{}
}

export const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers:{
        loadArticles: (state,action) => {
            state.articles = action.payload;
        }
    }
});

export const {loadArticles} = articleSlice.actions;
export default articleSlice.reducer;