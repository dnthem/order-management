import Backdrop from "../../../components/Backdrop";
import { convertISOToUSA, orderFormater } from "../../../utils";
import Customer from "./Customer/Customer";
import Menu from "./Menu";
import { useState } from "react";

function AddToOrderForm(props) {
    const [cart, setCart] = useState(props.cart?? []);
    const [orderID, setOrderID] = useState(props.orderID?? -1); // -1 means new order
    const [paymentType, setPaymentType] = useState(props.paymentType?? 'Cash');
    const [notes, setNotes] = useState(props.notes?? '');
    const [orderDate, setOrderDate] = useState(props.orderDate);
    const [deliverDate, setDeliverDate] = useState(props.deliverDate);
    const customer = props.customer;
    const menu = props.menu;
    const btnText = props.orderID !== -1 ? 'Update Order' : 'Add to Order';
    /**
     * Update order
     * @param {number} id  id of the item
     * @returns {void}
     */
    const updateOrder = (id) => {
        const updatedCart = [...cart];
        const index = cart.findIndex(item => item.id === id);
        if(index === -1) {
            const item = menu.find(item => item.id === id);
            const newCart = {
                id: item.id,
                name: item.Title,
                price: item.Price,
                quantity: 1,
            };
            updatedCart.push(newCart);
        } else {
            updatedCart[index].quantity += 1;
        }
        setCart(updatedCart);
    }

    /**
     * Update quantity
     * @param {number} id  id of the item
     * @param {number} quantity  quantity of the item
     * @returns {void}
    */
    const updateQuantity = (id, quantity) => {
        const index = cart.findIndex(item => item.id === id);
        if(index !== -1) {
            const updatedCart = [...cart];
            updatedCart[index].quantity = parseInt(quantity);
            setCart(updatedCart);
        }
    }

    /**
     * Remove order
     * @param {number} id  id of the item
     * @returns {void}
     * */
    const removeOrder = (id) => {
        const index = cart.findIndex(item => item.id === id);
        if(index !== -1) {
            const updatedCart = [...cart];
            updatedCart.splice(index, 1);
            setCart(updatedCart);
        }

    }

    const handleAddToOrder = () => {
        if (cart.length === 0) return alert('Please add item to order');

        const newOrder = orderFormater({
            customer, 
            cart, 
            paymentType, 
            notes, 
            orderID,
            orderDate: convertISOToUSA(orderDate),
            deliverDate: convertISOToUSA(deliverDate),
        });

        if(orderID !== -1) {
            props.onUpdateOrder(newOrder); 
        }
        else 
            props.onAddNewOrder(newOrder);

        props.showForm(false);
    }
    
    return ( 
        <>
            <Backdrop show={props.showForm} setShow={props.setShowForm}/>
            <div
                data-test-id="add-to-order-form"
                className={`col-md-12 col-xl-10 p-3 bg-white border rounded-3 shadow-lg`}
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: "9999",
                }}
            >
                <div className="row position-relative" style={{
                    height: "80dvh",
                    
                }}>
                    <Customer customer={customer} cart={cart} 
                        removeOrder={removeOrder} 
                        updateQuantity={updateQuantity}
                        paymentType={paymentType}
                        notes={notes}
                        orderDate={orderDate}
                        deliverDate={deliverDate}
                        setPaymentType={setPaymentType}
                        setNotes={setNotes}
                        setOrderDate={setOrderDate}
                        setDeliverDate={setDeliverDate}
                    />
                    
                    <Menu  menu={menu} updateOrder={updateOrder}/>

                </div>
                <div className="row pt-3 border-top bg-">
                    <div className="col-12 d-flex justify-content-end">
                        <button
                            data-test-id="add-to-order-form-btn"
                         className="btn btn-primary" onClick={handleAddToOrder}>{btnText}</button>
                        <button
                            data-test-id="add-to-order-form-cancel-btn"
                         className="btn btn-danger ms-2" onClick={() => props.showForm(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        </>
      );
}

export default AddToOrderForm;