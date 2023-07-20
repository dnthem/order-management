import { useLocalStorage } from "../../customHooks";
import { Link } from "react-router-dom";
function SideNavFooter() {
  const [user, ] = useLocalStorage("user", null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  }
  return ( 
    <div className="sb-sidenav-footer">
      {
        user? 
        <>
          <div className="small">Hello, you logged in as:</div>
          <span>{user.name || user.username || user.email || user._id}</span>
          <br/>
          <a className="nav-link btn text-secondary" onClick={handleLogout}>Logout</a>
          
        </>
        :
        <>
          <div className="small">You are not logged in</div>
        <Link to='/login' className="nav-link text-secondary">Login</Link>
        </>
      }
      
      
    </div>
   );
}

export default SideNavFooter;