import ListItem from "../ListItem";
import DownloadBtn from "../../../components/Downloadbtn";
import indexedDBController from "../../../indexedDB/indexedDB";
import { GetDataBaseContext } from "../../../App";
import { STORES } from "../../../indexedDB/indexedDB";
function DownloadSection(props) {
    const {db} = GetDataBaseContext();

    const getData = async (store) =>  await indexedDBController.getAllDataFromStore(db, store);

    const allData = async () => {
        const income = await getData(STORES.INCOME.name);
        const menu = await getData(STORES.MENU.name);
        const orders = await getData(STORES.ORDERSV2.name);
        const customers = await getData(STORES.CUSTOMERS.name);
        const incomeUpToDate = await getData(STORES.INCOMEUPTODATE.name);
        return {
            [STORES.INCOME.name]: income,
            [STORES.MENU.name]: menu,
            [STORES.ORDERSV2.name]: orders,
            [STORES.CUSTOMERS.name]: customers,
            [STORES.INCOMEUPTODATE.name]: incomeUpToDate
        }

    }
    return ( 
        <div className="list-group mb-5 shadow my-2 py-2">
                <h2 className="ms-4">Download </h2>
                <div className="ms-4">
                <ListItem 
                    title='Save all data' 
                    detail='Take a snapshot of all your data into a single file so you can save it wherever you want'
                >
                    <DownloadBtn data={async () => allData()} contentFormat={null} fileName='All_Data_'/>
                </ListItem>
                <ListItem
                    title='Save all your Income information'
                    detail='Take a snapshot of all your income history into a single file'
            
                >
                    <DownloadBtn data={async() => getData(STORES.INCOME.name
                        )} contentFormat={null} fileName='Income_'/>
                </ListItem>
                <ListItem
                    title='Save all your Menu information'
                    detail="Take a snapshot of all your menu into a single file, but cannot save items' photos"
          
                >
                    <DownloadBtn data={async() => getData(STORES.MENU.name)} contentFormat={null} fileName='Menu_'/>
                </ListItem>
                <ListItem
                    title='Save all your Order history'
                    detail="Take a snapshot of all your orders into a single file"
                >
                    <DownloadBtn data={async() => getData(STORES.ORDERSV2.name)} contentFormat={null} fileName='Orders_'/>
                </ListItem>

                <ListItem
                    title='Save all your Customer information'
                    detail="Take a snapshot of all your customers into a single file"
                >
                    <DownloadBtn data={async() => getData(STORES.CUSTOMERS.name)} contentFormat={null} fileName='Customers_'/>
                </ListItem>
                </div>
            </div>
     );
}

export default DownloadSection;