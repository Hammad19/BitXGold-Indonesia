import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "swiper/css";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import coin from "./../../../images/coin.png";
import { getDetailsforDashboard } from "../../../services/AxiosInstance";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import SwiperSlider from "../Swipers/SwiperSlider";
import swal from "sweetalert";
const Home = () => {
  const [bxgavailable, setbxgavailable] = useState(null);
  const [bxgstacked, setbxgstacked] = useState(null);
  const [referralBonus, setreferralBonus] = useState(null);
  const [stakingreferralBonus, setStakingReferralBonus] = useState(null);
  const [totalEarning, settotalEarning] = useState(null);
  const [bnb, setBnb] = useState(null);
  const [usdt, setUsdt] = useState(null);
  const [loader, setLoader] = useState(false);
  const state = useSelector((state) => state);
  const { t } = useTranslation();
  const FetchData = async () => {
    console.log(state.auth.userDetails, "state.auth.userDetails");
    setLoader(true);
    try {
      const response = await getDetailsforDashboard(state.auth.userDetails.id);
      setbxgavailable(response.availableBXG);
      setbxgstacked(response.bxgStaked);
      settotalEarning(response.totalEarning);

      console.log(response.referalBonus, "response");
      setreferralBonus(response.referalBonus);
      setStakingReferralBonus(response.stakingReferralBonus);
      setUsdt(response.usdt);
      setBnb(response.bnb);
    } catch (err) {
      swal("Error", err.message, "error");
    }
    setLoader(false);
  };

  const { changeBackground } = useContext(ThemeContext);
  useEffect(() => {
    changeBackground({ value: "dark", label: "Dark" });
    FetchData();

    if (
      state.auth.userDetails.old_wallet_public_key === null ||
      state.auth.userDetails.old_wallet_public_key === ""
    ) {
      toast.error(
        "Please update your Old wallet address by Going In Profile Section ",
        {
          position: "bottom-center",
        }
      );
    }
  }, []);

  return (
    <>
      <Toaster />
      {loader === true ? (
        <Loader />
      ) : (
        <>
          <div className="row">
            <div className="col-xl-12">
              <div className="row">
                <div className="col-xl-12">
                  <div className="card bubles">
                    <div className="card-body">
                      <div className="buy-coin  bubles-down">
                        <div>
                          <h2>{t("dashboard_header_card_description")}</h2>
                          <Link to={"/buy"} className="btn btn-primary">
                            {t("dashboard_header_card_buy")}
                          </Link>
                        </div>
                        <div className="coin-img">
                          <img src={coin} className="img-fluid" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <SwiperSlider
                  bxgavailable={bxgavailable}
                  bxgstacked={bxgstacked}
                  totalEarning={totalEarning}
                  referralBonus={referralBonus}
                  stakingreferralBonus={stakingreferralBonus}
                  usdt={usdt}
                  bnb={bnb}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default Home;
