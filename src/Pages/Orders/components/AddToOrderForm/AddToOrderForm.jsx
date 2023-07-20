import Backdrop from "../../../../components/Backdrop";
import useLocalStorage from "../../../../customHooks/useLocalStorage";
import { convertISOToUSA, orderFormater } from "../../../../utils";
import Customer from "./Customer/Customer";
import Menu from "./Menu";
import { useReducer, useState } from "react";

function AddToOrderForm(props) {
        // the n-th order of the day

    const [order, setOrder] = useReducer((state, action) => {
        switch (action.type) {
            case 'cart':
                return {...state, cart: action.payload};
            case 'orderID':
                return {...state, orderID: action.payload};
            case 'deliverDate':
                return {...state, deliverDate: action.payload};
            case 'orderDate':
                return {...state, orderDate: action.payload};
            case 'notes':
                return {...state, notes: action.payload};
            case 'paymentType':
                return {...state, paymentType: action.payload};
            case 'promotion':
                return {...state, promotion: action.payload};
            case 'nthOrderOfDay':
                return {...state, nthOrderOfDay: action.payload};
            case 'customer':
                return {...state, customer: action.payload};
            case 'registerationDate':
                return {...state, registerationDate: action.payload};
            case 'all':
                return action.payload;
            case 'quickAdd':
                return {...state, ...payload};
            default:
                return state;
        }
    }, {...props.order});

    const [nthOrderOfDay, setNthOrderOfDay ] = useLocalStorage('nthOrderOfDay', 0);
    const [nthOrderOfDayProps,] = useState(order.nthOrderOfDay??(nthOrderOfDay +1));
    const menu = props.menu;
    const btnText = order.orderID !== -1 ? 'Update Order' : 'Add to Order';
    /**
     * Update cart
     * @param {number} id  id of the item
     * @returns {void}
     */
    const updateOrder = (id) => {
        const updatedCart = [...order.cart];
        const index = order.cart.findIndex(item => item.id === id);
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
        setOrder({
            type: 'cart',
            payload: updatedCart,
        });
    }

    /**
     * Update quantity of an item in cart
     * @param {number} id  id of the item
     * @param {number} quantity  quantity of the item
     * @returns {void}
    */
    const updateQuantity = (id, quantity) => {
        const index = order.cart.findIndex(item => item.id === id);
        if(index !== -1) {
            const updatedCart = [...order.cart];
            updatedCart[index].quantity = parseInt(quantity);
            setOrder({
                type: 'cart',
                payload: updatedCart,
            });
        }
    }

    /**
     * Remove order
     * @param {number} id  id of the item
     * @returns {void}
     * */
    const removeAnItemFromCart = (id) => {
        const index = order.cart.findIndex(item => item.id === id);
        if(index !== -1) {
            const updatedCart = [...order.cart];
            updatedCart.splice(index, 1);
            setOrder({
                type: 'cart',
                payload: updatedCart,
            });
        }

    }

    const handleAddToOrder = () => {
        if (order.cart.length === 0) return alert('Please add item to order');
        
        const newOrder = orderFormater({
            nthOrderOfDay: nthOrderOfDayProps,
            customer: order.customer,
            cart: order.cart, 
            paymentType: order.paymentType, 
            notes : order.notes, 
            orderID: order.orderID,
            orderDate: convertISOToUSA(order.orderDate),
            deliverDate: convertISOToUSA(order.deliverDate),
            promotion: order.promotion,
        });
        // promotion cannot be greater than total
        if (newOrder.total < 0) return alert('Promotion/Discount cannot be greater than total');
        if (newOrder.orderDate > newOrder.deliverDate) return alert('Order date cannot be greater than deliver date');
        if (newOrder.deliverDate < new Date().toLocaleDateString()) return alert('Deliver date cannot be in the past');
        if (newOrder.orderDate < new Date().toLocaleDateString()) return alert('Order date cannot be in the past');
        
        if(order.orderID !== -1) {
            props.onUpdateOrder(newOrder); 
        }
        else {
            setNthOrderOfDay(nthOrderOfDayProps);
            props.onAddNewOrder(newOrder);
        }
            

        props.showForm(false);
    }
    
    return ( 
        <>
            <Backdrop show={props.showForm} setShow={props.setShowForm}/>
            <div
                data-test-id="add-to-order-form"
                className={`col-md-12 col-md-12 col-xl-10 col-12 p-3 bg-white border rounded-3 shadow-lg`}
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
                    <Customer 
                        order={order}
                        updateOrder={setOrder}
                        removeOrder={removeAnItemFromCart} 
                        updateQuantity={updateQuantity}
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