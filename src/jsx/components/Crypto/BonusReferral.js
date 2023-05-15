import React, { useContext, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { GetValuesForBonusPage } from "../../../services/AxiosInstance";
import { ThemeContext } from "../../../context/ThemeContext";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import InviteYourContacts from "./InviteYourContacts";
import BonusReferralCard from "./BonusReferralCard";
import BonusReferralTable from "./BonusReferralTable";
import OldBonusReferralTable from "./OldBonusReferralTable";
const BonusReferral = () => {
  const state = useSelector((state) => state);

  const { changeBackground } = useContext(ThemeContext);
  useEffect(() => {
    changeBackground({ value: "dark", label: "Dark" });
    FetchData();
  }, []);

  const [loader, setLoader] = useState(false);
  const [referCode, setReferCode] = useState("0x0000000000000000000000");
  const [oldReferCode, setOldReferCode] = useState("0x0000000000000000000000");
  const [referralData, setReferralData] = useState([]);
  const [oldreferralData, setoldReferralData] = useState([]);

  const FetchData = async () => {
    setLoader(true);
    try {
      console.log(state.auth.userDetails.old_wallet_public_key);
      const thisPageData = await GetValuesForBonusPage(
        state.auth.userDetails.id,
        state.auth.userDetails.old_wallet_public_key
      );
      setReferralData(thisPageData.referalData);
      setReferCode(thisPageData.referCode);
      setoldReferralData(thisPageData.oldReferalData);
      setOldReferCode(thisPageData.oldReferCode);
    } catch (err) {
      console.log(err);
    }
    setLoader(false);
  };

  function myFunction() {
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
          <InviteYourContacts
            inviteDescription="invite_description"
            referCodeTitle="refer_code_title"
            copyToClipBoard={myFunction}
          />
          <BonusReferralCard
            headerKey={"you_are_currently_referred_by"}
            walletaddress={state.auth.userDetails.wallet_public_key}
            referCode={referCode}
          />
          <BonusReferralTable referralData={referralData} />
          {state.auth.userDetails.old_wallet_public_key === null ||
          state.auth.userDetails.old_wallet_public_key === undefined ||
          state.auth.userDetails.old_wallet_public_key === "" ? (
            <></>
          ) : (
            <>
              <BonusReferralCard
                headerKey={"In Previous Version you were referred By"}
                walletaddress={state.auth.userDetails.old_wallet_public_key}
                referCode={oldReferCode}
              />
              <OldBonusReferralTable referralData={oldreferralData} />
            </>
          )}
        </div>
      )}
    </>
  );
};
export default BonusReferral;
