import { useState, useEffect } from "react";
import { GetDataBaseContext } from "../App";
import indexedDBController from "../indexedDB/indexedDB";

/**
 * Get all records from an object store with a particular value index
 * @param {string} store - the name of the object store
 * @param {string} index - the name of the index
 * @param {string} keyPath - the value of the index, if null, then all records are returned
 * @returns [data, updateData] - the data from the object store and a function to update the data in the object store
 * 
 */
export function useData({ store, index, keyPath, version = 1, limit= 1 }) {
  const [data, setData] = useState([]);
  const { db } = GetDataBaseContext();

  useEffect(() => {
    async function getData() {
      try {
        if (version === 1)
          var response = await indexedDBController.getListOfRecords(db, store, index, keyPath);
        else
          var response = await indexedDBController.getLimitRecords(db, store, index, limit);
        setData(response??[]);
      } catch (error) {
        alert(error);
      }
    }
    getData();
  }, [store, index]);

  /**
   * Update data in the object store
   * @param {string} type - add, update, delete, getlimit
   * - add: add a new record to the object store
   * - update: update an existing record in the object store or if the record does not exist, add a new record
   * - delete: delete a record from the object store
   * - getlimit: get a number of records from the object store
   * @param {string} indexField - the field that is used as the index
   * @param {Object} newVal - the new value to be added or updated
   * @param {string} keyPath - the keyPath of the record to be deleted
   * @param {number} limit - the number of records to be returned
   * @returns the new ID of the record added
   * @throws error if the type is invalid
   */
  async function updateData({ type, indexField, newVal = null, keyPath = "", limit }) {
    /*
      explaination of the callback function in useData:
      By using the callback form of setData, we ensure that the state is updated correctly, even when multiple updateData calls are made in quick succession.
    */

    try {
      switch (type) {
        case "add":
          const res = await indexedDBController.addData(db, store, newVal);
          setData(prevData => [...prevData, { ...newVal, [indexField]: res }]);
          return res;
  
        case "update":
          await indexedDBController.updateARecord(db, store, newVal);
          if (data.length === 0) {
            setData([newVal]);
            return null;
          }
          setData(prevData =>
            prevData.map(item => (item[indexField] === newVal[indexField] ? newVal : item))
          );
          return null;
  
        case "delete":
          await indexedDBController.deleteARecord(db, store, keyPath);
          setData(prevData => prevData.filter(item => item[indexField] !== keyPath));
          return null;
  
        case "getlimit":
          const response = await indexedDBController.getLimitRecords(db, store, index, limit);
          setData(response);
          return null;
  
        default:
          throw new Error("Invalid type");
      }
    } catch (error) {
      alert(error);
    }
  }

  return [data, updateData];
}


