import React, { useContext, useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader/Loader";
import { Button, Dropdown, Form, Modal, Nav, Tab } from "react-bootstrap";
import { ethers } from "ethers";
import bitXSwap from "../../contractAbis/BitXGoldSwap.json";
import axiosInstance from "../../services/AxiosInstance";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Web3Provider } from "@ethersproject/providers";
import { connect, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { connectToMetaMask, Logout } from "../../store/actions/AuthActions";
import axios from "axios";
const Conformation = (props) => {
  console.log(props);
  const [isreferred, setisreferred] = useState(false);
  const dispatch = useDispatch();
  const { search } = useLocation();
  const navigate = useNavigate();
  const [referalAddress, setreferalAddress] = useState("");
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const state = useSelector((state) => state);

  async function getRef() {
    const requestBody = {
      user_id: props.tokenData.id,
      refer_code: referalAddress,
    };

    const { data } = await axiosInstance
      .post("/api/refer/check", requestBody)
      .catch((err) => {
        toast.error(err.response.data.message, {
          position: "top-center",
        });
        setLoader(false);
      });
    if (!data) {
      toast.error(data.message, {
        position: "top-center",
      });
      setLoader(false);
      return;
    }

    const referalAddressarray = [
      data.data.refer1
        ? data.data.refer1
        : "0x0000000000000000000000000000000000000000",
      data.data.refer2
        ? data.data.refer2
        : "0x0000000000000000000000000000000000000000",
      data.data.refer3
        ? data.data.refer3
        : "0x0000000000000000000000000000000000000000",
    ];
    return referalAddressarray;
  }
  async function checkDB() {
    const requestBody = {
      wallet_address: referalAddress,
    };

    const { data } = await axiosInstance
      .post(
        "/api/bonusrefer/check",

        requestBody,
        {
          headers: {
            Authorization: props.tokenData.token,
          },
        }
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
  async function saveRef() {
    const requestBody = {
      user_id: state.auth.userDetails.id,
      refer_code: referalAddress,
    };

    const { data } = await axiosInstance
      .post("/api/refer/", requestBody, {
        headers: {
          Authorization: props.tokenData.token,
        },
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
          position: "top-center",
        });
        setLoader(false);
      });

    if (!data.status) {
      toast.error(data.message, {
        position: "top-center",
      });
      setLoader(false);
      return;
    }

    const referalAddressarray = [
      data.data.refer1
        ? data.data.refer1
        : "0x0000000000000000000000000000000000000000",
      data.data.refer2
        ? data.data.refer2
        : "0x0000000000000000000000000000000000000000",
      data.data.refer3
        ? data.data.refer3
        : "0x0000000000000000000000000000000000000000",
    ];
    return referalAddressarray;
  }
  async function save() {
    getBonus();
  }
  const getReferalBonus = async () => {
    if (referalAddress === "") {
      toast.error("Please Enter Referal Code", {
        style: { minWidth: 180 },
        position: "top-center",
      });
    } else {
      const status = await checkDB();
      if (status) {
        save();
      } else {
        toast.error("Please Enter Valid Referal Code", {
          style: { minWidth: 180 },
          position: "top-center",
        });
      }
    }
  };
  const getBonus = async () => {
    console.log(state.auth.userDetails.wallet_public_key);
    try {
      const requestBody = {
        user_id: state.auth.userDetails.id,
        refer_code: referalAddress,
      };
      const { data } = await axiosInstance.post(
        "/api/bonusrefer/",
        requestBody,
        {
          headers: {
            Authorization: props.tokenData.token,
          },
        }
      );

      console.log(data, "data");
      if (data === "Refere Added Successfully.") {
        toast.success("Refered Successfully Please Login Again");
        setisreferred(true);

        saveRef();
        handleClose();
        setLoader(false);

        dispatch(Logout(navigate));
      } else {
        toast.error(data.message);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  return (
    <>
      <Toaster />

      {loader === true ? (
        <Loader />
      ) : (
        <>
          <Modal show={show}>
            <Modal.Header>
              <Modal.Title>Referal Code </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1">
                  <Form.Label>
                    Please Enter Referral Address. <br />
                    If you don't have any refferal address please use this :
                    {state.auth.defultReffer}
                  </Form.Label>
                  <input
                    className="form-control form-control-lg mb-3"
                    value={referalAddress}
                    type="text"
                    placeholder="0x00000000000000000000"
                    autoFocus
                    onChange={(e) => setreferalAddress(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={getReferalBonus}>
                Get Referral Bonus
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    tokenData: state.auth.tokenData,
    state: state.auth,
  };
};
export default connect(mapStateToProps)(Conformation);
