import React from "react";
import { Product } from "../types/product";
import styles from "../styles/styles.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct, deleteProduct, createProduct } from "../services/productService";
import { getAllCategories } from "../services/categoryService";
import { Category } from "../types/category";
import Loader from "../components/loader";
import { getAllProducts } from "../services/productService";

function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = React.useState<Product>(new Product());
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [loading2, setLoading2] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [validationErrors, setValidationErrors] = React.useState<{ [key: string]: string }>({});
    const [idToSearch, setIdToSearch] = React.useState("");

    const [products, setProducts] = React.useState<Product[]>([]);

    const validate = () => {
        const errors: { [key: string]: string } = {};
        const urlRegex = /^(https?:\/\/(?:[\w-]+\.)+[a-z]{2,6}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?)$/i;
        if (!product.name || product.name.trim() === "") errors.name = "Name is required";
        if (product.price === undefined || product.price < 0) errors.price = "Price must be a non-negative number";
        if (!product.description || product.description.trim().length < 5) errors.description = "Description too short";
        if (product.image && !urlRegex.test(product.image)) {
            errors.image = "Image must be a valid URL";
        }
        if (product.times_visited === undefined || product.times_visited < 0) errors.timesVisited = "Times visited must be a non-negative number";
        return errors;
    };

    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        const errors = validate();
        setValidationErrors(errors);
        if (Object.keys(errors).length > 0) return;

        try {
            let product_ = { ...product };
            if ((product_.category_id === undefined || product_.category_id === null) && categories.length > 0) {
                product_.category_id = categories[0].id;
            }
            if (id) {
                await updateProduct(product_);
            } else {
                const created = await createProduct(product_);
                navigate(`/product/${created.id}`);
            }
        } catch (error) {
            setError("Failed to update product");
        }
    };

    const deleteAction = async () => {
        if (id) {
            try {
                await deleteProduct(Number(id));
                setIdToSearch("");
                setError(null);
                navigate("/product");
                window.location.reload();
            } catch (error) {
                setError("Failed to delete product");
            }
        }
    };

    React.useEffect(() => {
        setLoading(true);
        setLoading2(true);
        const fetchProducts = async () => {
            try {
                const products = await getAllProducts();
                if (products.length === 0) {
                    setError("No products found. Please create a product first.");
                }
                setProducts(products);
                setIdToSearch(products.length > 0 ? products[0].id!.toString() : "");
            } catch (error) {
                setError("Failed to fetch products");
            }
        };
        const fetchProduct = async () => {
            if (id) {
                try {
                    const p = await getProductById(Number(id));
                    setProduct(p);
                } catch (error) {
                    setError("Failed to fetch product");
                    navigate("/not-found");
                    setProduct(new Product());
                }
            } else {
                setProduct(new Product());
            }
            setLoading(false);
        };

        const fetchCategories = async () => {
            try {
                const cats = await getAllCategories();
                setCategories(cats);
            } catch (error) {
                setError("Failed to fetch categories");
            }
            setLoading2(false);
        };

        fetchProduct();
        fetchProducts();
        fetchCategories();
    }, [id]);

    if (loading || loading2) return <div className={styles.loading}><Loader /></div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{id ? "Edit Product" : "Create Product"}</h1>
            <div className={styles.searchContainer}>
                <select name="product" value={idToSearch} onChange={(e) => {
                    setIdToSearch(e.target.value);
                        }} className={styles.select}>
                        {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>
                <button
                    className={styles.button}
                    onClick={() => {
                        if (idToSearch) {
                            setError(null);
                            setValidationErrors({});
                            navigate(`/product/${idToSearch}`);
                        }
                    }}>
                    <span className={"material-symbols-outlined " + styles.deleteIcon}>search</span>
                    <span>Search</span>
                </button>
            </div>
            <form className={styles.form} onSubmit={submitForm}>
                <div className={styles.formContent}>
                    <div className={styles.formElement}>
                        <label className={styles.label}>Product Name:</label>
                        <input
                            type="text"
                            value={product.name}
                            onChange={(e) => setProduct({ ...product, name: e.target.value })}
                            className={styles.input}
                        />
                        {validationErrors.name && <div className={styles.error}>{validationErrors.name}</div>}
                    </div>
                    <div className={styles.formElement}>
                        <label className={styles.label}>Price:</label>
                        <input
                            type="number"
                            value={product.price}
                            onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                            className={styles.input}
                        />
                        {validationErrors.price && <div className={styles.error}>{validationErrors.price}</div>}
                    </div>
                    <div className={styles.formElement}>
                        <label className={styles.label}>Description:</label>
                        <textarea
                            value={product.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            className={styles.textarea}
                        />
                        {validationErrors.description && <div className={styles.error}>{validationErrors.description}</div>}
                    </div>
                    <div className={styles.formElement}>
                        <label className={styles.label}>Category:</label>
                        <select
                            value={product.category_id}
                            onChange={(e) => setProduct({ ...product, category_id: Number(e.target.value) })}
                            className={styles.select}
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formElement}>
                        <label className={styles.label}>Image URL:</label>
                        <input
                            type="text"
                            value={product.image || ""}
                            placeholder="https://example.com/image.jpg"
                            onChange={(e) => setProduct({ ...product, image: e.target.value })}
                            className={styles.input}
                        />
                        {validationErrors.image && <div className={styles.error}>{validationErrors.image}</div>}
                    </div>
                    <div className={styles.formElement}>
                        <label className={styles.label}>Times Visited:</label>
                        <input
                            type="number"
                            value={product.times_visited}
                            onChange={(e) => setProduct({ ...product, times_visited: Number(e.target.value) })}
                            className={styles.input}
                        />
                        {validationErrors.timesVisited && <div className={styles.error}>{validationErrors.timesVisited}</div>}
                    </div>
                </div>
                <div className={styles.buttons}>
                    <button type="submit" className={styles.button + " " + styles.save}>
                        <span className={"material-symbols-outlined " + styles.saveIcon}>save</span>
                        <span>Save</span>
                    </button>
                    {id && <>
                        <button type="button" className={styles.button + " " + styles.delete} onClick={deleteAction}>
                            <span className={"material-symbols-outlined " + styles.deleteIcon}>delete</span>
                            <span>Delete</span>
                        </button>
                        <button type="button" className={styles.button + " " + styles.create} onClick={() => {
                            navigate("/");
                            setLoading(true);
                            setError(null);
                        }}>
                            <span className={"material-symbols-outlined " + styles.createIcon}>create</span>
                            <span>Create new</span>
                        </button>
                    </>}
                </div>
            </form>
            <div className={styles.error}>{error}</div>
        </div>
    );
}

export default ProductForm;
