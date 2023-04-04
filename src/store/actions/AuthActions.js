import jwt_decode from "jwt-decode";
import { useSelector } from "react-redux";
import swal from "sweetalert";

import {
  formatError,
  getUserDetails,
  isAlreadyReferred,
  login,
  runLogoutTimer,
  savedetails,
  saveRef,
  saveTokenInLocalStorage,
  signUp,
} from "../../services/AuthService";

export const SIGNUP_CONFIRMED_ACTION = "[signup action] confirmed signup";
export const SIGNUP_FAILED_ACTION = "[signup action] failed signup";
export const LOGIN_CONFIRMED_ACTION = "[login action] confirmed login";
export const LOGIN_FAILED_ACTION = "[login action] failed login";
export const LOADING_TOGGLE_ACTION = "[Loading action] toggle loading";
export const LOGOUT_ACTION = "[Logout action] logout action";
export const CONNECTED_TO_METAMASK = "[Metamask action] connected to metamask";
export const CONNECTED_TO_Token = "[saveData action] connected to Token Data";
export const CONNECTED_TO_WALLET = "[Wallet action] connected to Wallet";
export const DETAILS_CONFIRMED_ACTION = "[details action] confirmed details";
export const DETAILS_FAILED_ACTION = "[details action] failed details";

export function saveSigner(signer, account, provider, isLoggedInFromMobile) {
  //save details in local storage
  savedetails(isLoggedInFromMobile);
  return {
    type: CONNECTED_TO_WALLET,
    payload: { signer, account, provider, isLoggedInFromMobile },
  };
}

export function signupAction(
  user_name,
  email,
  password,
  contact,
  referalAddress,
  navigate
) {
  return (dispatch) => {
    signUp(user_name, email, password, contact)
      .then((response) => {
        saveRef(response.data.user_id, referalAddress);
        dispatch(confirmedSignupAction(response.data));
        navigate("/login");
        //history.push('/dashboard');

        return response.data;
      })
      .catch((error) => {
        console.log(error);

        if (error?.response?.data?.details?.length > 0) {
          swal("Oops", error.response.data.details[0].message, "error", {
            button: "Try Again!",
          });
        } else {
          swal("Oops", error.response.data, "error", {
            button: "Try Again!",
          });
        }
        dispatch(signupFailedAction(""));
      });
  };
}

export function Logout(navigate) {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  navigate("/login");
  //history.push('/login');

  return {
    type: LOGOUT_ACTION,
  };
}

export function getUserDetailsConfirmedAction(userDetails) {
  return {
    type: DETAILS_CONFIRMED_ACTION,
    payload: userDetails,
  };
}

export function getUserDetailsFailedAction(error) {
  return {
    type: DETAILS_FAILED_ACTION,
    payload: error,
  };
}

export function loginAction(email, password, navigate) {
  return (dispatch) => {
    login(email, password)
      .then((response) => {
        console.log(response.data);
        const decoded = jwt_decode(response.data.access);

        console.log(decoded, "decoded");
        let tokenDetails = {
          id: decoded.id,
          token: response.data.access,
          expiresIn: decoded.exp * 1000,
          isAdmin: decoded.is_admin,
        };

        dispatch(
          getUserDetailsAction(tokenDetails, decoded.is_admin, navigate)
        );
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.details?.length > 0) {
          swal("Oops", error.response.data.details[0].message, "error", {
            button: "Try Again!",
          });
        } else {
          swal("Oops", error.response.data, "error", {
            button: "Try Again!",
          });
        }
        dispatch(loginFailedAction(""));
      });
  };
}

export function getUserDetailsAction(tokenDetails, isAdmin, navigate) {
  return (dispatch) => {
    getUserDetails(tokenDetails.token, tokenDetails.id)
      .then((response) => {
        console.log(response.data, "response.data");
        dispatch(getUserDetailsConfirmedAction(response.data));
        isAlreadyReferred(response.data.id, tokenDetails.token).then((res) => {
          if (res.data.isRefered) {
            console.log("save Token");
            saveTokenInLocalStorage(tokenDetails, response.data);
            dispatch(loginConfirmedAction(tokenDetails));
            const todaysDate = new Date();
            const expireDate = new Date(tokenDetails.expiresIn);
            const timer = expireDate.getTime() - todaysDate.getTime();
            runLogoutTimer(dispatch, timer, navigate);
            console.log(isAdmin);
            if (!isAdmin) {
              console.log("here in dashboard");
              navigate("/dashboard");
            } else {
              navigate("/admindashboard");
            }
          } else {
            dispatch(TokenTemporarily(tokenDetails));
            navigate("/conformation", {
              tokenDetails,
            });
          }
        });
      })
      .catch((error) => {
        console.log(error);
        dispatch(getUserDetailsFailedAction(error));
      });
  };
}

export function TokenTemporarily(tokenDetails) {
  return {
    type: CONNECTED_TO_Token,
    payload: tokenDetails,
  };
}

export function loginFailedAction(data) {
  return {
    type: LOGIN_FAILED_ACTION,
    payload: data,
  };
}

export function loginConfirmedAction(tokenDetails) {
  return {
    type: LOGIN_CONFIRMED_ACTION,
    payload: tokenDetails,
  };
}

export function confirmedSignupAction(payload) {
  return {
    type: SIGNUP_CONFIRMED_ACTION,
    payload,
  };
}

export function signupFailedAction(message) {
  return {
    type: SIGNUP_FAILED_ACTION,
    payload: message,
  };
}

export function loadingToggleAction(status) {
  return {
    type: LOADING_TOGGLE_ACTION,
    payload: status,
  };
}

export function connectedToMetaMask(address, token, isAdmin) {
  return {
    type: CONNECTED_TO_METAMASK,
    payload: { address, token, isAdmin },
  };
}

//Create function for requesting to connect with MetaMask

export function SavedD(address, token) {
  return {
    type: CONNECTED_TO_Token,
    payload: { address, token },
  };
}
export function saveD(address, token) {
  return (dispatch) => {
    dispatch(SavedD(address, token));
  };
}
//Create function for requesting to connect with MetaMask
