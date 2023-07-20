import CustomerOrderCard from "./CustomerOrderCard";

function CustomerOrderList(props) {
    const cart = props.cart;
    return ( 
        <ul className="list-group">
            {cart.map((item, idx) => 
                <CustomerOrderCard key={item.id} id={idx} item={item} 
                    removeOrder={props.removeOrder}
                    updateQuantity={props.updateQuantity}
                /> 
                )}
        </ul>
     );
}

export default CustomerOrderList;