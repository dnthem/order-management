import { FaTachometerAlt, FaHistory } from "react-icons/fa";
import { MdMenuBook } from "react-icons/md";
import { AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";

import { RiSettings5Line } from "react-icons/ri";
import { Link } from "react-router-dom";
function SideNavMenu() {
  const iconStyle = {
    color: "#545454",
  };
  return (
    <div className="sb-sidenav-menu">
      <div className="nav">
        <Link to="/dashboard" className="btn nav-link" id="Dashboard">
          <div className="sb-nav-link-icon">
            <FaTachometerAlt style={iconStyle} />
          </div>
          Dashboard
        </Link>
        <div className="sb-sidenav-menu-heading">Main</div>
        <Link to="/menu" id="Menu" className="nav-link btn">
          <div className="sb-nav-link-icon">
            <MdMenuBook style={iconStyle} />
          </div>
          Menu
        </Link>
        <Link to="/orders" id="Orders" className="btn nav-link">
          <div className="sb-nav-link-icon">
            <AiOutlineShoppingCart style={iconStyle} />
          </div>
          Orders
        </Link>
        <Link to="/history" id="History" className="btn nav-link">
          <div className="sb-nav-link-icon">
            <FaHistory style={iconStyle} />
          </div>
          History
        </Link>
        <Link to="/customers" id="Customers" className="btn nav-link">
          <div className="sb-nav-link-icon">
            <AiOutlineUser style={iconStyle} />
          </div>
          Customers
        </Link>
        <Link to="/settings" id="Setting" className="btn nav-link">
          <div className="sb-nav-link-icon">
            <RiSettings5Line style={iconStyle} />
          </div>
          Setting
        </Link>
      </div>
    </div>
  );
}

export default SideNavMenu;
