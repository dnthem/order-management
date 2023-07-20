import ListItem from "./ListItems";
import { CloseBtn } from "../../../../components";
import { getLast4Digits } from "../../../../utils";

/**
 * @param {object} order - order object
 * @param {function} onRemove
 * @param {function} onComplete
 * @param {function} onEdit
 * @returns
 * @description
 * This component is used to display an order card
  */
function OrderCard({nthOrderOfDay, order, onDelete, onComplete, onEdit }) {
  return (
    <div
      data-test-id="order-card"
      className="col-xl-2 col-lg-3 mx-1 my-2 overflow-hidden position-relative"
      style={{ backgroundColor: "lightblue", borderRadius: "20px", width: "fit-content", height: "fit-content", minWidth: "2", minHeight: "20em", maxWidth: "18em"} }
    >
      <div className="card-body" style={{ position: "relative", paddingBottom: '2.5em'}}>
        <CloseBtn dataTestId="delete-order-btn" onDoubleClick={() => onDelete(order.orderID)} />
        <div className="header">

          <h5 className="card-title" aria-label="card-title">{nthOrderOfDay} - {order.customer.customerName!== ''?order.customer.customerName : getLast4Digits(order.customer.phone)}</h5>

          <div className="card-subtitle mb-2 text-muted" aria-label="customer-phone-number">{order.customer.phone}</div>

          <div className="card-subtitle mb-2 text-muted" aria-label="total-payment-type">{`$${order.total} - ${order.paymentType}`}</div>
          
          <div className="card-subtitle mb-2 text-muted" aria-label="order-date">Order Date: {`${order.orderDate}`}</div>
          <div className="card-subtitle mb-2 text-muted" aria-label="deliver-date">Deliver Date: {`${order.deliverDate}`}</div>
          {order.notes !== "" && 
            <details className="card-subtitle mb-2 text-muted text-wrap" style={{maxWidth: "16em"}}>
              <summary>Notes</summary>
              <p aria-label="order-notes">{`${order.notes}`}</p>
            </details>
          }
        </div>
        <ListItem list={order.cart} /> 
      </div>
      <div className="position-absolute end-0 bottom-0">
      <div className="d-flex justify-content-end">

        <button data-test-id="edit-order-btn"  onClick={() => onEdit(order)} className="btn text-muted" title="Edit order">Edit</button>
        <button data-test-id="complete-order-btn" onDoubleClick={() => onComplete(order.orderID, order)} className="btn text-primary">Complete</button>
        </div>
        </div>
    </div>
  );
}

export default OrderCard;
