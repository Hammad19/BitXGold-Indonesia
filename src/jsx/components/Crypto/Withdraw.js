import React, { useContext, useEffect } from "react";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";

import bxgicon from "../../../icons/buy and sell/tokenbxg.png";
import usdicon from "../../../icons/buy and sell/usdtt.png";
import bnbicon from "../../../images/bnb.png";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import axiosInstance, {
  FetchBalances,
  getChangedValue,
} from "../../../services/AxiosInstance";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../Loader/Loader";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";

const Withdraw = () => {
  const [walletAddress, SetWalletAddress] = useState("");

  const FetchData = async () => {
    setloader(true);
    try {
      const response = await FetchBalances(state.auth.userDetails.id);
      setBxgBalance(response.bxg);
      setBnbBalance(response.bnb);
      setUsdtBalance(response.usdt);

      setloader(false);
    } catch (err) {
      console.log(err);
      toast.error("Server Error", {
        position: "top-center",
        style: { minWidth: 180 },
      });
      setloader(false);
    }
  };

  const handleWidthdraw = async () => {
    if (walletAddress === "") {
      toast.error("Please Enter Wallet Address", {
        position: "top-center",
        style: { minWidth: 180 },
      });
      return;
    }
    if (value === 0) {
      toast.error("Please Enter Amount", {
        position: "top-center",
        style: { minWidth: 180 },
      });
      return;
    }

    setloader(true);
    try {
      //check if the token is bxg bnb or usdt
      const token =
        selectedOption.value === 1
          ? "bnb"
          : selectedOption.value === 2
          ? "bxg"
          : "usdt";

      if (token === "bxg") {
        if (value > bxgBalance) {
          console.log(value, bxgBalance);
          toast.error("Insufficient BXG Balance", {
            position: "top-center",
            style: { minWidth: 180 },
          });
          setloader(false);
          return;
        }
      } else if (token === "bnb") {
        if (value > bnbBalance) {
          toast.error("Insufficient Balance", {
            position: "top-center",
            style: { minWidth: 180 },
          });
          setloader(false);
          return;
        }
      } else if (token === "usdt") {
        if (value > usdtBalance) {
          toast.error("Insufficient Balance", {
            position: "top-center",
            style: { minWidth: 180 },
          });
          setloader(false);
          return;
        }
      }

      const res = await axiosInstance
        .post("/api/withdrawcrypto/" + token, {
          user_id: state.auth.userDetails.id,
          amount: value,
          wallet_address: walletAddress,
        })
        .catch((err) => {
          toast.error(err.response.data.message, {
            position: "top-center",
            style: { minWidth: 180 },
          });
          setloader(false);
        });

      if (res.data.status) {
        toast.success(res.data.message, {
          position: "top-center",
          style: { minWidth: 180 },
        });
        setloader(false);
        setValue(0);
        SetWalletAddress("");
        FetchData();
      }
    } catch (err) {
      toast.error("Server Error", {
        position: "top-center",
        style: { minWidth: 180 },
      });
      setloader(false);
    }
  };
  const data = [
    {
      value: 1,
      text: "BNB",
      icon: <img alt="" width="20px" fluid src={bnbicon} />,
    },
    {
      value: 2,
      text: "BXG",
      icon: <img alt="" width="30px" fluid src={bxgicon} />,
    },
    {
      value: 3,
      text: "USDT",
      icon: <img alt="" src={usdicon} width="20px" fluid />,
    },
  ];

  const [selectedOption, setSelectedOption] = useState(data[0]);
  const { t } = useTranslation();

  const [loader, setloader] = useState(false);
  const [value, setValue] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [bxgBalance, setBxgBalance] = useState(0);
  const [bnbBalance, setBnbBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);

  const ShowBalance = () => {
    if (selectedOption.value === 1) {
      return bnbBalance;
    } else if (selectedOption.value === 2) {
      return bxgBalance;
    } else if (selectedOption.value === 3) {
      return usdtBalance;
    }
  };

  const handleChange = (e) => {
    console.log(e);
    setSelectedOption(e);
  };

  const state = useSelector((state) => state);

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <>
      <Toaster />
      {loader === true ? (
        <Loader />
      ) : (
        <div
          className="row "
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "50px",
          }}>
          <div className="col-xl-6" style={{ height: "100%" }}>
            <div className="card">
              <div className="card-body pb-2">
                <br></br>
                <h1 className="text-center no-border font-w600 fs-60 mt-2">
                  <span className="text-warning">{t("withdraw")}</span>{" "}
                  {t("withdraw_header_description")}
                  <br />
                </h1>
                <br></br>
                <br></br>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="text-center mt-3 row justify-content-center">
                      <div className="col-xl-12 justify-content-center">
                        <div className="row justify-content-center">
                          <div className="col-10 col-sm-10 col-md-8  col-xl-9 col-lg-9">
                            <input
                              onChange={(e) => {
                                SetWalletAddress(e.target.value);
                              }}
                              type="text"
                              className="form-control mb-3"
                              name="value"
                              placeholder="Enter Wallet Address"
                              value={walletAddress}
                            />
                          </div>
                          <div className="col-10 col-sm-10 col-md-8  col-xl-6 col-lg-6">
                            <input
                              onChange={(e) => {
                                setValue(e.target.value);
                              }}
                              type="number"
                              className="form-control mb-3"
                              name="value"
                              placeholder="Enter Amount to Withdraw"
                              value={value}
                              //hide arrow up and down
                            />
                          </div>
                          <div className="col-8 col-sm-8 col-md-4 col-lg-3 col-xl-3  justify-content-right">
                            <div className="row">
                              <Select
                                className=""
                                value={selectedOption}
                                options={data}
                                onChange={handleChange}
                                styles={{
                                  //change background color of dropdown
                                  menu: (provided, state) => ({
                                    ...provided,
                                    background: "rgba(5, 24, 57, 255)",
                                    color: "white",
                                  }),

                                  //change background of selected option
                                  option: (provided, state) => ({
                                    ...provided,
                                    background: state.isSelected
                                      ? "rgba(5, 24, 57, 255)"
                                      : "rgba(5, 24, 57, 255)",
                                    color: "white",
                                  }),

                                  //change background of whole dropdown
                                  control: (provided, state) => ({
                                    ...provided,

                                    color: "white",
                                    borderRadius: "15px",
                                    backgroundColor: "rgba(5, 24, 57, 255)",
                                    height: "49px",
                                    //give same border color as input border
                                    borderColor: "rgba(5, 24, 57, 255)",
                                  }),

                                  //change color of placeholder

                                  placeholder: (provided, state) => ({
                                    ...provided,
                                    color: "white",
                                  }),

                                  //change color of dropdown indicator
                                  dropdownIndicator: (provided, state) => ({
                                    ...provided,
                                    color: "white",
                                  }),

                                  //change color of selected option
                                  singleValue: (provided, state) => ({
                                    ...provided,
                                    color: "white",
                                  }),

                                  //remove border of indicator
                                  indicatorSeparator: (provided, state) => ({
                                    ...provided,
                                    display: "none",
                                  }),

                                  //set font size of selected option
                                  valueContainer: (provided, state) => ({
                                    ...provided,
                                    fontSize: "18px",
                                  }),
                                }}
                                placeholder="Select Option"
                                getOptionLabel={(e) => (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}>
                                    {e.icon}
                                    <span style={{ marginLeft: 5 }}>
                                      {e.text}
                                    </span>
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="row sell-blance my-3">
                            <span className="text-white">
                              {"Total Balance Available"}: {ShowBalance()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <br></br>

                    <div className="text-center mt-4 mb-4">
                      <Link
                        onClick={handleWidthdraw}
                        className="btn btn-warning mr-0 ">
                        {t("withdraw")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Withdraw;
