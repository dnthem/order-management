import { createContext, useContext, useEffect, useState } from "react"
import Dashboard from "./Pages/Dashboard/Dashboard";
import History from "./Pages/History/History";
import Menu from "./Pages/Menu/Menu"
import Settings from "./Pages/Settings/Settings";
import OrdersV2 from "./Pages/Orders.V2/OrdersV2";
import AppContainer from "./components/Layouts/AppContainer";
import { Routes, Route } from "react-router-dom";
const ctx = createContext();


export function GetDataBaseContext() {
  return useContext(ctx);
}
function App(props) {
  const [db, ] = useState(props.db);
  const value = { db }

  return (
    <AppContainer>
      <ctx.Provider value={value}>
        <main className="container-fluid px-4">
        <Routes>
              <Route path="/" element={<Menu/>} />
              <Route path="/Menu" element={<Menu/>} />
              <Route path="/orders" element={<OrdersV2/>} />
              <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/history" element={<History/>} />
              <Route path="/settings" element={<Settings/>} />
            </Routes>
        </main>
      </ctx.Provider>
    </AppContainer>
  )
}

export default App
