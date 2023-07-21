import CompleteOrderCard from "./CompleteOrderCard";
function CompleteOrderList({orders}) {
    return ( 
        <ul 
            data-test-id="completed-order-list"
            className="list-group position-relative overflow-auto" 
            style={{height: "100dvh"}}>
            {
                orders.map((order, index) => {
                    return <CompleteOrderCard 
                    key={index} 
                    order={order}
                    />
                })
            }
        </ul>
     );
}

export default CompleteOrderList;