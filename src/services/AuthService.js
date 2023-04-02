import axios from "axios";
import { ethers } from "ethers/lib";
import swal from "sweetalert";
import {
  getUserDetailsAction,
  getUserDetailsConfirmedAction,
  loginConfirmedAction,
  Logout,
  saveSigner,
} from "../store/actions/AuthActions";

const baseUrl = "http://localhost:8080";

export function signUp(user_name, email, password) {
  //axios call
  const postData = {
    user_name,
    email,
    password,
  };
  return axios.post(`${baseUrl}/api/auth/register`, postData);
}

export function login(email, password) {
  const postData = {
    email,
    password,
  };
  return axios.post(`${baseUrl}/api/auth/login`, postData);
}

export function getUserDetails(token, user_id) {
  return axios.get(`${baseUrl}/api/user/` + user_id, {
    headers: {
      Authorization: token,
    },
  });
}

export function isAlreadyReferred(id, token) {
  return axios.get(`${baseUrl}/api/bonusrefer/` + id, {
    headers: {
      Authorization: token,
    },
  });
}

export function formatError(errorResponse) {
  switch (errorResponse.error.message) {
    case "EMAIL_EXISTS":
      //return 'Email already exists';
      swal("Oops", "Email already exists", "error");
      break;
    case "EMAIL_NOT_FOUND":
      //return 'Email not found';
      swal("Oops", "Email not found", "error", { button: "Try Again!" });
      break;
    case "INVALID_PASSWORD":
      //return 'Invalid Password';
      swal("Oops", "Invalid Password", "error", { button: "Try Again!" });
      break;
    case "USER_DISABLED":
      return "User Disabled";

    case "Password must contain at least one uppercase one lowercase one special character and one number":
      swal(
        "Oops",
        "Password must contain at least one uppercase one lowercase one special character and one number",
        "error",
        { button: "Try Again!" }
      );
      break;

    default:
      return "";
  }
}

export function saveTokenInLocalStorage(tokenDetails, userdetails) {
  console.log("Saving token");
  localStorage.setItem("token", JSON.stringify(tokenDetails));
  localStorage.setItem("user", JSON.stringify(userdetails));
}

export function savedetails(isLoggedInFromMobile) {
  localStorage.setItem("isloggedinfrommobile", isLoggedInFromMobile);
  //   console.log("usercredentials", );
}

export function runLogoutTimer(dispatch, timer, navigate) {
  setTimeout(() => {
    //dispatch(Logout(history));
    dispatch(Logout(navigate));
  }, timer);
}

export async function checkAutoLogin(dispatch, navigate) {
  const tokenDetailsString = localStorage.getItem("token");
  const usercredentialsString = localStorage.getItem("user");

  let tokenDetails = "";
  let userDetails = "";
  if (!tokenDetailsString || !usercredentialsString) {
    dispatch(Logout(navigate));
    return;
  }

  tokenDetails = JSON.parse(tokenDetailsString);
  userDetails = JSON.parse(usercredentialsString);

  console.log("tokenDetails in check auto login", tokenDetails);
  console.log("userDetails in check auto login", userDetails);

  let expireDate = new Date(tokenDetails.expiresIn);
  let todaysDate = new Date();

  if (todaysDate > expireDate) {
    console.log("token expired");
    dispatch(Logout(navigate));
    return;
  }

  dispatch(loginConfirmedAction(tokenDetails));
  dispatch(getUserDetailsConfirmedAction(userDetails));

  const timer = expireDate.getTime() - todaysDate.getTime();
  runLogoutTimer(dispatch, timer, navigate);
}
