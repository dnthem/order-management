import React from 'react';
import CustomerOrderList from './CustomerOrderList';
import { dateFormat, dateToISO } from '../../../../utils';
function Customer(props) {
    const customer = props.customer;
    const customerName = customer.customerName;
    const phone = customer.phone;
    const cart = props.cart??[]; 
    

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
                                <input type="date" className="border-0 bg-transparent" value={dateToISO(props.orderDate)} onChange={(e) => props.setOrderDate(dateFormat(e.target.valueAsNumber + 8.64e+7))}/>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <span>Deliver Date:</span>
                                <input type="date" className="border-0 bg-transparent" value={dateToISO(props.deliverDate)} onChange={(e) => props.setDeliverDate(dateFormat(e.target.valueAsNumber + 8.64e+7))}/>
                            </div>
                            <div className="">Total: 
                                <span  
                                    data-test-id='order-total'
                                    className='fw-bold'>${total}</span>
                            </div>
                            <div className="">Payment type: 
                                <select className="border-0 bg-transparent" value={props.paymentType} onChange={(e) => props.setPaymentType(e.target.value)}>
                                    <option value="Cash">Cash</option>
                                    <option value="Zelle">Zelle</option>
                                    <option value="Venmo">Venmo</option>
                                </select>
                            </div>
                            <div className="">
                                <div>Notes:</div>
                                <textarea maxLength={200} className="w-100" style={{resize: 'none'}} value={props.notes} onChange={(e) => props.setNotes(e.target.value)}></textarea>
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
                <CustomerOrderList cart={cart} 
                    removeOrder={props.removeOrder}
                    updateQuantity={props.updateQuantity}
                />
            </div>
        </div>
     );
}

export default Customer;