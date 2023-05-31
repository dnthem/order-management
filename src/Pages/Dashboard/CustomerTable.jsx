function CustomerTable(props) {
    const sortedCustomers = props.sortedCustomers;
    return ( 
        <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">Registeration Date</th>
                        <th scope="col">Customer Name</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Total Orders</th>
                        <th scope="col">Total Spent</th>
                        <th scope="col">Last purchase</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sortedCustomers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.registerationDate}</td>
                                <td>{customer.customerName}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.orderCount}</td>
                                <td>{Intl.NumberFormat('en-us',{style: 'currency', currency: 'USD'}).format(customer.totalSpent)}</td>
                                <td>{customer.lastPurchase}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
     );
}

export default CustomerTable;