import React, { useContext, useEffect } from "react";
import { Badge, Card, Col, Row, Table } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { GetValuesForReferPage } from "../../../services/AxiosInstance";
import { ThemeContext } from "../../../context/ThemeContext";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Loader from "../Loader/Loader";
import InviteYourContacts from "./InviteYourContacts";
import RefersLevel from "./RefersLevel";
import RefersTable from "./RefersTable";
import OldRefersTable from "./OldRefersTable";

const StakingReferral = () => {
  const { t } = useTranslation();
  const state = useSelector((state) => state);

  const { changeBackground } = useContext(ThemeContext);
  useEffect(() => {
    changeBackground({ value: "dark", label: "Dark" });
  }, []);

  // create a static value of 0.16130827463

  const [loader, setLoader] = useState(false);
  const [stakingReferalData, setStakingReferalData] = useState([]);
  const [oldstakingReferalData, setoldStakingReferalData] = useState([]);
  const [level1count, setLevel1Count] = useState(0);
  const [level2count, setLevel2Count] = useState(0);
  const [level3count, setLevel3Count] = useState(0);
  const [refers, setRefers] = useState([]);
  const [referals, setReferals] = useState([]);

  //total usdt value

  //create handlesell

  const getFormattedDate = (date) => {
    //get only day and month in english
    const d = new Date(date);
    const month = d.toLocaleString("default", { month: "short" });
    const day = d.getDate();
    return `${day} ${month}`;
  };

  useEffect(() => {
    FetchData();
  }, []);

  const FetchData = async () => {
    setLoader(true);
    try {
      const latestResponse = await GetValuesForReferPage(
        state.auth.userDetails.id,
        state.auth.userDetails.old_wallet_public_key
      );

      setLevel1Count(latestResponse.level1count);
      setLevel2Count(latestResponse.level2count);
      setLevel3Count(latestResponse.level3count);
      setStakingReferalData(latestResponse.referalData);
      setoldStakingReferalData(latestResponse.oldReferalData);
      setRefers(latestResponse.refers[0]);
      console.log(latestResponse.refers[0]);
    } catch (err) {
      console.log(err);
    }
    setLoader(false);
  };

  function copyToClipBoard() {
    var copyText = document.getElementById("myInput");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(copyText.value);
    toast.success("Copied Referral Code: " + copyText.value, {
      position: "top-center",
      style: { minWidth: 180 },
    });
  }
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
          <InviteYourContacts
            inviteDescription="invite_description"
            referCodeTitle="refer_code_title"
            copyToClipBoard={copyToClipBoard}
          />

          <RefersLevel
            headerKey={"refers_by_level"}
            level1count={level1count}
            level2count={level2count}
            level3count={level3count}
          />
          <RefersTable
            titleKey={"referred_transaction"}
            stakingReferalData={stakingReferalData}
          />

          {state.auth.userDetails.old_wallet_public_key === null ||
          state.auth.userDetails.old_wallet_public_key === undefined ||
          state.auth.userDetails.old_wallet_public_key === "" ? (
            <></>
          ) : (
            <>
              <RefersLevel
                headerKey={"Referrals In Previous Version"}
                level1count={refers.refer1}
                level2count={refers.refer2}
                level3count={refers.refer3}
              />

              <OldRefersTable
                titleKey={"old_referred_transaction"}
                stakingReferalData={oldstakingReferalData}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};
export default StakingReferral;
