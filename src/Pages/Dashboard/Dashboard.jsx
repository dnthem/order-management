import { useEffect, useState } from "react";
import CardInfoDB from "../../components/CardInfoDB";
import Header from "../../components/Header";
import AreaChart from "./AreaChart"
import BarChart from "./BarChart";
import { getTotalItemSold, getIncomeTrending, incomeChartConverter, dataConverterMenu } from "./DataConverter";
import {BsCurrencyDollar, BsFillBarChartFill} from 'react-icons/bs';
import {RiDashboard3Line} from 'react-icons/ri';
import { useData } from "../../customHooks/useData";
import Loader from "../../components/Loaders/Loader";
import { dateFormat } from "../../utils";
import {BiTrendingUp ,BiTrendingDown} from 'react-icons/bi';
import { STORES } from "../../indexedDB/indexedDB";
import CustomerTable from "./CustomerTable";

function Dashboard(props) {
    const [menu, ] = useData({
        store:'Menu',
        index:'id',
    })

    const [customers, ] = useData({
        store:'Customers',
        index:'customerID'
    })

    const [itemCount, ] = useData({
        store:'ItemCount',
        index:'Date',
        keyPath: new Date().toLocaleDateString("en-us"),
    });

    const [incomeUpToDate, ] = useData({
        store: STORES.INCOMEUPTODATE.name,
        index: STORES.INCOMEUPTODATE.keyPath,
        keyPath: 1,
    });

    const [income, setIncome] = useData({
        version: 2,
        store: STORES.INCOME.name,
        index: STORES.INCOME.keyPath,
        limit: 7,
    });


    const [loader, setLoader] = useState(false);
    const [customerSortBy, setCustomerSortBy] = useState(0);
    const [sortedCustomers, setSortedCustomers] = useState([]);

    const incomeTrending = getIncomeTrending(income);  
    const totalItemsSold =  getTotalItemSold(menu);
    const totalCustomers = customers.length;
    const revenueToday   =   income.find(income => income.Date === dateFormat())?.Total || 0;

    const incomeChart = incomeChartConverter(income);
    const menuChart = dataConverterMenu(menu);

    const selectOnChange = (e) => {
        const value = Number(e.target.value);
        setCustomerSortBy(value);
        let sortedCustomers = [...customers];
        
        if (value === 1) {
            sortedCustomers.sort((a, b) => b.orderCount - a.orderCount);
        } else if (value === 2) {
            sortedCustomers.sort((a, b) => b.totalSpent - a.totalSpent);
        }
        setSortedCustomers(sortedCustomers);
    }

    const handleIncomeOnChange = (e) => {
        setIncome({
            type: 'getlimit',
            limit: Number(e.target.value),
        });
    }

    useEffect(() => {
        setSortedCustomers(customers);
    }, [customers]);

    
    return (
        <>
        {loader && <Loader/>}
        <div className="row">
            <div className="col-8">
                <Header icon={<RiDashboard3Line/>} title='Dashboard'/>
            </div>
                
        </div>
        <div className="row">
            <CardInfoDB 
            dataTestId='income-up-to-date'
            title='Total Revenue Up to Date' value={Intl.NumberFormat('en-us',{style: 'currency', currency: 'USD'}).format(incomeUpToDate[0]?.Total??0)} icon={<BsCurrencyDollar size={30}/>}/>

            <CardInfoDB
            dataTestId='revenue-today'
            title={`Revenue Today ` + dateFormat()} value={Intl.NumberFormat('en-us',{style: 'currency', currency: 'USD'}).format(revenueToday)} icon={<BsCurrencyDollar size={30}/>}/>

            <CardInfoDB
             dataTestId='total-items-sold'
             title='Total items sold' value={Intl.NumberFormat('en-us').format(totalItemsSold)} icon={<BsFillBarChartFill size={30}/>}/>
            <CardInfoDB
             dataTestId='total-items-sold-today'
             title='Total items sold today' value={itemCount[0]?.Count??0} icon={<BsFillBarChartFill size={30}/>}/>

            <CardInfoDB
             dataTestId='total-customers'
             title='Total Customers' value={Intl.NumberFormat('en-us').format(totalCustomers)} icon={<BsFillBarChartFill size={30}/>}/>

            <CardInfoDB title='Trending (compared to the prior day)' value={incomeTrending + '%'} icon={incomeTrending >= 0? <BiTrendingUp/> : <BiTrendingDown/>}/>
        </div>
        <div className="row">
            <div className="col-xl-6">
                <div className="d-flex justify-content-end my-2">
                    <div onChange={handleIncomeOnChange} className="btn-group" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" className="btn-check" name="income" id="income1" autoComplete="off" value='7' defaultChecked={true}/>
                        <label className="btn btn-outline-primary" htmlFor="income1">Last 7 days</label>

                        <input type="radio" className="btn-check" name="income" id="income2" autoComplete="off" value='30'/>
                        <label className="btn btn-outline-primary" htmlFor="income2">Last 30 days</label>

                        <input type="radio" className="btn-check" name="income" id="income3" autoComplete="off" value='100000'/>
                        <label className="btn btn-outline-primary" htmlFor="income3">All</label>
                    </div>
                </div>
            </div>
            
        </div>

        <div className="row">
            <div className="col-xl-6">
                
                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-chart-area me-1"></i>
                        Revenue over time
                    </div>
                    
                    <div className="card-body">
                    <AreaChart data={incomeChart.data} labels={incomeChart.labels}/>    
                    </div>
                    
                </div>
            </div>
            <div className="col-xl-6">
                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-chart-bar me-1"></i>
                        Most ordered Items
                    </div>
                    <div className="card-body">
                        <BarChart data={menuChart.data} labels={menuChart.labels} />
                    </div>
                </div>
            </div>
        </div>
        
        <div className="row">
        <h3>Customers</h3>
        <div className="col-12">
            sort by:
            
                <select className="btn btn-outline-primary" value={customerSortBy} onChange={selectOnChange}>
                    <option value="0">Default</option>
                    <option value="1">Total Orders</option>
                    <option value="2">Total Spent</option>
                    
                </select>
        </div>
            <CustomerTable sortedCustomers={sortedCustomers}/>
        </div>
        </> 
        
     );
}

export default Dashboard;