import axios from "axios";
import { store } from "../store/store";

const axiosInstance = axios.create({
  baseURL: `http://localhost:4000`,
  //baseURL: `https://api.bitx.gold`,
  //baseURL: `https://ill-veil-colt.cyclic.app`,
});

axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();

  const token = state.auth.auth.idToken;
  if (token) {
    config.headers["authorization"] = token;
  }
  return config;
});

export async function getDetailsforDashboard(wallet_address) {
  const { data } = await axiosInstance.get("/api/bxg/" + wallet_address);
  const data1 = await axiosInstance.get("/api/stake/" + wallet_address);
  const data6 = await axiosInstance.get(
    "/api/stakerefreward/" + wallet_address
  );
  const data7 = await axiosInstance.get(
    "/api/bonusrefreward/" + wallet_address
  );

  var referalbonus = 0;
  var stakingreferbonus = 0;
  data6.data
    .filter((item) => item.refer_code?.toLowerCase() === wallet_address)
    .map((item) => {
      stakingreferbonus = stakingreferbonus + item.reward;
    });

  data7.data
    .filter((item) => item.refer_code?.toLowerCase() === wallet_address)
    .map((item) => {
      referalbonus = referalbonus + item.reward;
    });

  return {
    availableBXG: data.bxg,
    bxgStaked: data1.data.bxg,
    totalEarning: data1.data.total_claim_reward,
    referalBonus: referalbonus,
    stakingReferralBonus: stakingreferbonus,
  };
}

export const getChangedValue = async () => {
  const { data } = await axios.get("https://www.goldapi.io/api/XAU/USD", {
    headers: {
      "x-access-token": "goldapi-4qjyptlcn9gjtf-io",
      "Content-Type": "application/json",
    },
  });

  return data["price_gram_24k"];
};

export const GetValuesForStakePage = async (walletAddress) => {
  //const {data} = await axiosInstance.get('/api/bxg/'+requestBody.wallet_address);
  const data1 = await axiosInstance.get("/api/stake/" + walletAddress);
  const data = await axiosInstance.get("/api/stakehistory/" + walletAddress);

  let stakedData = data?.data
    ?.filter((item) => item.type === "Stake")
    .reverse();

  //filter data.data and add all the bxg values and set it to totalamountclaimed
  var amountclaimed = filterArrayAndReturnTotal(data.data, "claim");
  var amountstaked = filterArrayAndReturnTotal(data.data, "Stake");
  amountstaked = amountstaked + filterArrayAndReturnTotal(data.data, "Staked");

  return {
    stakedData,
    amountclaimed,
    amountstaked,
    amountAlreadyStaked: data1.data.bxg,
  };
};

//filter array by type and return amount
export const filterArrayAndReturnTotal = (array, type) => {
  var amount = 0;
  array.filter((item) => {
    if (item.type === type) {
      amount = amount + item.bxg;
    }
  });
  return amount;
};

export const GetValuesForReferPage = async (walletAddress) => {
  var level1count = 0;
  var level2count = 0;
  var level3count = 0;
  const response = await axiosInstance
    .get("/api/refer/getall")
    .then((response) => {
      //console.log(response.data);
      const { level1, level2, level3 } = CountLevels(
        response.data,
        walletAddress
      );
      level1count = level1;
      level2count = level2;
      level3count = level3;
    });

  const { data } = await axiosInstance.get(
    "/api/stakerefreward/" + walletAddress
  );

  return {
    level1count,
    level2count,
    level3count,
    referalData: data,
  };
};

export const CountLevels = (data, walletAddress) => {
  var level1 = 0;
  var level2 = 0;
  var level3 = 0;

  data.map((item) => {
    if (item?.refer1?.toLowerCase() === walletAddress) {
      level1 = level1 + 1;
    }
    if (item?.refer2?.toLowerCase() === walletAddress) {
      level2 = level2 + 1;
    }
    if (item?.refer3?.toLowerCase() === walletAddress) {
      level3 = level3 + 1;
    }
  });

  return {
    level1,
    level2,
    level3,
  };
};

export const GetValuesForBonusPage = async (walletAddress) => {
  var referCode = "0x0000000000000000000000";
  const { data } = await axiosInstance.get(
    "/api/bonusrefreward/" + walletAddress
  );
  const isreferedData = await axiosInstance.get(
    "/api/bonusrefer/" + walletAddress
  );
  if (isreferedData.data.isRefered) {
    referCode = isreferedData.data.refer_code;
  }
  return {
    referCode,
    referalData: data,
  };
};

export default axiosInstance;
