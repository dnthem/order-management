import {FaRegTrashAlt} from 'react-icons/fa';

function CustomerOrderCard(props) {
    const item = props.item;
  return (
    <li 
      data-test-id="customer-cart-card"
      className="list-group-item">
      <div className="d-flex justify-content-between align-items-center">
        <span style={{ width: "15ch", whiteSpace: "nowrap", overflow: "auto" }}>
          {props.id + 1}. {item.name}
        </span>
        <span>${item.price}</span>
        <div className="btn-group d-flex align-items-center">
          <select value={item.quantity} onChange={(e) => props.updateQuantity(item.id, e.target.value)}>
            {
              [...Array(20)].map((_, idx) => <option key={idx} value={idx + 1}>{idx + 1}</option>)
            }
          </select>
        </div>
        <button 
          data-test-id="remove-item-from-cart-btn"
          type="button" onClick={() => props.removeOrder(item.id)} className="btn btn-sm">
          <FaRegTrashAlt />
        </button>
      </div>
    </li>
  );
}

export default CustomerOrderCard;
