import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
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

const Deposit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setloader] = useState(false);
  //42 number walletaddres

  const [walletAddress, setWalletAddress] = useState(
    "0x8f7c9e523233023021321323wdw232839sd98"
  );
  const state = useSelector((state) => state);

  const { changeBackground } = useContext(ThemeContext);

  const FetchData = async () => {
    setloader(true);

    setloader(false);
  };

  useEffect(() => {
    changeBackground({ value: "dark", label: "Dark" });
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
          <div className="col-xl-8" style={{ height: "100%" }}>
            <div className="card">
              <div className="card-body pb-2">
                <br></br>
                <h1 className="text-center no-border font-w600 fs-60 mt-2">
                  <span className="text-warning">{"Deposit"}</span>{" "}
                  {"BNB and USDT to buy BXG tokens"}
                  <br />
                </h1>
                <br></br>
                <br></br>

                <div
                  className="col-xl-4"
                  style={{
                    height: "auto",
                    margin: "0 auto",
                    width: "100%",
                  }}>
                  <QRCode
                    className="my-4"
                    size={1000}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={walletAddress}
                    viewBox={`0 0 256 256`}
                  />
                  <br></br>
                </div>

                <br></br>
                <div
                  className="row"
                  style={{
                    justifyContent: "center",
                  }}>
                  <div className="col-xl-6">
                    <div className="form-group">
                      <div className="input-group">
                        <input
                          disabled
                          type="text"
                          className="form-control"
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              navigator.clipboard.writeText(walletAddress);
                              toast.success("Copied to clipboard");
                            }}>
                            {"Copy"}
                          </button>
                        </div>
                      </div>
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
export default Deposit;
