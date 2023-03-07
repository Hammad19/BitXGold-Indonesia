import jwt_decode from "jwt-decode";
import swal from "sweetalert";

import {
  formatError,
  login,
  runLogoutTimer,
  savedetails,
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

export function saveSigner(signer, account, provider, isLoggedInFromMobile) {
  //save details in local storage
  savedetails(isLoggedInFromMobile);
  return {
    type: CONNECTED_TO_WALLET,
    payload: { signer, account, provider, isLoggedInFromMobile },
  };
}

export function signupAction(user_name, email, password, navigate) {
  return (dispatch) => {
    signUp(user_name, email, password)
      .then((response) => {
        dispatch(confirmedSignupAction(response.data));
        navigate("/login");
        //history.push('/dashboard');
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
  localStorage.removeItem("userDetails");
  navigate("/login");
  //history.push('/login');

  return {
    type: LOGOUT_ACTION,
  };
}

export function loginAction(email, password, navigate) {
  return (dispatch) => {
    login(email, password)
      .then((response) => {
        console.log(response.data);
        const decoded = jwt_decode(response.data.access);
        console.log(decoded);
        let tokenDetails = {
          id: decoded.id,
          token: response.data.access,
          expiresIn: decoded.exp * 1000,
          walletaddress: "",
          isAdmin: decoded.is_admin,
        };
        saveTokenInLocalStorage(tokenDetails);
        runLogoutTimer(
          dispatch,
          tokenDetails.expiresIn - decoded.iat,
          navigate
        );
        dispatch(loginConfirmedAction(tokenDetails));

        if (decoded.is_admin) {
          navigate("/admindashboard");
        } else {
          navigate("/dashboard");
        }
      })
      .catch((error) => {
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
export function connectToMetaMask(
  navigate,
  address,
  token,
  adminwalletaddress
) {
  return (dispatch) => {
    window.ethereum.enable().then((accounts) => {
      const decoded = jwt_decode(token);
      const { exp } = decoded;

      if (address.toLowerCase() === adminwalletaddress.toLowerCase()) {
        let tokenDetails = {
          token: token,
          expiresIn: exp * 1000,
          walletaddress: address,
          isAdmin: true,
        };
        saveTokenInLocalStorage(tokenDetails);
        dispatch(connectedToMetaMask(address, token, tokenDetails.isAdmin));
        navigate("/admindashboard");
      } else {
        let tokenDetails = {
          token: token,
          expiresIn: exp * 1000,
          walletaddress: address,
          isAdmin: false,
        };
        saveTokenInLocalStorage(tokenDetails);
        dispatch(connectedToMetaMask(address, token, false));
        navigate("/dashboard");
      }
    });
  };
}
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
