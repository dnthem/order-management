function CompleteOrderCard({ order }) {
  return (
    <li
      data-test-id="completed-order-card"
      className="list-group-item d-flex justify-content-between align-items-start">
      <div className="ms-2 me-auto">
        <div className="fw-bold">
          {order.nthOrderOfDay}. {order.customer.customerName}
        </div>
        Completed at: {order.completedTime}
        <br/>
        Phone: {order.customer.phone}
        <br/>
        Payment type: {order.paymentType}
        <br/>
        <details className="text-wrap">
          <summary>Notes</summary>
          <p>{order.notes}</p>
        </details>
      </div>
      <span className="badge bg-primary rounded-pill">${order.total}</span>
    </li>
  );
}

export default CompleteOrderCard;
