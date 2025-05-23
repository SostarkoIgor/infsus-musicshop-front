import React from "react";
import styles from "../styles/styles.module.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Order } from "../types/order";
import type { User } from "../types/user";
import { getAllUsers } from "../services/userService";
import { getOrderById, deleteOrder } from "../services/orderService";
import Loader from "../components/loader";

function orderForm(){
  const { id } = useParams();
  const navigate = useNavigate();

  const [idToSearch, setIdToSearch] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loading2, setLoading2] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const [users, setUsers] = React.useState<User[]>([]);

  const [order, setOrder] = React.useState<Order>(new Order());
  
  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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

  React.useEffect(() => {
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
                }
            }
            setLoading(false);
        };
        fetchUsers();
        fetchOrder();

    }, [id]);

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
                    <input type="text" name="orderName" value={order?.total_price} onChange={(e) => setOrder({ ...order, total_price: Number(e.target.value) })} className={styles.input} />
                </div>
                <div className={styles.formElement}>
                    <label className={styles.label}>
                        Credit card number:
                    </label>
                    <input type="number" name="price" value={order?.credit_card_number} onChange={(e) => setOrder({ ...order, credit_card_number: e.target.value })} className={styles.input} />
                </div>
                <div className={styles.formElement}>
                    <label className={styles.label}>
                        Order date:
                    </label>
                    <input type="date" name="description" value={order?.order_date} onChange={(e) => setOrder({ ...order, order_date: e.target.value })} className={styles.textarea}></input>
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
                    <button type="button" className={styles.button + " " + styles.delete} onClick={deleteAction}>
                        <span className={"material-symbols-outlined " + styles.deleteIcon}>delete</span>
                        <span>Delete</span>
                    </button>
                    <button type="button" className={styles.button + " " + styles.create} onClick={() => {navigate("/order"); setLoading(true); setError(null);}}>	
                        <span className={"material-symbols-outlined " + styles.createIcon}>create</span>
                        <span>Create new</span>
                    </button>
                </div>

            </form>
        </div>
    );
};

export default orderForm;