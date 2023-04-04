export const AdminMenuList = [
  //DashBoard
  {
    title: "Admin DashBoard",
    //classsChange: 'mm-collapse',
    iconStyle: <i className="material-icons">grid_view</i>,
    to: "admindashboard",
    key: "admin_dashboard",
  },

  //BUY
  {
    title: "Sell Requests",
    //classsChange: 'mm-collapse',
    iconStyle: <i className="material-icons">currency_bitcoin</i>,
    to: "requests",
    key: "requests",
  },

  {
    title: "Withdraw",
    //classsChange: 'mm-collapse',
    iconStyle: <i className="material-icons">currency_bitcoin</i>,
    to: "admin-withdraw",
    key: "admin_withdraw",
  },

  //SELL
  {
    title: "Buy History",
    //classsChange: 'mm-collapse',
    iconStyle: <i className="material-icons">currency_bitcoin</i>,
    to: "admin-buy-history",
    key: "admin_buy_history",
  },

  //STAKE
  {
    title: "Stake History",
    //classsChange: 'mm-collapse',
    iconStyle: <i className="material-icons">currency_bitcoin</i>,
    to: "admin-stake-history",
    key: "admin_stake_history",
  },

  //Widthdraw History
  {
    title: "Withdraw History",
    //classsChange: 'mm-collapse',
    iconStyle: <i className="material-icons">currency_bitcoin</i>,
    to: "admin-withdraw-history",
    key: "admin_withdraw_history",
  },

  // {
  //   title: "Deposit History",
  //   //classsChange: 'mm-collapse',
  //   iconStyle: <i className="material-icons">currency_bitcoin</i>,
  //   to: "admin-deposit-history",
  //   key: "admin_deposit_history",
  // },

  //Settings
  {
    title: "Settings",
    //classsChange: 'mm-collapse',
    iconStyle: <i className="bi bi-gear-wide"></i>,
    to: "admin-setting",
    key: "admin_setting",
  },
];
