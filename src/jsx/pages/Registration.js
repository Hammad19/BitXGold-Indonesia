import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  loadingToggleAction,
  signupAction,
} from "../../store/actions/AuthActions";
// image

import logo from "../../images/logo/logo-full.png";
import bg6 from "../../images/background/bg6.jpg";
import CountryCodePicker from "../components/PhoneInput/CountryCodePicker";
import { Toaster, toast } from "react-hot-toast";

import axiosInstance from "../../services/AxiosInstance";

function Register(props) {
  const [heartActive, setHeartActive] = useState(true);

  const [referalAddress, setreferalAddress] = useState(
    "0x97A760EeD672A22c0B782F813F30598B8f994038"
  );
  const [email, setEmail] = useState("");
  let errorsObj = { email: "", password: "" };
  const [errors, setErrors] = useState(errorsObj);
  const [password, setPassword] = useState("");

  const [userName, setUserName] = useState("");
  const [contact, setContact] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const state = useSelector((state) => state);

  async function checkDB() {
    const requestBody = {
      wallet_address: referalAddress,
    };

    const { data } = await axiosInstance
      .post(
        "/api/bonusrefer/check",

        requestBody
      )
      .catch((err) => {
        toast.error("not in chain", {
          position: "top-center",
        });
        return false;
      });

    console.log(data, "data");
    if (data) {
      return data.status;
    }
  }

  const getReferalBonus = async () => {
    const status = await checkDB();
    if (status) {
      dispatch(loadingToggleAction(true));
      const beingdispatched = dispatch(
        signupAction(
          userName,
          email,
          password,
          contact,
          referalAddress,
          navigate
        )
      );

      console.log(beingdispatched, "beingdispatched");
    } else {
      toast.error("Please Enter Valid Referal Code", {
        style: { minWidth: 180 },
        position: "top-center",
      });
    }
  };

  function onSignUp(e) {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    if (email === "") {
      errorObj.email = "Email is Required";
      error = true;
    }

    if (userName === "") {
      errorObj.userName = "UserName is Required";
      error = true;
    }
    if (password === "") {
      errorObj.password = "Password is Required";
      error = true;
    }

    if (contact === "") {
      errorObj.contact = "Phone Number is Required";
      error = true;
    }
    if (referalAddress === "") {
      errorObj.referalAddress = "Referal Address is Required";
      error = true;
    }

    setErrors(errorObj);
    if (error) return;
    getReferalBonus();
  }

  return (
    <>
      <Toaster />
      <div className="page-wraper">
        <div className="browse-job login-style3">
          <div
            className="bg-img-fix overflow-hidden"
            style={{
              background: "#fff url(" + bg6 + ")",
              // cover no-repeat center center fixed",
              backgroundSize: "cover",

              //stretch to fit the page
              //take the height equal to the height of the viewport
              minHeight: "100vh",

              backgroundAttachment: "fixed",
              backgroundRepeat: "no-repeat",
            }}>
            <div className="row gx-0">
              <div
                style={{
                  overflow: "auto",
                }}
                className="col-xl-4 col-lg-5 col-md-6 col-sm-12 vh-100 bg-white">
                <div style={{ maxHeight: "653px" }}>
                  <div
                    style={{
                      position: "relative",
                      top: "0",
                      left: "0",
                      dir: "ltr",
                    }}>
                    <div className="login-form style-2">
                      <div className="card-body">
                        <div className="logo-header">
                          <Link to="/login" className="logo">
                            <img
                              src={logo}
                              alt=""
                              className="width-230 mCS_img_loaded"
                            />
                          </Link>
                        </div>
                        <nav className="nav nav-tabs border-bottom-0">
                          <div
                            className="tab-content w-100"
                            id="nav-tabContent">
                            <div className="tab-pane active show fade">
                              {props.errorMessage && (
                                <div className="">{props.errorMessage}</div>
                              )}
                              {props.successMessage && (
                                <div className="">{props.successMessage}</div>
                              )}
                              <form className="dz-form" onSubmit={onSignUp}>
                                <h3 className="form-title">Sign Up</h3>
                                <div className="dz-separator-outer m-b5">
                                  <div className="dz-separator bg-primary style-liner"></div>
                                </div>
                                <p>Enter your personal details below: </p>

                                <div className="form-group ">
                                  <label>
                                    If you don't have any refferal address
                                    please use this :
                                  </label>
                                  <label className="text-white">
                                    {state.auth.defultReffer}
                                  </label>
                                  {/* <input name="dzName" required="" className="form-control" placeholder="Email Address" type="text" /> */}
                                  <input
                                    value={referalAddress}
                                    onChange={(e) =>
                                      setreferalAddress(e.target.value)
                                    }
                                    className="form-control"
                                    placeholder="0x00000000000000"
                                  />
                                  {errors.referalAddress && (
                                    <div className="text-danger fs-12">
                                      {errors.referalAddress}
                                    </div>
                                  )}
                                </div>

                                <div className="form-group mt-3">
                                  <input
                                    name="dzName2"
                                    value={userName}
                                    onChange={(e) =>
                                      setUserName(e.target.value)
                                    }
                                    required=""
                                    className="form-control"
                                    placeholder="User Name"
                                    type="text"
                                  />
                                  {errors.userName && (
                                    <div className="text-danger fs-12">
                                      {errors.userName}
                                    </div>
                                  )}
                                </div>
                                <div className="form-group mt-3">
                                  {/* <input name="dzName" required="" className="form-control" placeholder="Email Address" type="text" /> */}
                                  <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control"
                                    placeholder="hello@example.com"
                                  />
                                  {errors.email && (
                                    <div className="text-danger fs-12">
                                      {errors.email}
                                    </div>
                                  )}
                                </div>

                                <div className="form-group mt-3">
                                  {/* <input name="dzName" required="" className="form-control" placeholder="Email Address" type="text" /> */}

                                  <CountryCodePicker
                                    whatsapp={contact}
                                    setwhatsapp={setContact}
                                  />

                                  {errors.contact && (
                                    <div className="text-danger fs-12">
                                      {errors.contact}
                                    </div>
                                  )}
                                </div>

                                <div className="form-group mt-3">
                                  {/* <input name="dzName" required="" className="form-control" placeholder="Password" type="password" /> */}
                                  <input
                                    value={password}
                                    onChange={(e) =>
                                      setPassword(e.target.value)
                                    }
                                    className="form-control"
                                    //defaultValue="Password"
                                    placeholder="passowrd"
                                  />
                                  {errors.password && (
                                    <div className="text-danger fs-12">
                                      {errors.password}
                                    </div>
                                  )}
                                </div>
                                {/* <div className="form-group mt-3 mb-3">
																	<input name="dzName" required="" className="form-control" placeholder="Re-type Your Password" type="password" />
																</div> */}
                                <div className="mb-3 mt-3">
                                  <span className="form-check float-start me-2">
                                    <input
                                      type="checkbox"
                                      className="form-check-input mt-0"
                                      id="check2"
                                      name="example1"
                                    />
                                    <label
                                      className="form-check-label d-unset"
                                      htmlFor="check2">
                                      I agree to the
                                    </label>
                                  </span>
                                  <label>
                                    <Link to={"#"}>Terms of Service </Link>&amp;{" "}
                                    <Link to={"#"}>Privacy Policy</Link>
                                  </label>
                                </div>
                                <div className="form-group clearfix text-left">
                                  <NavLink
                                    to="/login"
                                    className="btn btn-primary outline gray"
                                    type="button">
                                    Back
                                  </NavLink>
                                  <button
                                    type="submit"
                                    className="btn btn-primary float-end">
                                    Submit
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </nav>
                      </div>
                      <div className="card-footer">
                        <div className=" bottom-footer clearfix m-t10 m-b20 row text-center">
                          <div className="col-lg-12 text-center">
                            <span>
                              {" "}
                              © Copyright by
                              <span
                                className={`heart ${
                                  heartActive ? "" : "heart-blast"
                                }`}
                                onClick={() =>
                                  setHeartActive(!heartActive)
                                }></span>
                              <a
                                href="https://www.dexignzone.com/"
                                target="_blank">
                                {" "}
                                BitXGold{" "}
                              </a>{" "}
                              All rights reserved.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
  };
};

export default connect(mapStateToProps)(Register);
