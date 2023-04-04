import React from "react";
import { useTranslation } from "react-i18next";

export default function AdminDashboardCard(props) {
  const { t } = useTranslation();
  return (
    <div
      className={`col-xl-${props.col}  col-lg-${props.col * 2} col-sm-${
        props.col * 3
      } col-md-${props.col * 2}`}>
      <div className="widget-stat card">
        <div className="card-body  p-4">
          <div className="media ai-icon">
            <span className="me-3 bgl-danger text-danger">{props.svg}</span>
            <div className="media-body">
              <p className="mb-1"> {t(props.translateKey)} </p>
              <h4 className="mb-0">
                {Math.round(props.bxg * 100000) / 100000}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
