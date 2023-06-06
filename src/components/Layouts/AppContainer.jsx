import React, { useState } from "react";
import TopBar from "./TopBar";
import NavSideBar from "./NavSideBar";

function AppContainer({ children }) {
  const [toggleSideBar, setToggleSideBar] = useState(false);
  const sideBarClass = toggleSideBar
    ? "sb-nav-fixed sb-sidenav-toggled"
    : "sb-nav-fixed";


  return (
    <div className={sideBarClass}>
      <TopBar setToggleSideBar={() => setToggleSideBar(!toggleSideBar)} />
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
            <NavSideBar/>
        </div>
        <div id="layoutSidenav_content">
            {children}
        </div>
      </div>
    </div>
  );
}

export default AppContainer;
