import { GetDataBaseContext } from "../../../../App";
import indexedDBController, { STORES } from "../../../../indexedDB/indexedDB";
import ListItem from "../ListItem";


const DB_LIST = [];
for (const key in STORES) {
    DB_LIST.push(STORES[key].name);
}
const DB_NAME = 'ORDER_MANAGEMENT';
function DeleteSection(props) {
    const {db} = GetDataBaseContext();

    const deleteGuard = () => {
        alert('Make sure that you have saved all your nesscessary information!');
        const randomNumber = Math.floor(Math.random() * 10000 * new Date().getMilliseconds());
        const answer = prompt(`Please, enter the following number to confirm: ${randomNumber}`);
        if (Number(answer) === randomNumber) {
            return true;
        } else {
            alert('Incorrect');
            return false;
        }
    }
    
    const onDeleteAll = (...tables) => {
        if (!deleteGuard()) return;
        try {
            tables.forEach(async (db_name) => {
                await indexedDBController.deleteAllRecord(db, db_name);
            });
            alert('All data has been deleted!');
        } catch (error) {
            alert('Error occured: ' + error);
        } 

        
    }

 

    return ( 
        <div className="list-group mb-5 shadow my-2 py-2" style={{outline: 'red 1px solid'}}>
            <h2 className="ms-4 text-danger">Delete</h2>
            <aside className="text-danger ms-4 my-2"> (danger zone)</aside>
            <div className="ms-4">
                <ListItem
                    title='Delete all your orders'
                    detail='This will reset all your order history including today orders'
                >
                    <button onClick={() => onDeleteAll(STORES.ORDERSV2.name)} className="btn btn-danger">Delete</button>
                </ListItem>

                <ListItem
                    title='Delete all your customers'
                    detail='This will remove all your customer information.'
                >
                    <button onClick={() => onDeleteAll(STORES.CUSTOMERS.name)} className="btn btn-danger">Delete</button>
                </ListItem>

                <ListItem
                    title='Delete data income up to date table'
                    detail='This will reset your income up to date table.'
                >
                    <button onClick={() => onDeleteAll(STORES.INCOMEUPTODATE.name)} className="btn btn-danger">Delete</button>
                </ListItem>

                <ListItem
                    title='Delete all your income history'
                    detail='This will reset your income history.'
                >
                    <button onClick={() => onDeleteAll(STORES.INCOME.name)} className="btn btn-danger">Delete</button>
                </ListItem>

                <ListItem
                    title='Delete All your data'
                    detail='Please make sure you have saved all your data before proceeding further in this step.'
                >
                    <button onClick={() => onDeleteAll(...DB_LIST)} className="btn btn-danger">Delete</button>
                </ListItem>


            </div>
        </div>
     );
}

export default DeleteSection;