import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Card, CardBody, CardHeader, Col, Form, Row } from "react-bootstrap";

import "react-quill/dist/quill.snow.css";

import { uploadImage, createProduct } from "../actions/productActions";
import CreateFormInput from "../components/atoms/CreateFormInput";
import Meta from "../components/atoms/Meta";
import axios from "axios";
import { prefixAPI } from "../types";
import EmptyImage from "../assets/emptyImage.svg";

export function Product({ productImage, uploadImage, createProduct }) {
  const validateMessageEnums = {
    FIELD_REQUIRED: (validateField) =>
      `Please fill required *${validateField}*`,
    IMAGE_TYPE_REQUIRE: () =>
      `Please select a valid image file (JPEG, PNG, JPG)`,
    IMAGE_SIZE_TOO_LARGE: () =>
      `Selected file is too large. Please choose a smaller file.`,
  };
  const [dataForm, setDataForm] = useState({
    name: "",
    description: "",
    category: [],
    unitPrice: 0,
    countInStock: 0,
    image: "",
  });

  const { loading, image, error } = productImage;

  const fileInputRef = useRef(null);

  const handleCardImgClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click event
    }
  };

  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    const {
      data: { categoryList },
    } = await axios.get(`${prefixAPI}/api/categories`);
    setCategories(categoryList);
  };

  const handleDataChange = (e) => {
    let eventName = e.target.name;
    let newValue;
    switch (eventName) {
      case "unitPrice":
        newValue = parseFloat(e.target.value);
        if (isNaN(newValue)) {
          newValue = "";
        }
        break;
      case "countInStock":
        // Validation for integer
        newValue = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
        break;
      // Add more cases for other fields if needed
      default:
        // Default case for text fields
        newValue = e.target.value;
        break;
    }
    setDataForm({ ...dataForm, [eventName]: newValue });
  };

  const handleCategorySelect = (e) => {
    const { value } = e.target;
    if (dataForm.category.includes(value)) {
      let categoryListNew = dataForm.category.filter(
        (category) => category !== value
      );
      setDataForm({
        ...dataForm,
        ["category"]: categoryListNew,
      });
    } else {
      //
      setDataForm({ ...dataForm, ["category"]: [...dataForm.category, value] });
    }
  };

  const handleImageChange = (e) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file) {
      // Perform validation if needed (e.g., file type, size)
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        alert(validateMessageEnums.IMAGE_TYPE_REQUIRE());
        e.target.value = "";
        return false;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert(validateMessageEnums.IMAGE_SIZE_TOO_LARGE());
        e.target.value = "";
        return false;
      }
      uploadImage(file); // upload file
    }
  };

  // Submit to create new product
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const blankValidateFields = ["name", "description", "image", "category"];
    const categoryList = [];
    for (let category of dataForm.category) {
      categoryList.push(category.split("|")[0]);
    }
    const publishDataForm = {
      ...dataForm,
      category: categoryList,
      image,
    };

    if (!blankValidate(publishDataForm, blankValidateFields)) return;

    createProduct(publishDataForm);
  };

  const blankValidate = (target, fields) => {
    let isValid = true;
    let errorField = null;

    for (let propertyName of Object.getOwnPropertyNames(target)) {
      // If validate invalid data, out loop
      if (!isValid) break;
      // Only validate field required
      if (!fields.includes(propertyName)) continue;
      // Validate length of field
      if (target[propertyName].length !== 0) continue;

      // Invalid data found, set data for display
      isValid = false;
      errorField = validateMessageEnums.FIELD_REQUIRED(propertyName);
    }

    if (!isValid) alert(errorField);
    return isValid;
  };

  useEffect(() => {
    getCategories();
  }, []);
  return (
    <>
      <Meta title="Create Product" />
      <Row>
        <Col sm={8}>
          <Card className="card-body">
            <CardHeader>Product Information</CardHeader>
            <CardBody>
              <Col>
                <Row>
                  <CreateFormInput
                    name="name"
                    value={dataForm.name}
                    isHolder={true}
                    onChange={handleDataChange}
                  />
                </Row>
                <Row>
                  <CreateFormInput
                    name="description"
                    value={dataForm.description}
                    isHolder={true}
                    onChange={handleDataChange}
                  />
                </Row>
                <Row>
                  {" "}
                  <CreateFormInput
                    name="unitPrice"
                    type="text"
                    value={dataForm.unitPrice}
                    onChange={handleDataChange}
                  />
                </Row>
                <Row>
                  <CreateFormInput
                    name="countInStock"
                    type="text"
                    pattern="[0-9]*"
                    value={dataForm.countInStock}
                    onChange={handleDataChange}
                  />
                </Row>
              </Col>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              ></div>
            </CardBody>
            <Card.Footer>
              <Card.Header>Product Category</Card.Header>
              <Row className="justify-content-between mt-3">
                <Col className="overflow-hidden" sm={3}>
                  <Form.Select
                    style={{ overflowY: "scroll" }}
                    aria-label="Default select example"
                    multiple
                  >
                    {categories.length != 0 &&
                      categories.map(
                        ({ _id, categoryName, categoryIcon }, index) => {
                          const categoryHash =
                            categoryName + "|" + categoryIcon + "|" + _id;
                          return (
                            <option
                              key={_id}
                              value={categoryHash}
                              style={{
                                background: dataForm.category.includes(
                                  categoryHash
                                )
                                  ? "lightblue"
                                  : "",
                              }}
                              onClick={() => {
                                handleCategorySelect({
                                  target: {
                                    value: categoryHash,
                                  },
                                });
                              }}
                            >
                              {categoryName}
                            </option>
                          );
                        }
                      )}
                  </Form.Select>
                </Col>
                <Col sm={9}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      width: "1fr",
                      alignContent: "flex-start",
                      overflowY: "scroll",
                      gap: "0 10px",
                    }}
                  >
                    {dataForm.category.map((category, index) => {
                      // category = categoryName|categoryIcon|_id
                      const splitCategory = category.split("|");
                      return (
                        <div
                          key={splitCategory[2]}
                          style={{
                            marginBottom: "5px",
                            marginTop: "5px",
                          }}
                        >
                          <div
                            style={{
                              background: "#FFFFFF",
                              cursor: "pointer",
                              padding: 5,
                              border: "3px solid #f8e3ae",
                              borderRadius: "0.5rem",
                            }}
                            onClick={() => {
                              handleCategorySelect({
                                target: {
                                  value:
                                    splitCategory[0] +
                                    "|" +
                                    splitCategory[1] +
                                    "|" +
                                    splitCategory[2],
                                },
                              });
                            }}
                          >
                            <img
                              width={30}
                              height={30}
                              src={prefixAPI + splitCategory[1]}
                              style={{ marginRight: "10px" }}
                            />
                            <span>{splitCategory[0]}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
        <Col sm={4}>
          <Card className="card-body">
            <Card.Header>Media</Card.Header>
            <Card.Body>
              <Card.Body>
                {image ? (
                  <Card.Img
                    src={prefixAPI + image}
                    alt="Uploaded"
                    height={300}
                    onClick={handleCardImgClick}
                  />
                ) : (
                  <>
                    <Card.Img
                      src={EmptyImage}
                      alt="Empty"
                      height={300}
                      onClick={handleCardImgClick}
                    />
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="mb-3"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </Card.Body>
            </Card.Body>
            <Card.Footer>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <button
                  className="btn btn-success"
                  type="submit"
                  onClick={handleFormSubmit}
                >
                  Submit
                </button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </>
  );
}

const mapStateToProps = (state) => ({
  productImage: state.productImage,
});

const mapDispatchToProps = {
  uploadImage,
  createProduct,
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
