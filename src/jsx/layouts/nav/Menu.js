export const MenuList = [
  //DashBoard
  {
    title: "Dashboard",
    //classsChange: 'mm-collapse',
    iconStyle: <i className="material-icons">grid_view</i>,
    to: "dashboard",
    key: "dashboard",
  },

  //BUY
  {
    title: "Buy",
    //classsChange: "mm-collapse",
    iconStyle: <i className="material-icons">currency_bitcoin</i>,
    to: "buy",
    key: "buy",
  },

  //SELL
  {
    title: "Sell",
    //classsChange: 'mm-collapse',
    iconStyle: <i className="material-icons">currency_bitcoin</i>,
    to: "sell",
    key: "sell",
  },

  //STAKE
  {
    title: "Stake",
    //classsChange: 'mm-collapse',
    iconStyle: <i className="material-icons">currency_bitcoin</i>,
    to: "stake",
    key: "stake",
  },

  {
    title: "Deposit",
    //classsChange: 'mm-collapse',
    iconStyle: <i className="material-icons">currency_bitcoin</i>,
    to: "deposit",
    key: "deposit",
  },
  {
    title: "Withdraw",
    //classsChange: 'mm-collapse',
    iconStyle: <i className="material-icons">currency_bitcoin</i>,
    to: "withdraw",
    key: "withdraw",
  },

  {
    title: "Affiliate Awards",
    key: "affiliate_awards",
    classsChange: "mm-collapse",
    iconStyle: <i className="material-icons">grid_view</i>,
    content: [
      {
        title: "Bonus Referral",
        iconStyle: <i className="material-icons">grid_view</i>,
        to: "bonus-referral",
        key: "bonus_referral",
      },
      {
        title: "Staking Referral",
        iconStyle: <i className="material-icons">grid_view</i>,
        to: "staking-referral",
        key: "staking_referral",
      },
    ],
  },

  {
    title: "History",
    key: "history",
    classsChange: "mm-collapse",
    iconStyle: <i className="material-icons">grid_view</i>,
    content: [
      {
        title: "Buy History",
        iconStyle: <i className="material-icons">grid_view</i>,
        to: "buy-history",
        key: "buy_history",
      },
      {
        title: "Sell History",
        iconStyle: <i className="material-icons">grid_view</i>,
        to: "sell-history",
        key: "sell_history",
      },
      {
        title: "Stake History",
        iconStyle: <i className="material-icons">grid_view</i>,
        to: "stake-history",
        key: "stake_history",
      },

      //withdraw history
      {
        title: "Withdraw History",
        iconStyle: <i className="material-icons">grid_view</i>,
        to: "withdraw-history",
        key: "withdraw_history",
      },

      // {
      //   title: "Deposit History",
      //   iconStyle: <i className="material-icons">grid_view</i>,
      //   to: "deposit-history",
      //   key: "deposit_history",
      // },
    ],
  },
];
