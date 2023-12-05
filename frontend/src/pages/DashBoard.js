import React, { useRef, useState } from "react";
import Meta from "../components/atoms/Meta";
import { VectorMap } from "react-jvectormap";
import { connect } from "react-redux";

export const DashBoard = ({ userInfo }) => {
  const [country, setCountry] = useState("VIETNAM");
  const MyVectorMap = () => {
    return (
      <div style={{ width: "100%" }}>
        <VectorMap
          zoomOnScroll={false}
          zoomButtons={false}
          map={"world_mill"}
          backgroundColor="white"
          containerStyle={{
            width: "100%",
            height: "100%",
          }}
          markerStyle={{
            initial: {
              fill: "#5E32CA",
              stroke: "#383f47",
            },
          }}
          containerClassName="map"
          series={{
            regions: [
              {
                scale: ["#E2AEFF", "#5E32CA"],
                attribute: "fill",
                values: { VN: 100, VN: 100 },
                normalizeFunction: "polynomial",
                min: 0,
                max: 100,
              },
            ],
          }}
          regionStyle={{
            initial: {
              fill: "#D1D5DB",
              "fill-opacity": 1,
              stroke: "#265cff",
              "stroke-width": 0,
              "stroke-opacity": 0,
            },
            hover: {
              "fill-opacity": 0.8,
              fill: "",
              stroke: "#2b2b2b",
              cursor: "pointer",
            },
            selected: {
              fill: "#FFFB00",
            },
          }}
          onRegionTipShow={function (event, label, code, ...props) {
            setCountry(label.html());
          }}
        />
      </div>
    );
  };

  return (
    <>
      <Meta title="Dashboard" />
      <div className="page-header">
        <div className="row align-items-center">
          <div className="col-sm mb-2 mb-sm-0">
            <h1 className="page-header-title">
              Good morning, Mr.{userInfo.name}.
            </h1>
            <p className="page-header-text">
              Here's what's happening with your store this month.
            </p>
          </div>
        </div>
      </div>
      <div className="card card-body">
        <div className="row">
          <div className="col-lg-3 col-6">
            <div className="small-box">
              <div className="inner">
                <h6 className="card-subtitle">IN-STORE SALES</h6>
                <h3>$7,820.75</h3>

                <p>5k orders</p>
              </div>
              <span
                style={{
                  borderRadius: "50%",
                  color: "#71869d",
                  background: "rgba(113,134,157,.1)",
                  fontSize: ".875rem",
                  width: "2.40625rem",
                  height: "2.40625rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px",
                  marginRight: "10px",
                  marginTop: "10px",
                  marginRight: "10px",
                }}
              >
                <i className="nav-icon fas fa-store"></i>
              </span>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box">
              <div className="inner">
                <h6 className="card-subtitle">WEBSITE SALES</h6>
                <h3>$985,937.45</h3>

                <p>21k orders</p>
              </div>
              <span
                style={{
                  borderRadius: "50%",
                  color: "#71869d",
                  background: "rgba(113,134,157,.1)",
                  fontSize: ".875rem",
                  width: "2.40625rem",
                  height: "2.40625rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px",
                  marginRight: "10px",
                }}
              >
                <i className="nav-icon fas fa-envelope-open-text"></i>
              </span>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box">
              <div className="inner">
                <h6 className="card-subtitle">DISCOUNT</h6>
                <h3>$15,503.00</h3>

                <p>6k orders</p>
              </div>
              <span
                style={{
                  borderRadius: "50%",
                  color: "#71869d",
                  background: "rgba(113,134,157,.1)",
                  fontSize: ".875rem",
                  width: "2.40625rem",
                  height: "2.40625rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px",
                  marginRight: "10px",
                }}
              >
                <i className="nav-icon fas fa-percent"></i>
              </span>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box">
              <div className="inner">
                <h6 className="card-subtitle">AFFILIATE</h6>
                <h3>$3,982.53</h3>

                <p>150 orders</p>
              </div>
              <span
                style={{
                  borderRadius: "50%",
                  color: "#71869d",
                  background: "rgba(113,134,157,.1)",
                  fontSize: ".875rem",
                  width: "2.40625rem",
                  height: "2.40625rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px",
                  marginRight: "10px",
                }}
              >
                <i className="nav-icon fas fa-user-friends"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          Your top countries: <h2>{country}</h2>
        </div>
        <div className="card-body">
          <div className="row col-sm-divider">
            <div className="col-sm-3">
              <div className="d-lg-flex align-items-lg-center">
                <div className="flex-shrink-0">
                  <i className="bi-person fs-1"></i>
                </div>

                <div className="flex-grow-1 ms-lg-3">
                  <span className="d-block fs-6">Users</span>
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0">34,413</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="d-lg-flex align-items-lg-center">
                <div className="flex-shrink-0">
                  <i className="bi-clock-history fs-1"></i>
                </div>

                <div className="flex-grow-1 ms-lg-3">
                  <span className="d-block fs-6">Avg. session duration</span>
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0">1m 3s</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="d-lg-flex align-items-lg-center">
                <div className="flex-shrink-0">
                  <i className="bi-files-alt fs-1"></i>
                </div>

                <div className="flex-grow-1 ms-lg-3">
                  <span className="d-block fs-6">Pages/Sessions</span>
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0">1.78</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="d-lg-flex align-items-lg-center">
                <div className="flex-shrink-0">
                  <i className="bi-pie-chart fs-1"></i>
                </div>

                <div className="flex-grow-1 ms-lg-3">
                  <span className="d-block fs-6">Bounce rate</span>
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0">62.9%</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-0" />
        <div className="card-body">
          <MyVectorMap />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.userLogin.userInfo,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
