import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { getOrderList } from "../actions/orderAction";

import Loader from "../components/organisms/Loader";
import Message from "../components/atoms/MessageComponent";
import PageLoader from "../components/molecules/PageLoader";
import Meta from "../components/atoms/Meta";

export const Order = ({ orderList, getOrderList }) => {
  const { loading, error, orders } = orderList;

  useEffect(() => {
    getOrderList();
  }, [getOrderList]);

  if (!error && !loading && !orders) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (loading) return <PageLoader />;
  if (orders && orders.length === 0) return <h1>No Order yet!</h1>;
  else if (orders && orders.length !== 0)
    return (
      <>
        <Meta title="Order List" />
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <ul className="pagination pagination-sm m-0 float-left">
                    <li className="page-item">
                      <a className="page-link" href="#">
                        «
                      </a>
                    </li>
                    {/* {pages && renderPagination()} */}
                    <li className="page-item">
                      <a className="page-link" href="#">
                        »
                      </a>
                    </li>
                  </ul>
                </h3>
                <div className="card-tools">
                  <div
                    className="input-group input-group-md"
                    style={{ width: "300px" }}
                  >
                    <input
                      type="text"
                      name="table_search"
                      className="form-control float-right"
                      placeholder="Search"
                    />
                    <div className="input-group-append">
                      <button type="submit" className="btn btn-default">
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                    <div className="input-group-append">
                      <Link to={"/products/new"} className="btn btn-default">
                        <i className="fas fa-plus"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body table-responsive p-0">
                <table className="table table-bordered table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>#No</th>
                      <th>Shipping Address/Name</th>
                      <th>Total Price/Unit Price</th>
                      <th>Paid Status/Quantity</th>
                      <th>Delivered Status</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders &&
                      orders.map(
                        (
                          {
                            _id,
                            shippingAddress: {
                              address,
                              city,
                              postalCode,
                              country,
                            },
                            orderItems,
                            totalPrice,
                            isPaid,
                            isDelivered,
                            createdAt,
                            updatedAt,
                          },
                          idx
                        ) => {
                          const rowSpanLength = orderItems.length + 1;
                          return (
                            <>
                              <tr key={_id + createdAt}>
                                <td>{_id}</td>
                                <td>{`${address}, ${city}, ${country}`}</td>
                                <td>${totalPrice}</td>
                                <td>{isPaid ? "Paid" : "Waiting For Paid"}</td>
                                <td>
                                  {isDelivered ? "Delivered" : "On The Way"}
                                </td>
                                <td>
                                  {
                                    new Date(createdAt)
                                      .toGMTString()
                                      .split(" GMT")[0]
                                  }
                                </td>
                                <td>
                                  {
                                    new Date(updatedAt)
                                      .toGMTString()
                                      .split(" GMT")[0]
                                  }
                                </td>
                                <td>
                                  {" "}
                                  <i
                                    className="far fa-edit"
                                    style={{
                                      cursor: "pointer",
                                      marginRight: "10px",
                                    }}
                                  ></i>
                                  <i
                                    className="fas fa-trash"
                                    style={{
                                      cursor: "pointer",
                                    }}
                                  ></i>
                                </td>
                              </tr>
                              {orderItems.map(
                                ({
                                  unitPrice,
                                  quantity,
                                  product: { _id, name, image },
                                }) => {
                                  return (
                                    <tr key={_id}>
                                      <td className="table-active"></td>
                                      <td>{name}</td>
                                      <td>${unitPrice}</td>
                                      <td>{quantity}</td>
                                      <td className="table-active"></td>
                                      <td className="table-active"></td>
                                      <td className="table-active"></td>
                                      <td className="table-active"></td>
                                    </tr>
                                  );
                                }
                              )}
                            </>
                          );
                        }
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    );
};

const mapStateToProps = (state) => ({
  orderList: state.orderList,
});

const mapDispatchToProps = {
  getOrderList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);
