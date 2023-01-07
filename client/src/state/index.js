import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: []
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        /* THE mode IS ALTERNATIVELY SET BASED ON CLICK [in "scenes/navbar/index.jsx"] */
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        /* THE user(object) AND THE token IS RECIEVED ONCE THE USER HAS LOGGED IN 
           AND NOW THIS user and THE token WILL BE USED THROUGHOUT THE APPLICATION [in "scenes/loginPage/form.jsx"] */
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        /* THE user AND token IS SET TO null BASED ON CLICK [in "scenes/navbar/index.jsx"] */
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        /* SETTING THE data(object) AS friends FROM THE API CALL IN state [in "scenes/widgets/FriendListWidget.jsx" */
        setFriends: (state, action) => {
            if(state.user){
                state.user.friends = action.payload.friends;
            } else {
                console.error("User friends are non-existent");
            }
        },
        /* SETTING THE posts(object) FROM THE API CALL IN state [in "scenes/widgets/MyPostWidget.jsx" and "scenes/widgets/PostsWidget.jsx"] */
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        /* SETTING THE updatedPost(object) AS post WHEN IT IS LIKED, FROM THE API CALL IN state [in "scenes/widgets/PostWidget.jsx"] */
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if( post._id === action.payload.post._id ) return action.payload.post;
                return post;
            })
            state.posts = updatedPosts;
        }
    }
})

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } = authSlice.actions;
export default authSlice.reducer;