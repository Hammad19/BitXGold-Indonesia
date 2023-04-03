import axios from "axios";
import { store } from "../store/store";

const axiosInstance = axios.create({
  //baseURL: `http://localhost:8080`,
  //baseURL: `https://api.bitx.gold`,
  baseURL: `https://bitxbackend.herokuapp.com`,
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

  console.log(data7.data, "data7.data");

  const data8 = await axiosInstance.get("/api/usdt/" + wallet_address);
  const data9 = await axiosInstance.get("/api/bnb/" + wallet_address);

  var referalbonus = 0;
  var stakingreferbonus = 0;
  data6.data
    .filter(
      (item) =>
        item?.referer_userId === wallet_address && item?.type === "claimed"
    )
    .map((item) => {
      stakingreferbonus = stakingreferbonus + item.reward;
    });

  data7.data
    .filter((item) => item?.referer_userId === wallet_address)
    .map((item) => {
      referalbonus = referalbonus + item.reward;
    });

  console.log(data8.data.usdt, "usdt");

  return {
    availableBXG: data.bxg,
    bxgStaked: data1.data.bxg,
    totalEarning: data1.data.total_claim_reward,
    referalBonus: referalbonus,
    stakingReferralBonus: stakingreferbonus,
    usdt: data8.data.usdt,
    bnb: data9.data.bnb,
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
    ?.filter((item) => item.type === "stake")
    .reverse();

  //filter data.data and add all the bxg values and set it to totalamountclaimed
  var amountclaimed = filterArrayAndReturnTotal(data.data, "claim");
  var amountstaked = filterArrayAndReturnTotal(data.data, "stake");
  amountstaked = amountstaked + filterArrayAndReturnTotal(data.data, "staked");

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
    referalData: data.filter((item) => item?.type === "claimed"),
  };
};

export const CountLevels = (data, walletAddress) => {
  var level1 = 0;
  var level2 = 0;
  var level3 = 0;

  data.map((item) => {
    if (item?.referer1_userId === walletAddress) {
      level1 = level1 + 1;
    }
    if (item?.referer2_userId === walletAddress) {
      level2 = level2 + 1;
    }
    if (item?.referer3_userId === walletAddress) {
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
  console.log(data);
  const isreferedData = await axiosInstance.get(
    "/api/bonusrefer/" + walletAddress
  );
  if (isreferedData.data.isRefered) {
    console.log(isreferedData.data.refererUser.wallet_public_key);
    referCode = isreferedData.data.refererUser.wallet_public_key;
  }
  return {
    referCode,
    referalData: data,
  };
};

export const FetchBalances = async (id) => {
  const data8 = await axiosInstance.get("/api/usdt/" + id);
  const data9 = await axiosInstance.get("/api/bnb/" + id);
  const { data } = await axiosInstance.get("/api/bxg/" + id);

  return {
    usdt: data8.data.usdt,
    bnb: data9.data.bnb,
    bxg: data.bxg,
  };
};

export default axiosInstance;
