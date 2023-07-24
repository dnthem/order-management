import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import CloseButton from 'react-bootstrap/CloseButton';
import { OrderCardStyle } from "../../../constants";
import { getLast4Digits } from "../../../utils";
import { useState } from "react";
function OrderCard({nthOrderOfDay, order, onDelete, onComplete, onEdit }) {
  const [showMore, setShowMore] = useState(false);
  return (
    <Card className='position-relative' style={OrderCardStyle}>
    <CloseButton className="position-absolute end-0" dataTestId="delete-order-btn" onDoubleClick={() => onDelete(order.orderID)} style={{zIndex: '1'}} />
      <Card.Body>
        <Card.Title>
          {nthOrderOfDay} - {order.customer.customerName!== ''?order.customer.customerName : getLast4Digits(order.customer.phone)}
        </Card.Title>
        <Card.Text>
          {order.customer.phone} <br />
          {`$${order.total} - ${order.paymentType}`} <br />
          {`Order Date: ${order.orderDate}`} <br />
          {`Deliver Date: ${order.deliverDate}`} <br />
          {order.notes !== "" &&
            <details className="card-subtitle mb-2 text-muted text-wrap" style={{ maxWidth: "16em" }}>
              <summary>Notes</summary>
              <p aria-label="order-notes">{`${order.notes}`}</p>
            </details>
          }
        </Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        {
          order.cart.map((item, index, arr) => {
            if (index === 3 && !showMore) {
              return (
                <ListGroup.Item onClick={() => setShowMore(true)} key={index}>
                  ...show more
                </ListGroup.Item>
              )

            }
            else if (index > 3 && !showMore) {
              return;
            }
            else if (index === arr.length - 1 && showMore) {
              return (
                <>
                  <ListGroup.Item key={index}>
                    {`${item.quantity} x ${item.name}`}
                  </ListGroup.Item>

                  <ListGroup.Item onClick={() => setShowMore(false)} key={index + 1}>
                    show less
                  </ListGroup.Item>
                </>
              )
            }
            else {
              return (
                <ListGroup.Item key={index}>
                  {`${item.quantity} x ${item.name}`}
                </ListGroup.Item>
              )
            }
          })
        }

      </ListGroup>
      <Card.Body>
        <Card.Link className="btn" onClick={() => onEdit(order)}>Edit</Card.Link>
        <Card.Link className="btn text-primary" onDoubleClick={() => onComplete(order.orderId, order)}>Complete</Card.Link>
      </Card.Body>
    </Card>
    
  );
}

export default OrderCard;
