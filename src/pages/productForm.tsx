import React from "react";
import { Product } from "../types/product";
import styles from "../styles/styles.module.css";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { getAllCategories } from "../services/categoryService";
import { Category } from "../types/category";
import { updateProduct } from "../services/productService";
import { useNavigate } from "react-router-dom";
import { deleteProduct, createProduct } from "../services/productService";
import Loader from "../components/loader";

function ProductForm(){

    const { id } = useParams();
    const [product, setProduct] = React.useState<Product>(new Product());
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loading2, setLoading2] = React.useState<boolean>(true);

    const [categories, setCategories] = React.useState<Category[]>([])

    const [error, setError] = React.useState<string | null>(null);

    const [idToSearch, setIdToSearch] = React.useState<string>("");



    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        console.log("Submitting form", product);
        try {
            if (product) {
                let product_: Product = { ...product };
                if ((product_.category_id === undefined || product_.category_id === null) && categories.length > 0) {
                    product_.category_id=categories[0].id;
                }
                if (id)
                    await updateProduct(product_);
                else{
                    let product__: Product = await createProduct(product_);
                    navigate("/product"+`/${product__.id}`);
                }
            }
        } catch (error) {
            setError("Failed to update product");
        }
    };

    const navigate = useNavigate();
    const deleteAction = async () => {
        if (id) {
            try {
                await deleteProduct(Number(id));
                setIdToSearch("");
                setError(null);
                navigate("/product");
                window.location.reload();
                setProduct(new Product());
            } catch (error) {
                setError("Failed to delete product");
            }
        }
    };

    React.useEffect(() => {
        const fetchProduct = async () => {
            if (id) {
                try {
                    const product: Product = await getProductById(Number(id));
                    setProduct(product);
                } catch (error) {
                    setError("Failed to fetch product");
                    setLoading(false);
                    navigate("/not-found");
                    setProduct(new Product());
                }
            }
            else {
                setProduct(new Product());
            }
            setLoading(false);
            
        };
        const fetchCategories = async () => {
            try {
                const categories: Category[] = await getAllCategories();
                setCategories(categories);
            } catch (error) {
                setError("Failed to fetch categories");
            }
            setLoading2(false);

            
            
        };
        fetchProduct();
        fetchCategories();
        
    }, [id]);

    if (loading || loading2) {
        return <div className={styles.loading}><Loader /></div>;
    }
    return (
        <div className={styles.container}>
            <div className={styles.error}>{error}</div>
            <div className={styles.searchContainer}>
                <input type="text" className={styles.input} value={idToSearch} onChange={(e) => setIdToSearch(e.target.value)} placeholder="Search by id..." />
                <button className={styles.button} onClick={() => {
                    if (idToSearch) {
                        setLoading(true);
                        setError(null);
                        navigate(`/product/${idToSearch}`);
                    }}}>
                    <span className={"material-symbols-outlined " + styles.deleteIcon}>search</span>
                    <span>Search</span>
                </button>
            </div>
            <form className={styles.form} onSubmit={submitForm}>
                <div className={styles.formContent}>
                <div className={styles.formElement}>
                    <label className={styles.label}>
                        Product Name:
                    </label>
                    <input type="text" name="productName" value={product?.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} className={styles.input} />
                </div>
                <div className={styles.formElement}>
                    <label className={styles.label}>
                        Price:
                    </label>
                    <input type="number" name="price" value={product?.price} onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })} className={styles.input} />
                </div>
                <div className={styles.formElement}>
                    <label className={styles.label}>
                        Description:
                    </label>
                    <textarea name="description" value={product?.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} className={styles.textarea}></textarea>
                </div>
                <div className={styles.formElement}>
                    <label className={styles.label}>
                        Category:
                    </label>
                    <select name="category" value={product?.category_id} onChange={(e) => setProduct({ ...product, category_id: Number(e.target.value) })} className={styles.select}>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className={styles.formElement}>
                    <label className={styles.label}>
                        Image URL:
                    </label>
                    <input type="text" name="image" value={product?.image} onChange={(e) => setProduct({ ...product, image: e.target.value })} className={styles.input} />
                </div>
                <div className={styles.formElement}>
                    <label className={styles.label}>
                        Times Visited:
                    </label>
                    <input type="number" name="timesVisited" value={product?.times_visited} onChange={(e) => setProduct({ ...product, times_visited: Number(e.target.value) })} className={styles.input} />
                </div>
                </div>
                <div className={styles.buttons}>
                    <button type="submit" className={styles.button + " " + styles.save}>
                        <span className={"material-symbols-outlined " + styles.saveIcon}>save</span>
                        <span>Save</span>
                    </button>
                    { id && <>
                    <button type="button" className={styles.button + " " + styles.delete} onClick={deleteAction}>
                        <span className={"material-symbols-outlined " + styles.deleteIcon}>delete</span>
                        <span>Delete</span>
                    </button>
                    <button type="button" className={styles.button + " " + styles.create} onClick={() => {navigate("/"); setLoading(true); setError(null);}}>	
                        <span className={"material-symbols-outlined " + styles.createIcon}>create</span>
                        <span>Create new</span>
                    </button>
                    </>}
                </div>

            </form>
        </div>
    );
};


export default ProductForm;