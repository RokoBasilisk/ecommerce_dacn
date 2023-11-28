import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { uploadImage, createProduct } from "../actions/productActions";

import CreateFormInput from "../components/atoms/CreateFormInput";

export function Product({
  match,
  history,
  productImage,
  uploadImage,
  createProduct,
}) {
  const [dataForm, setDataForm] = useState({
    name: "",
    description: "",
    category: [],
    unitPrice: 0,
    countInStock: 0,
    image: "",
  });

  const { loading, image, error } = productImage;

  const [categories, setCategories] = useState([
    "Category 1",
    "Category 2",
    "Category 3",
    "Category 4",
    "Category 5",
    "Category 6",
    "Category 7",
    "Category 8",
  ]);

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
      setDataForm({ ...dataForm, ["category"]: [...dataForm.category, value] });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file) {
      // Perform validation if needed (e.g., file type, size)
      const validTypes = ["image/jpeg", "image/png", "image/jpg"]; // Add more valid types if needed
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, JPG)");
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert("Selected file is too large. Please choose a smaller file.");
        return;
      }
      uploadImage(file);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    createProduct({
      ...dataForm,
      image,
    });
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CreateFormInput
          name="name"
          value={dataForm.name}
          isHolder={true}
          onChange={handleDataChange}
        />
        <CreateFormInput
          name="description"
          value={dataForm.description}
          isHolder={true}
          onChange={handleDataChange}
        />
        <CreateFormInput
          name="unitPrice"
          type="text"
          value={dataForm.unitPrice}
          onChange={handleDataChange}
        />
        <CreateFormInput
          name="countInStock"
          type="text"
          pattern="[0-9]*"
          value={dataForm.countInStock}
          onChange={handleDataChange}
        />

        <div style={{ display: "grid", gridTemplateColumns: "2fr 7fr" }}>
          <select
            multiple
            size={categories.length} // Adjust as needed
            style={{ width: "200px", height: "100px", userSelect: "none" }} // Adjust container width
            name="category"
            value={dataForm.category}
            onChange={handleCategorySelect}
          >
            {categories.map((category, index) => (
              <option
                key={index}
                value={category}
                style={{
                  background: dataForm.category.includes(category)
                    ? "lightblue"
                    : "",
                }}
              >
                {category}
              </option>
            ))}
          </select>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
            }}
          >
            {dataForm.category.map((category, index) => (
              <div key={index}>{category}</div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <div>
          {image && (
            <img
              src={`http://localhost:5000${image}`}
              alt="Uploaded"
              width="200"
            />
          )}
        </div>
        <button
          className="btn btn-success"
          type="submit"
          onClick={handleFormSubmit}
        >
          Submit
        </button>
      </div>
    </div>
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
