import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import indexedDBController from "./indexedDB/indexedDB";
import "./style.css";

const DB_NAME = "ORDER_MANAGEMENT";
let State = 1;
const root = ReactDOM.createRoot(
  document.getElementById("layoutSidenav_content")
);

export const STORES = {
  MENU: "Menu",
  INCOME: "Income",
  CUSTOMERS: "Customers",
  ORDERSV2: "OrdersV2",
  ITEMCOUNT: "ItemCount",
}

if (import.meta.MODE === "production") {
  // nulltify console.log in production mode
  console.log = () => {};
}


function Render (db, state = 1) {
  root.render(
    <React.StrictMode>
      <App db={db} state={state} />
    </React.StrictMode>
  );
}

function toggleSideBar() {
  const sidebarToggle = document.body.querySelector("#sidebarToggle");
  if (sidebarToggle) {
    // Uncomment Below to persist sidebar toggle between refreshes
    // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
    //     document.body.classList.toggle('sb-sidenav-toggled');
    // }
    sidebarToggle.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.toggle("sb-sidenav-toggled");
      // localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
    });
  }
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
  State = localStorage.getItem("State")
    ? JSON.parse(localStorage.getItem("State"))
    : 1;
  toggleSideBar();
  Render(DB, State);

  document.querySelector("#Orders").addEventListener("click", () => {
    document.body.classList.toggle("sb-sidenav-toggled");
    localStorage.setItem("State", 1);
    Render(DB, 1);
  });
  document.querySelector("#Dashboard").addEventListener("click", () => {
    document.body.classList.toggle("sb-sidenav-toggled");
    localStorage.setItem("State", 2);
    Render(DB, 2);
  });
  document.querySelector("#History").addEventListener("click", () => {
    localStorage.setItem("State", 3);
    document.body.classList.toggle("sb-sidenav-toggled");
    Render(DB, 3);
  });
  document.querySelector("#Setting").addEventListener("click", () => {
    document.body.classList.toggle("sb-sidenav-toggled");
    localStorage.setItem("State", 4);
    Render(DB, 4);
  });
  document.querySelector("#Menu").addEventListener("click", () => {
    document.body.classList.toggle("sb-sidenav-toggled");
    localStorage.setItem("State", 0);
    Render(DB, 0);
  });
  closeDB(DB);
}

window.addEventListener("DOMContentLoaded", init);
