
import CustomerTableRow from './CustomerTableRow';
function CustomerTable({sortedCustomers, deleteCustomer, updateCustomer}) {
    const customers = sortedCustomers;

    return ( 
        <table className="table table-striped table-hover">
                <thead>
                    <tr className="text-capitalize">
                        <th scope="col">Regist. Date</th>
                        <th scope="col">Name</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Total Orders</th>
                        <th scope="col">Total Spent</th>
                        <th scope="col">Last purchase</th>
                    </tr>
                </thead>
                <tbody data-test-id="customer-table-body">
                    {
                        customers.length !== 0 ? customers.map(customer => (
                            <CustomerTableRow
                                key={customer.customerID}
                                customer={customer}
                                deleteCustomer={deleteCustomer}
                                updateCustomer={updateCustomer}
                            /> 
                        )) : (
                            <tr>
                                <td colSpan="6" className="text-center">No customer found</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
     );
}

export default CustomerTable;