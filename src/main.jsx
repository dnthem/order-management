import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import indexedDBController from "./indexedDB/indexedDB";
import "./style.css";
import { BrowserRouter } from "react-router-dom";

const DB_NAME = "ORDER_MANAGEMENT";
const root = ReactDOM.createRoot(
  document.getElementById("root")
);

export const STORES = {
  MENU: "Menu",
  INCOME: "Income",
  CUSTOMERS: "Customers",
  ORDERSV2: "OrdersV2",
  ITEMCOUNT: "ItemCount",
}


function Render (db, state = 1) {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App db={db} state={state} />
      </BrowserRouter>
    </React.StrictMode>
  );
}

async function registerIndexedDB() {
  if (!("indexedDB" in window)) {
    alert(
      "You browser does not support indexedDB, cannot store data in offline mode"
    );
  } else {
    console.log("initialize indexedDB...");
    try {
      return await indexedDBController.createDB(window.indexedDB, DB_NAME, 1)
    } catch (error) {
      alert("Error has occured: \n" + error);
    }
  }
}

function closeDB(db) {
  window.addEventListener("beforeunload", () => {
    db.close();
  });
}

async function init() {
  const DB = await registerIndexedDB();
  Render(DB);
  closeDB(DB);
}

window.addEventListener("DOMContentLoaded", init);
