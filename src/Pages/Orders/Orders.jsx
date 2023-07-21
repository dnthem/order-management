import { Header, DownloadBtn } from "../../components";
import { OrderCard, CompleteOrderList, UserInfoForm, AddToOrderForm} from "./components";
import { AiOutlineShoppingCart, AiOutlinePlusCircle } from "react-icons/ai";
import { useEffect, useReducer, useState } from "react";
import { useData } from "../../customHooks";
import { dateFormat, downloadOrderFormat, getCurrentTime } from "../../utils";
import { STORES } from "../../indexedDB/indexedDB";


function Orders() {
  const [orders, setOrders] = useData({
    store: STORES.ORDERSV2.name,
    index: "deliverDate",
    keyPath: new Date().toLocaleDateString("en-us"),
  });

  const [customers, setCustomers] = useData({
    store: STORES.CUSTOMERS.name,
    index: STORES.CUSTOMERS.keyPath,
    keyPath: null,
  });

  const [menu, setMenu] = useData({
    store: STORES.MENU.name,
    index: STORES.MENU.keyPath,
    keyPath: null,
  });

  const [income, setIncome] = useData({
    store: STORES.INCOME.name,
    index: STORES.INCOME.keyPath,
    keyPath: new Date().toLocaleDateString("en-us"),
  });

  const [incomeUpToDate, setIncomeUpToDate] = useData({
    store: STORES.INCOMEUPTODATE.name,
    index: STORES.INCOMEUPTODATE.keyPath,
    keyPath: 1,
  });

  const [order, setOrder] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "cart":
          return { ...state, cart: action.payload };
        case "orderID":
          return { ...state, orderID: action.payload };
        case "deliverDate":
          return { ...state, deliverDate: action.payload };
        case "orderDate":
          return { ...state, orderDate: action.payload };
        case "notes":
          return { ...state, notes: action.payload };
        case "paymentType":
          return { ...state, paymentType: action.payload };
        case "promotion":
          return { ...state, promotion: action.payload };
        case "nthOrderOfDay":
          return { ...state, nthOrderOfDay: action.payload };
        case "customer":
          return { ...state, customer: action.payload };
        case "registerationDate":
          return { ...state, registerationDate: action.payload };
        case "all":
          return action.payload;
        default:
          return state;
      }
    },
    {
      cart: [],
      orderID: -1,
      deliverDate: dateFormat(),
      orderDate: dateFormat(),
      notes: "",
      paymentType: "Cash",
      promotion: 0,
      nthOrderOfDay: null,
      customer: null,
      registerationDate: null,
    }
  );
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  const [showAddToOrderForm, setShowAddToOrderForm] = useState(false);
  const pending = orders.filter((order) => !order.status);
  const completed = orders.filter((order) => order.status);
  const total = completed.reduce((acc, order) => acc + order.total, 0);

  // order CRUD
  const onDeleteAnOrder = (id) => {
    setOrders({
      type: "delete",
      indexField: STORES.ORDERSV2.keyPath,
      keyPath: id,
      newVal: null,
    });
  };

  /**
   * Complete order, update customer order count, total spent, and update menu
   */
  const onCompleteAnOrder = async (id, order) => {
    await setOrders({
      type: "update",
      indexField: STORES.ORDERSV2.keyPath,
      keyPath: id,
      newVal: {
        ...order,
        status: true,
        completedTime: getCurrentTime(),
      },
    });

    const currentCustomer = customers.find(
      (customer) => customer.customerID === order.customer.customerID
    );
    // update customer order count
    await setCustomers({
      type: "update",
      indexField: STORES.CUSTOMERS.keyPath,
      keyPath: order.customer.customerID,
      newVal: {
        ...currentCustomer,
        orderCount: currentCustomer.orderCount + 1,
        totalSpent: currentCustomer.totalSpent + order.total,
        lastPurchase: dateFormat(),
      },
    });

    // update menu
    for (let i = 0; i < order.cart.length; i++) {
      const currentItem = menu.find((item) => item.id === order.cart[i].id);
      const newVal = {
        ...currentItem,
        Count: currentItem.Count + order.cart[i].quantity,
      };
      await setMenu({
        type: "update",
        indexField: STORES.MENU.keyPath,
        keyPath: currentItem.id,
        newVal: newVal,
      });
    }

    // update income

    const incomeData = {
      Date: new Date().toLocaleDateString("en-us"),
      Total: (income[0]?.Total ?? 0) + order.total,
      _id: income[0]?._id ?? undefined
    };
    await setIncome({
      type: "update",
      indexField: STORES.INCOME.keyPath,
      newVal: incomeData,
    });

    // update income up to date
    const newIncomeUpToDateData = {
      id: 1,
      Date: dateFormat(),
      Total: (incomeUpToDate[0]?.Total ?? 0) + order.total,
      UpdatedTime: new Date().getTime(),
    };
    await setIncomeUpToDate({
      type: "update",
      indexField: STORES.INCOMEUPTODATE.keyPath,
      newVal: newIncomeUpToDateData,
    });
  };

  const onEditAnOrder = (order) => {
    setShowAddToOrderForm(true);
    setOrder({ type: "all", payload: order });
  };

  const onAddNewOrder = (newVal) => {
    setOrders({ type: "add", indexField: STORES.ORDERSV2.keyPath, newVal });
  };

  const onUpdateOrder = (newVal) => {
    setOrders({
      type: "update",
      indexField: STORES.ORDERSV2.keyPath,
      keyPath: newVal.orderID,
      newVal: newVal,
    });
  };

  const onAddCustomerSubmit = (customer) => {
    setShowUserInfoForm(false);
    setShowAddToOrderForm(true);
    setOrder({
      type: "all",
      payload: {
        cart: [],
        orderID: -1,
        deliverDate: dateFormat(),
        orderDate: dateFormat(),
        notes: "",
        paymentType: "Cash",
        promotion: 0,
        nthOrderOfDay: null,
        customer: {
            customerName: customer.customerName,
            phone: customer.phone,
            customerID: customer.customerID,
        },
        registerationDate: null,
      },
    });
  };

  useEffect(() => {
    let timeOut;

    function checkNthOrderOfDay() {
      // check update nthOrderOfDay
      // if the date is different, reset nthOrderOfDay to 0
      // check local storage for isnewday, if the current date is different from the date in local storage, reset nthOrderOfDay to 0
      const date = new Date().toLocaleDateString("en-us");
      const isnewday = localStorage.getItem("isnewday")
        ? localStorage.getItem("isnewday")
        : "";
      if (isnewday !== date) {
        localStorage.setItem("isnewday", date);
        localStorage.setItem("nthOrderOfDay", 0);
      }
    }

    function refreshPageAtTime(hour, minute, second) {
      const now = new Date();
      const targetTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute,
        second
      );
      let delay = targetTime - now;

      if (delay < 0) {
        targetTime.setDate(targetTime.getDate() + 1);
        delay = targetTime - now;
      }

      timeOut = setTimeout(() => {
        localStorage.setItem("nthOrderOfDay", 0);
        location.reload();
      }, delay);
    }

    checkNthOrderOfDay();
    refreshPageAtTime(0, 0, 0);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <>
      {showUserInfoForm && (
        <UserInfoForm
          showForm={setShowUserInfoForm}
          onAddCustomerSubmit={onAddCustomerSubmit}
          customers={customers}
          setCustomers={setCustomers}
        />
      )}

      {showAddToOrderForm && (
        <AddToOrderForm
          menu={menu}
          showForm={setShowAddToOrderForm}
          order={order}
          setOrder={setOrder}
          onAddNewOrder={onAddNewOrder}
          onUpdateOrder={onUpdateOrder}
        />
      )}

      <div className="row data-bs-backdrop border-bottom ">
        <div className="col-md-8 col-sm-12 ">
          <Header
            icon={<AiOutlineShoppingCart />}
            title={"Orders - " + new Date().toLocaleDateString("en-us")}
          />
        </div>

        <div className="col-md-4 col-sm-12">
          <div className="d-flex justify-content-evenly">
            <button
              data-test-id="add-new-order-btn"
              className="mt-4 btn fw-bold text-primary"
              title="Add new order"
              onClick={() => setShowUserInfoForm(true)}
            >
              New order <AiOutlinePlusCircle />
            </button>
            <DownloadBtn
              data={orders}
              fileName="Order_Date_"
              contentFormat={downloadOrderFormat}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 col-sm-12 d-flex flex-column align-items-center border-end">
          <div className="section-title ">
            <h2>Completed Orders</h2>
            <aside data-test-id="total-completed-orders" className="text-muted">
              Total: ${total}
            </aside>
          </div>
          <div className="section-content w-100 position-relative">
            <CompleteOrderList orders={completed} />
          </div>
        </div>

        <div className="col-md-9 px-2 col-sm-12" style={{ height: "100%" }}>
          <div className="section-title width-100 text-center">
            <h2>Pending Orders</h2>
          </div>
          <div
            className="section-content row d-flex justify-content-start px-1 overflow-auto"
            style={{ height: "100dvh" }}
          >
            {pending
              .map((order, index) => {
                return (
                  <OrderCard
                    key={index}
                    nthOrderOfDay={order.nthOrderOfDay}
                    order={order}
                    onDelete={onDeleteAnOrder}
                    onComplete={onCompleteAnOrder}
                    onEdit={onEditAnOrder}
                  />
                );
              })
              .reverse()}
          </div>
        </div>
      </div>
    </>
  );
}

export default Orders;
