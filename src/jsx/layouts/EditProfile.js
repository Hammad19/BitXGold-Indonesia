import React, { useState, useEffect, useContext } from "react";
//import { Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../../services/AxiosInstance";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

import CountryCodePicker from "../components/PhoneInput/CountryCodePicker";
import { Logout } from "../../store/actions/AuthActions";

const EditProfile = (props) => {
  const state = useSelector((state) => state);
  const { t } = useTranslation();

  const { changeBackground } = useContext(ThemeContext);
  useEffect(() => {
    changeBackground({ value: "dark", label: "Dark" });
  }, []);
  const [profileData, setprofileData] = useState({
    id: "",
    email: "",
    contact: "",
    old_wallet_public_key: "",
  });
  const [email, setemail] = useState("");
  const [whatsapp, setwhatsapp] = useState("");
  const [oldWalletAddress, setOldWalletAddress] = useState("");

  const getdata = async () => {
    const { data } = await axiosInstance.get(
      "/api/profile/" + state.auth.userDetails.id
    );

    setprofileData({
      id: data.id,
      email: data.email,
      contact: data.contact,
      old_wallet_public_key: data.old_wallet_public_key,
    });
    setprofileData(data);
    setemail(data.email);
    setwhatsapp(data.contact);
    setOldWalletAddress(data.old_wallet_public_key);
  };

  async function verifyOldWalletPublicKey() {
    const requestBody = {
      wallet_address: oldWalletAddress,
    };

    const { data } = await axiosInstance
      .post(
        "/api/auth/verifywallet",

        requestBody,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .catch((err) => {
        toast.error("The old Wallet Address You Entered does not exist", {
          position: "top-center",
        });
        return false;
      });

    //console.log(data, "data");
    if (data) {
      return data.status;
    }
  }
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function update() {
    try {
      if (email === "" || whatsapp === "" || oldWalletAddress === "") {
        toast.error("Please Enter Required Fileds", {
          style: { minWidth: 180 },
          position: "top-center",
        });
      } else {
        const verifywalletstatus = await verifyOldWalletPublicKey();

        const changedfields = {};
        if (profileData.email !== email) {
          changedfields.email = email;
        }
        if (profileData.contact !== whatsapp) {
          changedfields.contact = whatsapp;
        }
        if (profileData.old_wallet_public_key !== oldWalletAddress) {
          changedfields.old_wallet_public_key = oldWalletAddress;
        }
        const requestBody = {
          ...changedfields,
        };

        console.log(requestBody, "Print this Bro");

        if (verifywalletstatus) {
          const mesg = await axiosInstance.put(
            "/api/profile/" + state.auth.userDetails.id,
            requestBody
          );

          if (mesg.data === "values updated") {
            toast.success("updated successfully ", {
              style: { minWidth: 180 },
              position: "top-center",
            });
            //if old wallet is changed logout else call getdata
            if (profileData.old_wallet_public_key !== oldWalletAddress) {
              //show toast for logging out because old wallet changed
              toast.success("Old Wallet Address Changed! Please Login Again", {
                style: { minWidth: 180 },
                position: "top-center",
              });
              //settimeout for 3 seconds to log out

              setTimeout(() => {
                dispatch(Logout(navigate));
              }, 2000);
            } else {
              console.log("else");
              getdata();
            }

            if (mesg.data.message === "User Not Found With The Given Id.") {
              const response = await axiosInstance.put(
                "/api/profile/" + state.auth.userDetails.id,
                {
                  email: email,
                  contact: whatsapp,
                  old_wallet_public_key: oldWalletAddress,
                }
              );
              console.log(response);

              if (response.status === 200) {
                toast.success("updated successfully ", {
                  style: { minWidth: 180 },
                  position: "top-center",
                });
                getdata();
              } else {
                toast.error("Something Went Wrong", {
                  style: { minWidth: 180 },
                  position: "top-center",
                });
              }
            }
          }
        } else {
          toast.error(
            "This Old Wallet Address does not exist in BitXGold Malaysia",
            {
              style: { minWidth: 180 },
              position: "top-center",
            }
          );
        }
      }
    } catch (err) {
      toast.error("Network Error Try Again Later", {
        style: { minWidth: 180 },
        position: "top-center",
      });
    }
  }
  useEffect(() => {
    getdata();
  }, []);

  return (
    <>
      <Toaster />
      <div className="row">
        <div className="col-xl-3 col-lg-4">
          <div className="clearfix">
            <div className="card card-bx profile-card author-profile m-b30">
              <div className="card-body">
                <div className="p-5">
                  <div className="author-profile">
                    <div className="author-info">
                      <h6 className="title">
                        {props.state.auth.walletaddress}
                      </h6>
                      <span></span>
                    </div>
                  </div>
                </div>
                <div className="info-list">
                  <ul>
                    <li
                      style={{
                        padding: "18px 18px",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}>
                      <Link>{t("whatsapp")}</Link>

                      <span>{profileData.contact}</span>
                    </li>
                    <li
                      style={{
                        padding: "18px 18px",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}>
                      <Link>{t("email")}</Link>
                      <span>{profileData.email}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-9 col-lg-8">
          <div className="card profile-card card-bx m-b30">
            <div className="card-header">
              <h6 className="title">{t("account_setup")}</h6>
            </div>
            <form className="profile-form">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-6 m-b30">
                    <label className="form-label">{t("whatsapp_number")}</label>
                    <CountryCodePicker
                      whatsapp={whatsapp}
                      setwhatsapp={setwhatsapp}
                    />
                  </div>
                  <div className="col-sm-6 m-b30">
                    <label className="form-label">{t("email_address")}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                    />
                  </div>

                  <div className="col-sm-6 m-b30">
                    <label className="form-label">
                      {t("Old Wallet Address")}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={oldWalletAddress}
                      onChange={(e) => setOldWalletAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div onClick={update} className="btn btn-primary">
                  {t("update")}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    state: state.auth,
  };
};
export default connect(mapStateToProps)(EditProfile);
