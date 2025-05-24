import React from "react";
import styles from "../styles/styles.module.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Order } from "../types/order";
import type { User } from "../types/user";
import { getAllUsers } from "../services/userService";
import { getOrderById, deleteOrder } from "../services/orderService";
import Loader from "../components/loader";
import { createOrder, updateOrder } from "../services/orderService";
import { getAllProducts } from "../services/productService";
import { Product } from "../types/product";
import { deleteOrderItem, createOrUpdateOrderItem } from "../services/orderItemService";

function orderForm(){
  const { id } = useParams();
  const navigate = useNavigate();

  const [idToSearch, setIdToSearch] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loading2, setLoading2] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const [selectedItem, setSelectedItem] = React.useState<number | null>(null);

  const [products, setProducts] = React.useState<Product[]>([]);

  const [users, setUsers] = React.useState<User[]>([]);

  const [order, setOrder] = React.useState<Order>(new Order());

  const [productId, setProductId] = React.useState<number>(0);
  const [quantity, setQuantity] = React.useState<number>(0);

  const [previousProductId, setPreviousOrderId] = React.useState<number | null>(null);
  const [previousQuantity, setPreviousQuantity] = React.useState<number | null>(null);
  
  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        console.log("Submitting form", order);
        try {
            if (order) {
                let order_: Order = { ...order };
                if ((order_.user_id === undefined || order_.user_id === null) && users.length > 0) {
                    order_.user_id = users[0].id;
                }
                if (id) {
                    await updateOrder(order_);
                } else {
                    let order__: Order = await createOrder(order_);
                    navigate("/order" + `/${order__.id}`);
                }
            }
        } catch (error) {
            setError("Failed to update order");
        }
  };

  const deleteAction = async () => {
        if (id) {
            try {
                await deleteOrder(Number(id));
                navigate("/order");
            } catch (error) {
                setError("Failed to delete order");
            }
        }
  };

    const handleDelete = async (id:number) => {
        setError(null);
        await deleteOrderItem({ orderId: order.id, productId: id, quantity: 0 })
        const updatedOrder = await getOrderById(order.id);
        setOrder(updatedOrder);
    };
        

  React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getAllProducts();
                if (products.length === 0) {
                    setError("No products found. Please create a product first.");
                }
                setProducts(products);
                setProductId(products[0].id!);
                setQuantity(1);
            } catch (error) {
                setError("Failed to fetch products");
            }
            }
        const fetchUsers = async () => {
            try {
                const users: User[] = await getAllUsers();
                setUsers(users);
            } catch (error) {
                setError("Failed to fetch users");
            }
            setLoading2(false);
        };
        const fetchOrder = async () => {
            if (id) {
                try {
                    const order: Order = await getOrderById(Number(id));
                    setOrder(order);
                } catch (error) {
                    setError("Failed to fetch order");
                    setOrder(new Order());
                    navigate("/not-found");
                }
            }
            setLoading(false);
        };
        fetchUsers();
        fetchOrder();
        fetchProducts();

    }, [id]);

    const submitItemCreateForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        if (productId && quantity) {
            try {
                const orderItem = {
                    orderId: order.id,
                    productId: productId,
                    quantity: quantity
                };
                if (previousProductId !== productId)
                    try{
                    await deleteOrderItem({ orderId: order.id, productId: previousProductId || 0, quantity: previousQuantity || 0 });
                    } catch (error) {}
                await createOrUpdateOrderItem(orderItem);
                setQuantity(1);
                setSelectedItem(null);

                const updatedOrder = await getOrderById(order.id);
                setOrder(updatedOrder);
            } catch (error) {
                setError("Failed to create or update order item");
        }
        } else {
            setError("Please fill in all fields");
        }
    }

  if (loading || loading2) {
        return <div className={styles.loading}><Loader /> </div>;
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
                        navigate(`/order/${idToSearch}`);
                    }}}>
                    <span className={"material-symbols-outlined " + styles.deleteIcon}>search</span>
                    <span>Search</span>
                </button>
            </div>
            <form className={styles.form} onSubmit={submitForm}>
              <div className={styles.formContent}>
                <div className={styles.formElement}>
                    <label className={styles.label}>
                        Total price:
                    </label>
                    <input type="number" name="orderName" value={order?.total_price} onChange={(e) => setOrder({ ...order, total_price: Number(e.target.value) })} className={styles.input} />
                </div>
                <div className={styles.formElement}>
                    <label className={styles.label}>
                        Credit card number:
                    </label>
                    <input type="text" name="price" value={order?.credit_card_number} onChange={(e) => setOrder({ ...order, credit_card_number: e.target.value })} className={styles.input} />
                </div>
                <div className={styles.formElement}>
                    <label className={styles.label}>
                        Order date:
                    </label>
                    <input type="date" name="description" value={ order?.order_date?new Date(order?.order_date).toISOString().split("T")[0]:new Date().toISOString().split("T")[0]} onChange={(e) => setOrder({ ...order, order_date: new Date(e.target.value).toISOString().replace("Z", "+00:00") })} className={styles.textarea}></input>
                </div>
                <div className={styles.formElement}>
                    <label className={styles.label}>
                        User:
                    </label>
                    <select name="user" value={order?.user_id} onChange={(e) => setOrder({ ...order, user_id: Number(e.target.value) })} className={styles.select}>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.username}
                                </option>
                            ))}
                    </select>
                </div>
                <div className={styles.formElement}>
                    <label className={styles.label}>
                        Delivery address:
                    </label>
                    <input type="text" name="image" value={order?.delivery_address} onChange={(e) => setOrder({ ...order, delivery_address: e.target.value })} className={styles.input} />
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
                    <button type="button" className={styles.button + " " + styles.create} onClick={() => {navigate("/order"); setLoading(true); setError(null);}}>	
                        <span className={"material-symbols-outlined " + styles.createIcon}>create</span>
                        <span>Create new</span>
                    </button></>
                }
                </div>

            </form>

            {id &&
            <div className={styles.items}>
                <h1 className={styles.title}>Order Items</h1>
                <div className={styles.createItemContainer}>
                    <h2 className={styles.createItemTitle}>{selectedItem ? "Update item" : "Add new item"}</h2>
                    <form className={styles.createItemForm} onSubmit={submitItemCreateForm}>
                        <div className={styles.createItemContent}>
                            <div className={styles.createItemElement}>
                                <label className={styles.label}>
                                    Product:
                                </label>
                                <select name="product" value={productId} onChange={(e) => {
                                    setProductId(Number(e.target.value));
                                }} className={styles.select}>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.createItemElement}>
                                <label className={styles.label}>
                                    Quantity:
                                </label>
                                <input type="number" name="quantity" value={quantity} onChange={(e) => {
                                    setQuantity(Number(e.target.value));
                                }} className={styles.input}></input>
                            </div>
                        </div>
                        <div className={styles.createItemButtons}>
                            <button type="submit" className={styles.button + " " + styles.save}>
                                <span className={"material-symbols-outlined " + styles.createItemSaveIcon}>
                                    {selectedItem ? "save" : "add_circle"}
                                </span>
                                <span>{selectedItem ? "Save" : "Add new"}</span>
                            </button>
                        </div>
                    </form>
                    
                </div>
                <h2 className={styles.itemsTitle}>Order Items List</h2>
                {order?.order_items && order.order_items.length > 0 ? (
                    order.order_items.map((item) => (
                        <div key={item.id} className={styles.itemContainer}>
                            <div className={styles.itemContent}>
                                <div className={styles.itemElement}>
                                    <span className={styles.itemLabel}>Product:</span>
                                    <span className={styles.itemValue}>{products.find((p) => p.id === item.product_id)?.name || item.product_id}</span>
                                </div>
                                <div className={styles.itemElement}>
                                    <span className={styles.itemLabel}>Quantity:</span>
                                    <span className={styles.itemValue}>{item.quantity}</span>
                                </div>
                                <div className={styles.itemElement}>
                                    <span className={styles.itemLabel}>Price:</span>
                                    <span className={styles.itemValue}>{item.price*item.quantity}</span>
                                </div>
                            </div>
                            <div className={styles.buttons}>
                                <button className={styles.button + " " + styles.edit} onClick={() => {
                                    selectedItem === item.product_id ? setSelectedItem(null) : setSelectedItem(item.product_id);
                                    setPreviousOrderId(item.product_id);
                                    setPreviousQuantity(item.quantity);
                                    setProductId(item.product_id);
                                    setQuantity(item.quantity);
                                }}>
                                    <span className={"material-symbols-outlined " + styles.editIcon}>{selectedItem === item.product_id ? "close" : "edit" }</span>
                                    <span>{selectedItem === item.product_id ? "Cancel" : "Edit"}</span>
                                </button>
                                <button className={styles.button + " " + styles.delete} onClick={() => {handleDelete(item.product_id || 0);}}>
                                    <span className={"material-symbols-outlined " + styles.deleteIcon}>delete</span>
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.noItems}>No items found</div>
                )}
            </div>
    }
        </div>
    );
};

export default orderForm;