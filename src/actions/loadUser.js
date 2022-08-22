import {store} from "../store";
import axios from "axios";
import {loadUser} from "../reducers/user";

export const getUserDetails = async (token) => {
  if(!token){
    return;
  }
    try {
      if (token) {
        axios.defaults.headers.common["x-auth-token"] = token;
      }

      const res = await axios.get(
        `https://technologydao.herokuapp.com/api/v1/users/getUserDetails`
      );

      const loader = {
        id: res.data._id,
        email: res.data.email,
        token,
        tokens: res.data.tokens,
        verified: res.data.verified,
        referralID: res.data.referralCode,
        aiPoints: res.data.aiPoints,
        memberType: res.data.memberType
      };


    
      store.dispatch(loadUser(loader));
    } catch (error) {
      console.log(error);
    }
  };
