import React from "react";
import { useParams } from "react-router-dom";

function ProductForm(){
  const { id } = useParams();
  
  return (
    <div>
      <h1>Product Form</h1>
      <form>
        <label>
          Product Name:
          <input type="text" name="productName" />
        </label>
        <br />
        <label>
          Price:
          <input type="number" name="price" />
        </label>
        <br />
        <label>
          Description:
          <textarea name="description"></textarea>
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProductForm;