import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const UsdtTab = ({ acceptedData, to, handleConnectClick }) => {
  const { t } = useTranslation();

  const state = useSelector((state) => state);
  const [data, setData] = useState(
    document.querySelectorAll("#futureorder_wrapper tbody tr")
  );
  const sort = 6;
  const activePag = useRef(0);
  const [test, settest] = useState(0);

  // Active data
  const chageData = (frist, sec) => {
    for (var i = 0; i < data.length; ++i) {
      if (i >= frist && i < sec) {
        data[i].classList.remove("d-none");
      } else {
        data[i].classList.add("d-none");
      }
    }
  };

  const getFormattedDate = (date) => {
    //get only day and month in english
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.toLocaleString("default", { month: "short" });
    const day = d.getDate();
    return `${day} ${month} ${year}`;
  };
  // use effect
  useEffect(() => {
    setTimeout(() => {
      setData(document.querySelectorAll("#futureorder_wrapper tbody tr"));
    }, 500);
    //chackboxFun();
  }, [test]);

  // Active pagginarion
  activePag.current === 0 && chageData(0, sort);
  // paggination
  let paggination = Array(Math.ceil(acceptedData.length / sort))
    .fill()
    .map((_, i) => i + 1);

  // Active paggination & chage data
  const onClick = (i) => {
    activePag.current = i;
    chageData(activePag.current * sort, (activePag.current + 1) * sort);
    settest(i);
  };
  return (
    <>
      <div className="table-responsive dataTabletrade ">
        <div id="futureorder_wrapper" className="dataTables_wrapper no-footer">
          <table
            id="example"
            className="table display dataTable no-footer"
            style={{ minWidth: "845px" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>{t("From")}</th>
                <th>{t("To")}</th>
                {/* <th>Block Hash</th> */}
                <th>Amount </th>

                <th className="text-end">{t("date")}</th>
              </tr>
            </thead>
            <tbody>
              {acceptedData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {state.auth.auth.isAdmin ? (
                    <td>
                      <Link
                        onClick={() => {
                          handleConnectClick(item.user_id);
                        }}>
                        {item.user.wallet_public_key}{" "}
                        {item.user.wallet_public_key ===
                        state.auth.userDetails.wallet_public_key ? (
                          <Badge className="mx-3" bg="success">
                            {t("Admin")}
                          </Badge>
                        ) : null}
                      </Link>
                    </td>
                  ) : (
                    <td>{item.user.wallet_public_key}</td>
                  )}

                  <td>{item.wallet_address}</td>
                  {/* <td>{item.blockhash}</td> */}
                  <td>{item.amount}</td>

                  <td className="text-end">
                    {getFormattedDate(item.requested_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-sm-flex text-center justify-content-between align-items-center mt-3 mb-3">
            <div className="dataTables_info">
              {t("showing")} {activePag.current * sort + 1} {t("to")}{" "}
              {acceptedData.length > (activePag.current + 1) * sort
                ? (activePag.current + 1) * sort
                : acceptedData.length}{" "}
              {t("of")} {acceptedData.length} {t("entries")}
            </div>
            <div
              className="dataTables_paginate paging_simple_numbers mb-0"
              id="application-tbl1_paginate">
              <Link
                className="paginate_button previous "
                to={to}
                onClick={() =>
                  activePag.current > 0 && onClick(activePag.current - 1)
                }>
                <i className="fa fa-angle-double-left"></i>
              </Link>
              <span>
                {paggination.map((number, i) => (
                  <Link
                    key={i}
                    to={to}
                    className={`paginate_button  ${
                      activePag.current === i ? "current" : ""
                    } `}
                    onClick={() => onClick(i)}>
                    {number}
                  </Link>
                ))}
              </span>

              <Link
                className="paginate_button next"
                to={to}
                onClick={() =>
                  activePag.current + 1 < paggination.length &&
                  onClick(activePag.current + 1)
                }>
                <i className="fa fa-angle-double-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default UsdtTab;
