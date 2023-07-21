import { useState } from "react";
import { GetDataBaseContext } from "../../App";
import DownloadBtn from "../../components/DownloadBtn";
import Header from "../../components/Header";
import indexedDBController, { STORES } from "../../indexedDB/indexedDB";
import {FaHistory} from 'react-icons/fa';
import { downloadOrderFormat } from "../../utils";
function History(props) {
    const [orders, setOrders] = useState([]);
    const [date, setDate] = useState('');
    const [total, setTotal] = useState(0);
    const {db} = GetDataBaseContext();

    const handleOnDateChange = async (e) => {
        // The conversion below will lose 1 day, thus adding a whole day to it => 8.64e+7 ms = 1 day
        const date = new Date(e.target.valueAsNumber + 8.64e+7).toLocaleDateString('en-us');
        try {
            const data = await indexedDBController.getListOfRecords(db, STORES.ORDERSV2.name, 'deliverDate', date);
            setOrders(data);
            setDate(date);
            if (typeof data === 'undefined')
                setTotal(0);
            else
                setTotal(data.reduce((acc, curr) => acc + curr.total, 0));
        } catch(error) {
            alert('Error: ' + error);
        }
    }
    return ( 
        <>
         <div className="row">
            <div className="col">
                <Header icon={<FaHistory/>} title="History"/>
            </div>
            <div className="col">
                <div className="d-flex justify-content-center">
                    <DownloadBtn data={orders} contentFormat={downloadOrderFormat} fileName='Order_Date' disabled={typeof orders === 'undefined'? true:false}/>
                </div>
            </div>
            
        </div>
    
        <div className="container-lg ">
            <div className="d-flex justify-content-center my-2">
                        <h2 className="h2">Completed Orders </h2>
            </div>
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                        <label className="mx-2">Select Date: </label>
                        <input onChange={handleOnDateChange} type="date" style={{outline: 'none', border: '#c7c7c7 solid 1px', backgroundColor: 'transparent', borderRadius: '5px 5px 5px 5px ', width: '10em', height: '2em'}} />
                </div>
                <div>Total: ${total}</div>
            </div>
            <div className="d-flex justify-content-center align-items-center">
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">Customer</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Cart</th>
                        <th scope="col">Total</th>
                        <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>

                    {
                        orders.map((order, idx) => {
                            return (
                                <tr key={idx}>
                                    <td>{order.customer.customerName}</td>
                                    <td>{order.customer.phone}</td>
                                    <td>
                                        {order.cart.map((item, idx) => {
                                            return (
                                                <div key={idx}>
                                                    {item.name} x {item.quantity}
                                                </div>
                                            )})
                                        }
                                    </td>
                                    <td>${order.total}</td>
                                    <td>{order.status? 'Completed':'Pending'}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
        </div>
        </>
       
     );
}

export default History;