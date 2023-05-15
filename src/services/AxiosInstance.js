import axios from "axios";
import { store } from "../store/store";
import { ethers } from "ethers";
import bitxGoldSwap from "../../src/contractAbis/BitXGoldSwap.json";

const axiosInstance = axios.create({
  //baseURL: `https://bright-yak-gabardine.cyclic.app`,
  //baseURL: `https://api.bitx.gold`,
  baseURL: `http://localhost:8080`,
  //baseURL: `https://bitxind-7ougt4-microtica.microtica.rocks`,

  //baseURL: `https://bitxgoldbackend-ind-pmgdr57aqq-uc.a.run.app`,
});

axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();

  config.headers["Access-Control-Allow-Origin"] = "*";

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
  const provider = new ethers.getDefaultProvider(
    "https://bsc-dataseed1.binance.org/"
  );
  const bitXSwap = new ethers.Contract(
    bitxGoldSwap.address,
    bitxGoldSwap.abi,
    provider
  );
  const ratio = await bitXSwap.getRatio();

  return ethers.utils.formatUnits(ratio);
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

export const GetValuesForReferPage = async (
  walletAddress,
  oldWalletAddress
) => {
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

  const oldwallet = await axiosInstance.get(
    "/api/refer/ow/" + oldWalletAddress
  );

  const { data } = await axiosInstance.get(
    "/api/stakerefreward/" + walletAddress
  );

  const oldwalletresponse = await axiosInstance.get(
    "/api/stakerefreward/ow/" + oldWalletAddress
  );

  return {
    level1count,
    level2count,
    level3count,
    referalData: data.filter((item) => item?.type === "claimed"),
    oldReferalData: oldwalletresponse.data[0].filter(
      (item) => item?.type === "claimed"
    ),
    refers: oldwallet.data,
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

export const GetValuesForBonusPage = async (
  walletAddress,
  oldWalletAddress
) => {
  var referCode = "0x0000000000000000000000";
  let oldReferCode;
  const { data } = await axiosInstance.get(
    "/api/bonusrefreward/" + walletAddress
  );

  const oldwalletresponse = await axiosInstance.get(
    "/api/bonusrefreward/ow/" + oldWalletAddress
  );

  const isreferedData = await axiosInstance.get(
    "/api/bonusrefer/" + walletAddress
  );

  const isoldreferedData = await axiosInstance.get(
    "/api/bonusrefer/ow/" + oldWalletAddress
  );
  if (isreferedData.data.isRefered) {
    //console.log(isreferedData.data.refererUser.wallet_public_key);
    referCode = isreferedData.data.refererUser.wallet_public_key;
  }

  if (isoldreferedData.data[0].isRefered) {
    //console.log("here");
    //console.log(isreferedData.data.refererUser.wallet_public_key);
    oldReferCode = isoldreferedData.data[0].refer_code;
  }
  return {
    referCode,
    oldReferCode,
    referalData: data,
    oldReferalData: oldwalletresponse.data[0],
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
