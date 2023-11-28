import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {
  listProducts,
  deleteProduct,
  listProductModalDetails,
} from "../actions/productActions";
import { ListItem } from "../components/atoms/CartItem/CartItem.styles";
import Prefetch from "../components/molecules/Prefetch";
import Modal from "../components/atoms/Modal";

export function Products({
  listProducts,
  isShop,
  products,
  pages,
  page,
  loading,
  history,
  deleteProduct,
  listProductModalDetails,
}) {
  const [showModal, setShowModal] = useState(false);
  const [modalId, setModalId] = useState("");
  useEffect(() => {
    listProducts("", 1);
  }, [listProducts, deleteProduct]);
  if (loading) {
    return (
      <ListItem>
        <Prefetch loading={loading} />
      </ListItem>
    );
  }

  const renderPagination = () => {
    const paginationList = [];
    for (let i = 1; i <= pages; i++) {
      const isActive = page === i ? "active" : "";
      paginationList.push(
        <li className={`page-item ${isActive}`} key={"page" + i}>
          <a
            className={`page-link ${isActive}`}
            href=""
            onClick={(event) => {
              event.preventDefault();
              if (page !== i) {
                listProducts("", i);
              }
            }}
          >
            {i}
          </a>
        </li>
      );
    }
    return paginationList;
  };
  return (
    <>
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
                  {pages && renderPagination()}
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
              <table className="table table-hover text-nowrap">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Product Name</th>
                    <th>Unit Price</th>
                    <th>Count In Stock</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products &&
                    products.map(
                      (
                        {
                          _id,
                          name,
                          unitPrice,
                          countInStock,
                          createdAt,
                          updatedAt,
                        },
                        idx
                      ) => {
                        return (
                          <tr key={_id + name}>
                            <td>{_id}</td>
                            <td>{name}</td>
                            <td>${unitPrice}</td>
                            <td>{countInStock}</td>
                            <td>
                              {
                                new Date(createdAt)
                                  .toGMTString()
                                  .split(" GMT")[0]
                              }
                            </td>
                            <td>
                              {
                                new Date(createdAt)
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
                                onClick={() => listProductModalDetails(_id)}
                              ></i>
                              <i
                                className="fas fa-trash"
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => deleteProduct(_id)}
                              ></i>
                            </td>
                          </tr>
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
}

const mapStateToProps = (state) => ({
  isShop: state.userLogin.userInfo?.isShop,
  products: state.productList.products,
  pages: state.productList.pages,
  page: state.productList.page,
  loading: state.productList.loading,
});

const mapDispatchToProps = {
  listProducts,
  deleteProduct,
  listProductModalDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
