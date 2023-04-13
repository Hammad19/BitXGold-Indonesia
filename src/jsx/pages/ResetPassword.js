import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// image
import logo from "../../images/logo/logo-full.png";
import { useState } from "react";
import swal from "sweetalert";
import axios from "axios";
import axiosInstance from "../../services/AxiosInstance";
const ResetPassword = () => {
  const location = useLocation();

  const [email, setEmail] = useState(location.state.email);
  let errorsObj = { email: "" };
  const [errors, setErrors] = useState(errorsObj);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      let error = false;
      const errorObj = { ...errorsObj };
      if (email === "") {
        errorObj.email = "Email is Required";
        error = true;
      }

      setErrors(errorObj);
      if (error) {
        return;
      }

      let requestBody = {
        email: email,
      };

      const response = await axiosInstance.post(
        "/api/auth/email-verify",
        requestBody
      );

      console.log(response.data);

      if (response.data.status) {
        swal("Success", response.data.message, "success");
        navigate("/login");
      } else {
        swal("Oops", response.data.message, "error");
      }
    } catch {
      swal("Oops", "Something went wrong", "error");
    }
  };
  return (
    <div className="authincation h-100 p-meddle">
      <div className="container h-100">
        {" "}
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-6">
            <div className="authincation-content">
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <div className="auth-form">
                    <div className="text-center mb-3">
                      <Link to="/dashboard">
                        <img src={logo} alt="" />
                      </Link>
                    </div>
                    <h4 className="text-center mb-4 ">
                      Please Verify Your Email First
                    </h4>
                    <form onSubmit={(e) => onSubmit(e)}>
                      <div className="form-group">
                        <label className="">
                          <strong>Email</strong>
                        </label>
                        <input
                          disabled
                          type="email"
                          className="form-control"
                          //defaultValue="hello@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && (
                          <div className="text-danger fs-12">
                            {errors.email}
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block">
                          SUBMIT
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
