import { useLocalStorage } from "../../customHooks";
import { Link } from "react-router-dom";
import { STORES } from "../../indexedDB/indexedDB";
import indexedDBController from "../../indexedDB/indexedDB";
import { GetDataBaseContext } from "../../App";
function SideNavFooter() {
  const [user, ] = useLocalStorage("user", null);
  const { db } = GetDataBaseContext();

  const deleteAll = async () => {
    const promises = [];

    for (const key in STORES) {
      promises.push(indexedDBController.deleteAllRecord(db, STORES[key].name));
    }

    await Promise.all(promises);
  };

  const handleLogout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    await deleteAll();
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