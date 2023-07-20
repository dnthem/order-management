import React from 'react';
import CustomerOrderList from './CustomerOrderList';
import { dateFormat, dateToISO } from '../../../../../utils';
function Customer(props) {
    const customer = props.order.customer;
    const customerName = customer.customerName;
    const phone = customer.phone;
    const cart = props.order.cart??[]; 

    const numberOfItem = cart.reduce((total, item) => total + item.quantity, 0);
    const total = cart.reduce((total, item) => total + item.quantity * item.price, 0);

    return ( 
        <div className="col-4 border-end position-relative overflow-auto h-100">
            <div className="section-title position-sticky top-0 bg-white" style={{zIndex: '9999'}}>
                <h2 className="w-100 text-center">Order Infomation</h2>
                <div>
                
                    <div className="user-info d-flex justify-content-between flex-wrap">
                        <div className="">
                            <label htmlFor="customerName">Customer Name: </label>
                            <input type="text" className="border-0 bg-transparent fw-bold" id="customerName" disabled={true} value={customerName} />
                        
                        </div>
                        <div className="">
                            <label htmlFor="phone" className="">Phone:</label>
                            <input type="text" className="border-0 bg-transparent fw-bold" id="phone" value={phone} disabled={true} />
                        </div>
                    </div>
                    <div className="summary ">
                        <div className='d-flex justify-content-between'>
                                <span>Order Date: </span>
                                <input type="date" className="border-0 bg-transparent" value={dateToISO(props.order.orderDate)} onChange={(e) => props.updateOrder({
                                    type: 'orderDate',
                                    payload: dateFormat(e.target.valueAsNumber + 8.64e+7)
                                }
                                )}/>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <span>Deliver Date:</span>
                                <input type="date" className="border-0 bg-transparent" value={dateToISO(props.order.deliverDate)} onChange={(e) => props.updateOrder({
                                    type: 'deliverDate',
                                    payload: dateFormat(e.target.valueAsNumber + 8.64e+7)
                                })}/>
                                    
                            </div>
                            <div className="">
                                <label htmlFor="promotion">Promotion/Discount: $</label>
                                <input type="number" className="border-0 bg-transparent ms-1 fw-bold" data-test-id="promotion-input" max={100} min={0} 
                                        value={props.order.promotion} 
                                        onChange={(e) => props.updateOrder({
                                            type: 'promotion',
                                            payload: e.target.value
                                        })}
                                        style={{width: '7ch'}}
                                />
                            </div>
                            <div className="">Total: 
                                <span  
                                    data-test-id='order-total'
                                    className='fw-bold ms-1'>${total}</span>
                            </div>
                            <div className="">Payment type: 
                                <select className="border-0 bg-transparent fw-bold" value={props.paymentType} onChange={(e) => props.updateOrder({
                                        type: 'paymentType',
                                        payload: e.target.value
                                })}>
                                    
                                    
                                    <option value="Cash">Cash</option>
                                    <option value="Zelle">Zelle</option>
                                    <option value="Venmo">Venmo</option>
                                </select>
                            </div>
                            <div className="">
                                <div>Notes:</div>
                                <textarea data-test-id="notes" maxLength={200} className="w-100" style={{resize: 'none'}} value={props.order.notes} onChange={(e) => props.updateOrder({
                                    type: 'notes',
                                    payload: e.target.value
                                })}></textarea>
                            </div>
                    </div>
                
                    
                </div>
                <div className="d-flex justify-content-between">
                    <h2>Cart</h2>
                    <div className="d-flex align-items-center">
                        <div className="me-2">Number of items: </div>
                        <div className="badge bg-primary">{numberOfItem}</div>
                    </div>
                </div>
            </div>

            
            <div className="cart mb-3 py-2 ">
                <CustomerOrderList cart={props.order.cart} 
                    removeOrder={props.removeOrder}
                    updateQuantity={props.updateQuantity}
                />
            </div>
        </div>
     );
}

export default Customer;