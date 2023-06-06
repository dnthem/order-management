import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
function TopBar({setToggleSideBar}) {
  const iconStyle = {
    color: "#545454"
  }
  return (
    <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
      <button
        class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0 mx-2"
        id="sidebarToggle"
        onClick={setToggleSideBar}
      >
        <FaBars style={iconStyle}/>
      </button>
      <Link class="navbar-brand ps-3" href="index.html">
        Order Management
      </Link>
    </nav>
  );
}

export default TopBar;
