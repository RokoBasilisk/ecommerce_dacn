import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  ButtonGroup,
  Dropdown,
  DropdownButton,
  Image,
  Table,
} from "react-bootstrap";

import { getOrderList, setAsDeliveredAdmin } from "../actions/orderAction";

import Loader from "../components/organisms/Loader";
import Message from "../components/atoms/MessageComponent";
import PageLoader from "../components/molecules/PageLoader";
import Meta from "../components/atoms/Meta";
import { prefixAPI } from "../types";

export const Order = ({ orderList, getOrderList, setAsDeliveredAdmin }) => {
  const { loading, error, orders } = orderList;
  const [updateTarget, setUpdateTarget] = useState({
    _id: null,
    isDelivered: false,
  });

  const deliverEnum = {
    VALID_STRING: "Delivered",
    WARNING_STRING: "On The Way",
  };

  const paidEnum = {
    VALID_STRING: "Paid",
    WARNING_STRING: "Pending",
  };

  const handleOnSelect = (e) => {
    setUpdateTarget({
      ...updateTarget,
      isDelivered: e === "true",
    });
  };

  const onChangeHandle = (_id) => {
    if (updateTarget._id === _id) {
      setUpdateTarget({
        _id: null,
        isDelivered: false,
      });
    } else {
      setUpdateTarget({
        _id: _id,
        isDelivered: false,
      });
    }
  };

  const handleUpdateOrder = (e) => {
    e.preventDefault();
    if (!updateTarget._id || !updateTarget.isDelivered) return;

    setAsDeliveredAdmin(updateTarget._id);
  };

  const BadgeComponent = ({
    target,
    validString,
    warningString,
    validColor = "success",
    warningColor = "warning",
  }) => {
    return (
      <span className={`badge text-${target ? validColor : warningColor}`}>
        <span
          className={`bg-${target ? validColor : warningColor}`}
          style={{
            width: "0.5rem",
            height: "0.5rem",
            borderRadius: "50%",
            marginRight: "0.3125rem",
            display: "inline-block",
          }}
        ></span>
        {target ? validString : warningString}
      </span>
    );
  };

  useEffect(() => {
    getOrderList();
  }, [getOrderList, setAsDeliveredAdmin]);

  const renderTableHeaders = () => {
    return (
      <thead className="thead-light">
        <tr>
          <th>Updatable</th>
          <th>#No</th>
          <th>Shipping Address/Name</th>
          <th>Total Price/Unit Price</th>
          <th>Paid Status/Quantity</th>
          <th>Delivered Status</th>
          <th>Created At</th>
          <th>Updated At</th>
        </tr>
      </thead>
    );
  };

  const renderTableRows = () => {
    const rowComponentList = [];
    if (orders) {
      orders.map(
        (
          {
            _id,
            shippingAddress: { address, city, postalCode, country },
            orderItems,
            totalPrice,
            isPaid,
            isDelivered,
            createdAt,
            updatedAt,
          },
          idx
        ) => {
          const orderInfoComponent = (
            <tr key={_id + createdAt}>
              <td>
                <input
                  type="checkbox"
                  onChange={() => onChangeHandle(_id)}
                  checked={updateTarget._id === _id ? true : false}
                  disabled={isDelivered ? true : false}
                />
              </td>
              <td>{_id}</td>
              <td>{`${address}, ${city}, ${country}`}</td>
              <td>${totalPrice}</td>
              <td>
                <BadgeComponent
                  target={isPaid}
                  validString={paidEnum.VALID_STRING}
                  warningString={paidEnum.WARNING_STRING}
                />
              </td>
              <td rowSpan={orderItems.length + 1}>
                {updateTarget._id === _id && !isDelivered && isPaid ? (
                  <DropdownButton
                    as={ButtonGroup}
                    key={"down"}
                    id={`dropdown-button-drop-down`}
                    drop={"down"}
                    variant="secondary"
                    title={
                      updateTarget.isDelivered
                        ? deliverEnum.VALID_STRING
                        : deliverEnum.WARNING_STRING
                    }
                    onSelect={handleOnSelect}
                  >
                    <Dropdown.Item
                      eventKey={true}
                      active={updateTarget.isDelivered}
                    >
                      {deliverEnum.VALID_STRING}
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey={false}
                      active={!updateTarget.isDelivered}
                    >
                      {deliverEnum.WARNING_STRING}
                    </Dropdown.Item>
                  </DropdownButton>
                ) : (
                  <BadgeComponent
                    target={isDelivered}
                    validString={deliverEnum.VALID_STRING}
                    warningString={deliverEnum.WARNING_STRING}
                  />
                )}
              </td>
              <td rowSpan={orderItems.length + 1}>
                {new Date(createdAt).toGMTString().split(" GMT")[0]}
              </td>
              <td rowSpan={orderItems.length + 1}>
                {new Date(updatedAt).toGMTString().split(" GMT")[0]}
              </td>
            </tr>
          );

          const orderItemsComponent = orderItems.map(
            ({ unitPrice, quantity, product: { _id, name, image } }) => {
              return (
                <tr key={_id}>
                  <td className="table-active"></td>
                  <td>
                    <Image src={prefixAPI + image} rounded />
                  </td>
                  <td>{name}</td>
                  <td>${unitPrice}</td>
                  <td>{quantity}</td>
                </tr>
              );
            }
          );
          rowComponentList.push(orderInfoComponent);
          rowComponentList.push(orderItemsComponent);
        }
      );
    }

    return <tbody>{rowComponentList}</tbody>;
  };

  if (!error && !loading && !orders) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (loading) return <PageLoader />;
  return (
    <>
      <Meta title="Order List" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="card-tools">
                <div className="input-group input-group-md">
                  <div className="input-group-append">
                    <button
                      className="btn btn-default"
                      onClick={handleUpdateOrder}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body table-responsive p-0">
              <Table bordered hover responsive>
                {renderTableHeaders()}
                {renderTableRows()}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={8}>No Orders, Working on</td>
                  </tr>
                )}
              </Table>
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
  setAsDeliveredAdmin,
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);
