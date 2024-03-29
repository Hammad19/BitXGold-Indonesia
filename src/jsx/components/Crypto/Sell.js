import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Web3Provider } from "@ethersproject/providers";
//import icon from src/icons/coin.png;
import bxgicon from "../../../icons/buy and sell/tokenbxg.png";
import usdicon from "../../../icons/buy and sell/usdtt.png";
import bitX from "../../../contractAbis/BitX.json";
import bitXSwap from "../../../contractAbis/BitXGoldSwap.json";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import axiosInstance, {
  getChangedValue,
} from "../../../services/AxiosInstance";
import { ThemeContext } from "../../../context/ThemeContext";
import axios from "axios";
import Loader from "../Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../../../store/actions/AuthActions";
const Sell = () => {
  const { t } = useTranslation();
  const { changeBackground } = useContext(ThemeContext);
  useEffect(() => {}, []);

  const [Usd, setUsd] = React.useState(0);

  const [loader, setLoader] = useState(false);
  // create a static value of 0.16130827463
  const [value, setValue] = React.useState(0);
  const [totalbxgvalue, settotalBxgvalue] = React.useState(Usd * value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const state = useSelector((state) => state);
  //total usdt value

  const FetchData = async () => {
    setLoader(true);
    try {
      const value = await getChangedValue();

      if (value) {
        setValue(value);
      }
      setLoader(false);
    } catch (err) {
      toast.error("Server Error", {
        position: "top-center",
        style: { minWidth: 180 },
      });
      setLoader(false);
    }
  };

  useEffect(() => {
    changeBackground({ value: "dark", label: "Dark" });
    FetchData();
  }, []);

  useEffect(() => {
    if (totalbxgvalue === NaN) totalbxgvalue = 0.0;
  }, [totalbxgvalue]);

  const handleSell = async () => {
    if (Usd === 0) {
      toast.error("Please enter a valid amount", {
        position: "top-center",
        style: { minWidth: 180 },
      });
    } else {
      setLoader(true);
      try {
        const requestBody = {
          user_id: state.auth.userDetails.id,
          bxg: Usd,
          usdt: totalbxgvalue,
        };

        const { data } = await axiosInstance
          .post("/api/bxg/sell", requestBody)
          .catch((err) => {
            setLoader(false);
            toast.error(err.response.data.message, {
              position: "top-center",
              style: { minWidth: 180 },
            });
          });

        if (data === "Sold Successfuly.") {
          toast.success("Request Sent Successfully", {
            position: "top-center",
            style: { minWidth: 180 },
          });
        } else {
          toast.error(data.message, {
            position: "top-center",
            style: { minWidth: 180 },
          });
        }
        setLoader(false);
      } catch (err) {
        setLoader(false);
        toast.error("Transaction Failed", {
          position: "top-center",
          style: { minWidth: 180 },
        });
      }
    }
    setLoader(false);
  };

  const handleChange = (e) => {
    setUsd(e.target.value);
  };

  useEffect(() => {
    settotalBxgvalue(Usd * value);
  }, [Usd]);
  return (
    <>
      <Toaster />

      {loader ? (
        <Loader />
      ) : (
        <div
          className="row "
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "50px",
          }}>
          <div
            style={{
              color: "white",
              marginBottom: "20px",
              marginTop: "-25px",
              fontSize: "15px",
            }}>
            {t("sell_desclaimer_1") + " "}
            <a
              //open in new tab
              target="_blank"
              rel="noopener noreferrer"
              href="https://bitx.gold/token-sale/"
              style={{
                fontSize: "15px",
                textDecoration: "underline",
              }}>
              Q&A
            </a>
            {" " + t("sell_desclaimer_2")}
          </div>
          <div className="col-xl-6" style={{ height: "100%" }}>
            <div className="card">
              <div className="card-body pb-2">
                <br></br>
                <h1 className="text-center no-border font-w600 fs-60 mt-2">
                  <span className="text-danger">{t("sell_header")}</span>{" "}
                  {t("buy_sell_header_description")}
                </h1>

                <br></br>
                <br></br>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="text-center mt-3 row justify-content-center">
                      <div className="col-xl-12">
                        <div className="row justify-content-center">
                          <div className="col-6 col-xl-6 col-sm-6">
                            <input
                              onChange={handleChange}
                              type="number"
                              className="form-control mb-3"
                              name="value"
                              placeholder="12"
                              value={Usd}
                            />
                          </div>
                          <div className="col-2 col-xl-2 col-sm-2 justify-content-right">
                            <div className="row">
                              <div
                                style={{ color: "darkgrey" }}
                                type="number"
                                className="custom-react-select form-control mb-3">
                                {" "}
                                <img
                                  src={bxgicon}
                                  width="30"
                                  height="30"
                                  alt="bxg logo"
                                  className=""
                                />
                                BXG
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-12 justify-content-center">
                        <div className="row justify-content-center">
                          <div className="col-6 col-xl-6 col-sm-6">
                            <input
                              disabled={true}
                              type="text"
                              value={totalbxgvalue ? totalbxgvalue : 0.0}
                              className="form-control mb-3"
                              name="value"
                              placeholder=""
                            />
                          </div>
                          <div className="col-2 col-xl-2 col-sm-2 col-md-2">
                            <div className="row">
                              <div
                                style={{ color: "darkgrey" }}
                                type="text"
                                className="custom-react-select form-control mb-3">
                                <img
                                  src={usdicon}
                                  width="25"
                                  height="25"
                                  alt="usdt logo"
                                  className=""
                                />{" "}
                                USDT
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <br></br>

                    <div className="text-center mt-4 mb-4">
                      <Link
                        onClick={() => {
                          handleSell();
                        }}
                        className="btn btn-warning mr-0 ">
                        SELL NOW
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
export default Sell;
