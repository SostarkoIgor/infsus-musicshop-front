import React from "react";
import { Product } from "../types/product";
import styles from "../styles/productForm.module.css";
import { useParams } from "react-router-dom";

function ProductForm(){

    const { id } = useParams();

    return <></>
};

export default ProductForm;