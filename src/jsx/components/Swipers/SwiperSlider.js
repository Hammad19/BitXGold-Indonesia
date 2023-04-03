import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperSlideCard from "./SwiperSlideCard";

const SwiperSlider = ({
  bxgavailable,
  bxgstacked,
  referralBonus,
  stakingreferralBonus,
  totalEarning,
  usdt,
  bnb,
}) => {
  return (
    <>
      <div className="col-xl-12">
        <Swiper
          className="mySwiper"
          speed={1500}
          slidesPerView={3}
          spaceBetween={20}
          loop={false}
          breakpoints={{
            300: {
              slidesPerView: 1,
              spaceBetween: 30,
            },
            416: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1200: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}>
          <SwiperSlide>
            <SwiperSlideCard
              amount={bxgavailable}
              translateKey="dashboard_card_1"
              currency="BXG"
            />
          </SwiperSlide>
          <SwiperSlide>
            <SwiperSlideCard
              amount={bxgstacked}
              translateKey="dashboard_card_2"
              currency=" BXG"
            />
          </SwiperSlide>
          <SwiperSlide>
            <SwiperSlideCard
              amount={referralBonus}
              translateKey="dashboard_card_3"
              currency=" USDT"
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="col-xl-12">
        <Swiper
          className="mySwiper"
          speed={1500}
          slidesPerView={4}
          spaceBetween={20}
          loop={false}
          //autoplay= {{
          //delay: 1200,
          //}}
          //modules={[ Autoplay ]}
          breakpoints={{
            300: {
              slidesPerView: 1,
              spaceBetween: 30,
            },
            416: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}>
          <SwiperSlide>
            <SwiperSlideCard
              amount={stakingreferralBonus}
              translateKey="dashboard_card_4"
              currency=" BXG"
            />
          </SwiperSlide>
          <SwiperSlide>
            <SwiperSlideCard
              amount={totalEarning}
              translateKey="dashboard_card_5"
              currency=" BXG"
            />
          </SwiperSlide>

          <SwiperSlide>
            <SwiperSlideCard
              amount={usdt}
              translateKey="dashboard_card_6"
              currency="USDT"
            />
          </SwiperSlide>
          <SwiperSlide>
            <SwiperSlideCard
              amount={bnb}
              translateKey="dashboard_card_7"
              currency="BNB"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
};

export default SwiperSlider;
