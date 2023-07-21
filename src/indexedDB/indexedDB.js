import sampleData from './sampleData'

const indexedDBController = {};

export const STORES = {
  INCOME: {
    name: 'Income',
    keyPath: 'Date',
  },
  MENU: {
    name: 'Menu',
    keyPath: 'id',
  },
  CUSTOMERS: {
    name: 'Customers',
    keyPath: 'customerID',
  },
  ORDERSV2: {
    name: 'Orders',
    keyPath: 'orderID',
  },
  INCOMEUPTODATE: {
    name: 'IncomeUpToDate',
    keyPath: 'id',
  }
}


/**
 * Creates indexedDB and return a db reference
 * @param {indexedDBRef} indexedDB indexedDB reference
 * @param {string} dbName Data name
 * @param {Number} version 
 * @returns indexedDB reference
 */
indexedDBController.createDB = function (indexedDB,  dbName, version = undefined) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      const incomeUpToDate = db.createObjectStore(STORES.INCOMEUPTODATE.name, { keyPath: STORES.INCOMEUPTODATE.keyPath, autoIncrement: true });
      
      const income = db.createObjectStore( STORES.INCOME.name , { keyPath: STORES.INCOME.keyPath });
      const menu  = db.createObjectStore(STORES.MENU.name, { keyPath: STORES.MENU.keyPath, autoIncrement: true });
      const customers = db.createObjectStore(STORES.CUSTOMERS.name, { keyPath: STORES.CUSTOMERS.keyPath, autoIncrement: true });
      const orderV2 = db.createObjectStore(STORES.ORDERSV2.name, { keyPath: STORES.ORDERSV2.keyPath, autoIncrement: true });

      incomeUpToDate.createIndex("id", "id", { unique: true });

      income.createIndex("Date", "Date", { unique: true });

      orderV2.createIndex("orderID", "orderID", { unique: true });
      orderV2.createIndex("customerID", "customer.customerID", { unique: false });
      orderV2.createIndex("deliverDate", "deliverDate", { unique: false });
      orderV2.createIndex("orderDate", "orderDate", {unique: false});

      customers.createIndex('customerID', 'customerID', { unique: true });
      customers.createIndex('phone', 'phone', { unique: false });
      menu.createIndex('id', 'id', { unique: true });
      
      if (import.meta.env.VITE_INDEXEDDB_SAMPLE_DATA === 'true') {
        sampleData['Menu'].forEach(e => menu.add(e));
        localStorage.setItem('nthOrderOfDay', sampleData['OrdersV2'].length);
        localStorage.setItem('isnewday', new Date().toLocaleDateString('en-us'));
        sampleData['IncomeUpToDate'].forEach(e => incomeUpToDate.add(e));
        sampleData['OrdersV2'].forEach(e => orderV2.add(e));
        sampleData['Customers'].forEach(e => customers.add(e));
        sampleData['Income'].forEach(e => income.add(e))
      }
    };
    request.onerror = (event) => reject(event.error);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
};

/**
 * Adds data to a particular object store
 * @param {indexedDBRef} db db reference
 * @param {string} store object store
 * @param {any} data data needed to be store to object store
 * @returns true if successful otherwise error message
 */
indexedDBController.addData = function (db, store, data) {
  return new Promise((res, rej) => {
    const trans = db.transaction(store, 'readwrite')
    const objStore = trans.objectStore(store);
    const request = objStore.add(data);
    request.onsuccess = function (e) {
      console.log('Added new data to ' + store + ' successful')
      res(e.target.result)
    }

    request.onerror = function (e) {
      console.log('Failed to add new data')
      rej(e.target.error)
    }
  })
}


/**
 * Adds list of data to a particular object store
 * @param {indexedDBRef} db db reference
 * @param {string} store object store
 * @param {any} data data needed to be store to object store
 * @returns true if successful otherwise error message
 **/
indexedDBController.addListDataToStore = function (db, store, data) {
  return new Promise((resolve, reject) => {
    const trans = db.transaction(store, 'readwrite');
    const objStore = trans.objectStore(store);
    const addRequests = [];

    data.forEach(e => {
      const request = objStore.add(e);

      const addPromise = new Promise((res, rej) => {
        request.onsuccess = function (event) {
          console.log('Added new data to ' + store + ' successfully');
          res();
        };

        request.onerror = function (event) {
          console.log('Failed to add new data + ', e, ' to ' + store + ' successfully');
          rej(event.target.error);
        };
      });

      addRequests.push(addPromise);
    });

    Promise.all(addRequests)
      .then(() => {
        resolve(true);
      })
      .catch(error => {
        reject(error);
      });
  });
};


/**
 * Retrieves all records from an object store
 * @param {indexedDBRef} db db reference
 * @param {string} store object store
 * @returns Return all data from a store
 */
indexedDBController.getAllDataFromStore = function (db, store) {
  return new Promise((res, rej) => {
    const trans = db.transaction(store, 'readwrite')
    const objStore = trans.objectStore(store);
    const request = objStore.getAll();
    request.onsuccess = function (event) {
      console.log('Successfully retreived all data')
      res(event.target.result)
    }
    request.onerror = (event) => {
      console.log('failed to retreive all data')
      rej(event.target.error);
    }
  })
}

/**
 * Retrieves all records from an object store with a particular value index
 * @param {indexedDBRef} db db reference
 * @param {string} store object store
 * @param {string} index index name
 * @param {any} keyPath value of the index
 * @returns list of records with the same value of the index
*/
indexedDBController.getARecord = function (db, store, keyPath) {
  return new Promise((res, rej) => {
      const trans = db.transaction(store, 'readonly');
      const objStore = trans.objectStore(store);
      const request = objStore.get(keyPath);
      request.onsuccess = function (event) {
          console.log('Successfully retreived ' + store)
          res(event.target.result)
      }
      request.onerror = (event) => {
        console.log('failed to retreive ' + store)
        rej(event.target.error);
      }
    })
}


/**
 * Get a record from an object store with a particular value index
 * @param {indexedDBRef} db 
 * @param {*} store 
 * @param {*} index
 * @param {*} keyPath
 * @returns 
 */
indexedDBController.getARecordFromIndex = function (db, store, index, keyPath) {
  return new Promise((res, rej) => {
    const trans = db.transaction(store, 'readonly');
    const objStore = trans.objectStore(store).index(index);
    const request = objStore.get(keyPath);
    request.onsuccess = function (event) {
        res(event.target.result)
    }
    request.onerror = (event) => {
      rej(event.target.error);
    }
  })
};
/**
 * Deletes a record from an object store
 * @param {indexedDBRef} db db reference
 * @param {string} store object store
 * @param {any} keyPath value of the index
 * @returns true if successful otherwise error message
 * */
indexedDBController.deleteARecord = function (db, store, keyPath) {
  return new Promise((res, rej) => {
    const trans = db.transaction(store, 'readwrite');
    const objStore = trans.objectStore(store);
    const request = objStore.delete(keyPath);
    request.onsuccess = function (event) {
        console.log('Successfully deleted the ' + store)
        res(true)
    }
    request.onerror = (event) => {
      console.log('failed to delete the ' + store)
      rej(event.target.error);
    }
  })
}

/**
 * Deletes all records from an object store
 * @param {indexedDBRef} db db reference
 * @param {string} store object store
 * @returns true if successful otherwise error message
 * */
indexedDBController.deleteAllRecord = function (db, store) {
  return new Promise((res, rej) => {
    const trans = db.transaction(store, 'readwrite');
    const objStore = trans.objectStore(store);
    const request = objStore.clear();
    request.onsuccess = function (event) {
        console.log('Successfully deleted all records ' + store)
        res(true)
    }
    request.onerror = (event) => {
      console.log('failed to delete all records ' + store)
      rej(event.target.error);
    }
  })
}

/**
 * Updates a record from an object store 
 * @param {indexedDBRef} db db reference
 * @param {string} store object store
 * @param {any} newVal new value of the record
 * @returns key for the new or updated record if successful otherwise error message
 * */
indexedDBController.updateARecord = function (db, store, newVal) {
    return new Promise((res, rej) => {
        const trans = db.transaction(store, 'readwrite');
        const objStore = trans.objectStore(store);
        const request = objStore.put(newVal);
        request.onsuccess = function (event) {
            console.log('Successfully update the ' + store)
            res(event.target.result)
        }
        request.onerror = (event) => {
          console.log('failed to update the ' + store)
          rej(event.target.error);
        }
      })
}

/**
 * Get all records from an object store with a particular value index
 * @param {indexedDB Object} db reference to indexedDB
 * @param {string} store store name
 * @param {string} index index name
 * @param {any} value value of the index
 * @returns list of records with the same value of the index
 */
indexedDBController.getListOfRecords = function (db, store, index, value = null) {
  return new Promise((res, rej) => {
    const trans = db.transaction(store, 'readwrite');
    const objStore = trans.objectStore(store).index(index);
    const request = value? objStore.getAll(value) : objStore.getAll();
    request.onsuccess = function (event) {
        console.log('Successfully retreived all data')
        res(event.target.result)
    }
    request.onerror = (event) => {
      console.log('failed to retreive all data')
      rej(event.target.error);
    }
  })
}

/**
 * Get a limit number of records from an object store with a particular value index
 * @param {indexedDB Object} db reference to indexedDB
 * @param {string} store store name
 * @param {string} index index name
 * @param {any} value value of the index
 * @returns list of records with the same value of the index
 * */
indexedDBController.getLimitRecords = function (db, store, keyPath, limit) {
  return new Promise((res, rej) => {
    const trans = db.transaction(store, 'readwrite');
    const objStore = trans.objectStore(store);
    const index = objStore.index(keyPath);
    const requestCursor = index.openCursor(null, 'prev');
    let count = 0;
    const result = [];
    requestCursor.onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor && count < limit) {
        result.push(cursor.value);
        count++;
        cursor.continue();
      } else {
        res(result);
      }
    }
    requestCursor.onerror = (event) => {
      alert('failed to retreive all data')
      rej(event.target.error);
    }
  })
}



export default indexedDBController;