import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Web3Provider } from "@ethersproject/providers";
import bxgicon from "../../../icons/buy and sell/tokenbxg.png";
import usdicon from "../../../icons/buy and sell/usdtt.png";
import usdt from "../../../contractAbis/USDT.json";
import bitXSwap from "../../../contractAbis/BitXGoldSwap.json";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import axiosInstance, {
  getChangedValue,
} from "../../../services/AxiosInstance";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Loader from "../Loader/Loader";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Logout } from "../../../store/actions/AuthActions";

const Buy = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setloader] = useState(false);
  const [value, setValue] = useState(0);
  const [bxgvalue, setBxgvalue] = useState(0);
  const [totalUsd, setTotalUsd] = useState(bxgvalue * value);

  const state = useSelector((state) => state);

  const { changeBackground } = useContext(ThemeContext);

  const FetchData = async () => {
    setloader(true);
    try {
      const value = await getChangedValue();

      if (value) {
        setValue(value / 10);
      }
      setloader(false);
    } catch (err) {
      toast.error("Server Error", {
        position: "top-center",
        style: { minWidth: 180 },
      });
      setloader(false);
    }
  };

  useEffect(() => {
    changeBackground({ value: "dark", label: "Dark" });
    FetchData();
  }, []);

  const handleBuy = async () => {
    setloader(true);
    if (bxgvalue === 0) {
      toast.error("Please enter BXG value", {
        position: "top-center",
        style: { minWidth: 180 },
      });
    } else {
      console.log(bxgvalue);
      console.log(state.auth.userDetails.wallet_public_key);
      try {
        const requestBody = {
          user_id: state.auth.userDetails.id,
          bxg: bxgvalue,
          usdt: totalUsd,
        };
        const { data } = await axiosInstance
          .post("/api/bxg/buy", requestBody)
          .catch((err) => {
            toast.error(err.response.data.message, {
              position: "top-center",
              style: { minWidth: 180 },
            });
          });

        console.log(data);
        if (data === "Purchasing Successfull.") {
          toast.success(data, {
            position: "top-center",
            style: { minWidth: 180 },
          });
        } else {
          toast.error(data.message, {
            position: "top-center",
            style: { minWidth: 180 },
          });
        }
      } catch (error) {
        toast.error(error.reason, {
          position: "top-center",
          style: { minWidth: 180 },
        });
      }
    }
    setloader(false);
  };

  const handleChange = (e) => {
    setBxgvalue(e.target.value);
  };

  useEffect(() => {
    setTotalUsd((bxgvalue * value).toFixed(2));
  }, [bxgvalue]);
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
                  <span className="text-warning">{t("buy_header")}</span>{" "}
                  {t("buy_sell_header_description")}
                  <br />
                </h1>
                <br></br>
                <br></br>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="text-center mt-3 row justify-content-center">
                      <div className="col-xl-12 justify-content-center">
                        <div className="row justify-content-center">
                          <div className="col-6 col-xl-6 col-sm-6">
                            <input
                              onChange={handleChange}
                              type="text"
                              className="form-control mb-3"
                              name="value"
                              placeholder=""
                              value={bxgvalue}
                            />
                          </div>
                          <div className="col-2 col-xl-2 col-sm-2 justify-content-right">
                            <div className="row">
                              <div
                                style={{ color: "darkgrey" }}
                                type="text"
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

                      <div className="col-xl-12">
                        <div className="row justify-content-center">
                          <div className="col-6 col-xl-6 col-sm-6">
                            <input
                              disabled={true}
                              type="text"
                              className="form-control mb-3"
                              value={totalUsd}
                              name="value"
                              placeholder="12"
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
                        onClick={handleBuy}
                        className="btn btn-warning mr-0 ">
                        {t("buy_button")}
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
export default Buy;
