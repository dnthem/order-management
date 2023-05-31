import Header from "../../components/Header";
import {AiOutlineShoppingCart, AiOutlinePlusCircle} from "react-icons/ai";
import DownloadBtn from "../../components/Downloadbtn";
import OrderCardV2 from "./PendingOrders/OrdersCardV2";
import CompleteOrderList from "./CompletedOrders/CompleteOrderList";
import UserInfoForm from "./UserInfoForm";
import AddToOrderForm from "./AddToOrderForm/AddToOrderForm";
import { useEffect, useState } from "react";
import { useData } from "../../customHooks/useData";
import { dateFormat, downloadOrderFormat, getCurrentTime } from "../../utils";
import { STORES } from "../../indexedDB/indexedDB";
import Loader from "../../components/Loaders/Loader";
import useLocalStorage  from "../../customHooks/useLocalStorage";

function OrdersV2() {
    const [orders, setOrders] = useData({
        store: STORES.ORDERSV2.name,
        index: 'deliverDate',
        keyPath: new Date().toLocaleDateString("en-us")
    });


    const [customers, setCustomers] = useData({
        store: STORES.CUSTOMERS.name,
        index: STORES.CUSTOMERS.keyPath,
        keyPath: null,
    })

    const [menu, setMenu] = useData({
        store: STORES.MENU.name,
        index: STORES.MENU.keyPath,
        keyPath: null,
    })

    const [income, setIncome] = useData({
        store: STORES.INCOME.name,
        index: STORES.INCOME.keyPath,
        keyPath: new Date().toLocaleDateString("en-us"),
    })

    const [itemCount, setItemCount] = useData({
        store: STORES.ITEMCOUNT.name,
        index: STORES.ITEMCOUNT.keyPath,
        keyPath: new Date().toLocaleDateString("en-us"),
    })

    const [incomeUpToDate, setIncomeUpToDate] = useData({
        store: STORES.INCOMEUPTODATE.name,
        index: STORES.INCOMEUPTODATE.keyPath,
        keyPath: 1,
    });

    // the n-th order of the day
    const [nthOrderOfDay, setNthOrderOfDay] = useLocalStorage('nthOrderOfDay', 0);

    const [customer, setCustomer] = useState(null);
    const [cart, setCart] = useState(null);
    const [orderID, setOrderID] = useState(-1);
    const [deliverDate, setDeliverDate] = useState(dateFormat());
    const [orderDate, setOrderDate] = useState(dateFormat());
    const [notes, setNotes] = useState('');
    const [paymentType, setPaymentType] = useState('Cash');


    const [showUserInfoForm, setShowUserInfoForm] = useState(false);
    const [showAddToOrderForm, setShowAddToOrderForm] = useState(false);
    const pending = orders.filter(order => !order.status);
    const completed = orders.filter(order => order.status);
    const total = completed.reduce((acc, order) => acc + order.total, 0);

    // order CRUD
    const onDelete = (id) => {
        setOrders({type: 'delete', indexField: STORES.ORDERSV2.keyPath, keyPath: id, newVal: null});
    }

    /**
     * Complete order, update customer order count, total spent, and update menu
     */
    const onComplete = async (id, order) => {

        await setOrders(
            {
                type: 'update', 
                indexField: STORES.ORDERSV2.keyPath, 
                keyPath: id, 
                newVal: {
                    ...order, 
                    status: true, 
                    completedTime: getCurrentTime()
                }
            });

        const currentCustomer = customers.find(customer => customer.customerID === order.customer.customerID);
        // update customer order count
        await setCustomers(
            {
                type: 'update', 
                indexField: STORES.CUSTOMERS.keyPath, 
                keyPath: order.customerID, 
                newVal: {
                    ...currentCustomer,
                    orderCount: currentCustomer.orderCount + 1, 
                    totalSpent: currentCustomer.totalSpent + order.total,
                    lastPurchase: dateFormat()
                }
            });
        
        // update menu
        for (let i = 0; i < order.cart.length; i++) {
            const currentItem = menu.find(item => item.id === order.cart[i].id);
            const newVal = {
                ...currentItem,
                Count: currentItem.Count + order.cart[i].quantity,
            };
            await setMenu({type: 'update', indexField: STORES.MENU.keyPath, keyPath: currentItem.id, newVal: newVal});
        }

        // update income
        const incomeData = {
            Date: new Date().toLocaleDateString("en-us"),
            Total: (income[0]?.Total??0) + order.total,
        }
        await setIncome({type: 'update', indexField: STORES.INCOME.keyPath, newVal: incomeData});

        // update item count
        const itemCountData = {
            Date: new Date().toLocaleDateString("en-us"),
            Count: (itemCount[0]?.Count??0) + order.cart.reduce((acc, item) => acc + item.quantity, 0),
        }
        await setItemCount({type: 'update', indexField: STORES.ITEMCOUNT.keyPath, newVal: itemCountData});

        // update income up to date
        const newIncomeUpToDateData = {
            id: 1,
            Date: dateFormat(),
            Total: (incomeUpToDate[0]?.Total??0) + order.total,
            UpdateTime: new Date().getTime(),
        }
        await setIncomeUpToDate({type: 'update', indexField: STORES.INCOMEUPTODATE.keyPath, newVal: newIncomeUpToDateData});
    }

    const onEdit = (order) => {
        setShowAddToOrderForm(true);
        setCart(order.cart);
        setCustomer(order.customer);
        setOrderID(order.orderID);
        setDeliverDate(order.deliverDate);
        setOrderDate(order.orderDate);
        setNotes(order.notes);
        setPaymentType(order.paymentType);
    }

    const onAddNewOrder = (newVal) => {
        setOrders({type: 'add', indexField: STORES.ORDERSV2.keyPath, newVal: {...newVal, nthOrderOfDay: nthOrderOfDay + 1}});
        setNthOrderOfDay(nthOrderOfDay + 1);
    }

    const onUpdateOrder = (newVal) => { 
        setOrders({type: 'update', indexField: STORES.ORDERSV2.keyPath, keyPath: orderID, newVal: newVal});
    }

    const onAddCustomerSubmit = (customer) => {
        setShowUserInfoForm(false);
        setShowAddToOrderForm(true);
        setOrderID(-1);
        setCart(null);
        setCustomer(customer);
    }

    useEffect(() => {
        let timeOut;


        function refreshPageAtTime(hour, minute, second) {
            const now = new Date();
            const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, second);
            let delay = targetTime - now;
          
            if (delay < 0) {
              targetTime.setDate(targetTime.getDate() + 1);
              delay = targetTime - now;
            }
          
            timeOut = setTimeout(() => {
              localStorage.setItem('nthOrderOfDay', 0);
              location.reload();
            }, delay);
        }
          
        
        refreshPageAtTime(0, 0, 0);

        return () => {
            clearTimeout(timeOut);
        }
    },[]);

    return ( 
        <>
            {
                showUserInfoForm && 
                <UserInfoForm 
                showForm={setShowUserInfoForm} 
                onAddCustomerSubmit={onAddCustomerSubmit}
                customers={customers}
                setCustomers={setCustomers}
                />
            }

            {
                showAddToOrderForm && 
                <AddToOrderForm 
                    menu={menu}
                    showForm={setShowAddToOrderForm} 
                    customer={customer} 
                    cart={cart}
                    orderID={orderID}
                    deliverDate={deliverDate}
                    orderDate={orderDate}
                    notes={notes}
                    paymentType={paymentType}
                    setDeliverDate={setDeliverDate}
                    setOrderDate={setOrderDate}
                    updateCustomer={setCustomer}
                    onAddNewOrder={onAddNewOrder}
                    onUpdateOrder={onUpdateOrder}
                />
            }

            <div className="row data-bs-backdrop border-bottom ">
                <div className="col-md-8 col-sm-12 ">
                        <Header icon={<AiOutlineShoppingCart/>} 
                        title={"Orders - " + new Date().toLocaleDateString("en-us")}/>
                </div>

                <div className="col-md-4 col-sm-12">
                    <div className="d-flex justify-content-evenly">
                        <button 
                            data-test-id='add-new-order-btn' 
                            className="mt-4 btn fw-bold text-primary" 
                            title="Add new order" 
                            onClick={() => setShowUserInfoForm(true)}
                        >New order <AiOutlinePlusCircle/>
                        </button>
                        <DownloadBtn data={orders} fileName='Order_Date_' contentFormat={downloadOrderFormat}/>
                    </div>
                    
                </div>
            </div>

            <div className="row">
                <div className="col-md-3 col-sm-12 d-flex flex-column align-items-center border-end">
                    <div className="section-title ">
                        <h2>Completed Orders
                        
                        </h2>
                        <aside 
                        data-test-id='total-completed-orders'
                        className="text-muted">Total: ${total}</aside>
                    </div>
                    <div className="section-content w-100 position-relative">
                        <CompleteOrderList orders={completed}/>
                    </div>
                    
                </div>

                <div className="col-md-9 px-2 col-sm-12" style={{height: "100%"}}>
                    <div className="section-title width-100 text-center">
                        <h2>Pending Orders</h2>
                    </div>
                    <div className="section-content row d-flex justify-content-start px-1 overflow-auto" style={{height: "78dvh"}}>
                        {
                            pending.map((order, index) => {
                                return <OrderCardV2 
                                key={index} 
                                nthOrderOfDay={order.nthOrderOfDay}
                                order={order}
                                onDelete={onDelete}
                                onComplete={onComplete}
                                onEdit={onEdit}
                                />
                            }).reverse()
                        }
                    </div>
                 
                </div>
            </div>
        </>
     );
}

export default OrdersV2;