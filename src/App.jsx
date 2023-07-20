import { createContext, useContext, useState } from "react"
import { Route, Routes, Link } from "react-router-dom";
import { Dashboard, History, Menu, Orders, LogIn, Signup, Customers } from "./Pages";
import { FaBars } from "react-icons/fa";
import { useToggle } from "./customHooks";
import { SideNavFooter, SideNavMenu } from "./components";
const ctx = createContext();

export function GetDataBaseContext() {
  return useContext(ctx);
}
function App(props) {
  const [db, ] = useState(props.db);
  const [sideBarToggle, setSideBarToggle] = useToggle(false);
  const value = { db };

  const iconStyle = {
    color: "#545454",
  }
  return (
   <div className={sideBarToggle?"sb-nav-fixed sb-sidenav-toggled":"sb-nav-fixed"}>
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
      <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0 mx-2" id="sidebarToggle" onClick={setSideBarToggle}>
        <FaBars style={iconStyle}/>
      </button>
      <Link className="navbar-brand ps-3" to="/">Order Management</Link>
    </nav>
    <div id="layoutSidenav">
      <div id="layoutSidenav_nav">
        <nav className="sb-sidenav accordion sb-sidenav-dark">
            <SideNavMenu/>
            <SideNavFooter/>
        </nav>
      </div>
        <div id="layoutSidenav_content">
          <main className="container-fluid px-4">
          <ctx.Provider value={value}>
            <Routes>
              <Route path="/" element={<Menu/>} />
              <Route path="/menu" element={<Menu/>} />
              <Route path="/orders" element={<Orders/>} />
              <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/history" element={<History/>} />
              <Route path="/customers" element={<Customers/>} />
              <Route path="/login" element={<LogIn/>} />
              <Route path='/signup' element={<Signup/>} />
            </Routes>
            </ctx.Provider>
          </main>
        </div>
      </div>
    
    </div>
 
  )
}

export default App
