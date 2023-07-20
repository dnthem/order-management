import ListItem from "../ListItem";
import InputFile from "../InputFile";
import indexedDBController from "../../../../indexedDB/indexedDB";
import { GetDataBaseContext } from "../../../../App";
import { STORES } from "../../../../indexedDB/indexedDB";

function UploadSection(props) {
    const {db} = GetDataBaseContext();

    const saveData = async (db, store, data) => {
        try {
            await indexedDBController.addListDataToStore(db, store, data);
            return true;
        } catch(error) {
            alert ('Failed to add to ' + store + '\nError: ' + error);
            return false;
        }
    }

    const handleOnChange = async (e, store = undefined) => {
        if (!confirm('Are you sure to load ' + (store??'all stores' )+ ' from this file')) return;

        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            // this will then display a text file
            const str = reader.result;
            const newLindIdx = str.indexOf('\n');
            if (newLindIdx != -1)
                var res = str.slice(0, newLindIdx);
            else 
                var res = str.slice(0, str.length);
            const data = JSON.parse(res);

            const promises = [];
            if (!store)
            {
                for (const store in STORES) {
                    if (STORES[store].name === STORES.ITEMCOUNT.name) continue;
                    
                    const promise = saveData(db, STORES[store].name, data[STORES[store].name]);

                    promises.push(promise);
                }
            }
            else {
                const promise = saveData(db, store, data);
                promises.push(promise);
            }

            Promise.all(promises).then((values) => {
                let result = true;
                for (const value of values) {
                    result = result && value;
                }
                if (result) alert ('Load successfully');
                else alert ('Failed to load');
            });
        };

        if (file) {
             reader.readAsText(file); 
        } else {
            alert ('Cannot read file');
        }
    }

    return ( 
        <div className="list-group mb-5 shadow my-2 py-2">
            <h2 className="ms-4">Upload</h2>
            <aside className="my-2 text-muted ms-4">All files in this section must be in the correct format, which means only files that have been downloaded from this app.</aside>
            <div className="ms-4">
                <ListItem
                    title='All'
                    detail="Load all data from a file "
                >
                    <InputFile onChange={(e) => handleOnChange(e)} />
                </ListItem>
                <ListItem
                    title='Menu'
                    detail="Load menu from a file"
                >
                    <InputFile onChange={(e) => handleOnChange(e, STORES.MENU.name)} />
                </ListItem>
                <ListItem
                    title='Income'
                    detail="Load Income from a file"
                >
                    <InputFile onChange={(e) => handleOnChange(e, STORES.INCOME.name)} />
                </ListItem>
                <ListItem
                    title='Orders'
                    detail="Load Orders from a file"
                >
                    <InputFile onChange={(e) => handleOnChange(e, STORES.ORDERSV2.name)} />
                </ListItem>
                <ListItem
                    title='Customers'
                    detail="Load Customers from a file"
                >
                    <InputFile onChange={(e) => handleOnChange(e, STORES.CUSTOMERS.name)} />
                </ListItem>
            </div>
        </div>
     );
}

export default UploadSection;