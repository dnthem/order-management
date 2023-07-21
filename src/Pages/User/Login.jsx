import { Link } from "react-router-dom";
import { fetchAPI, databaseDownloader } from "../../utils";
import { useState } from "react";
import {Loader} from "../../components";
import {useLocalStorage} from "../../customHooks";
import { API_URL } from "../../constants";
import indexedDBController, { STORES } from "../../indexedDB/indexedDB";
import { GetDataBaseContext } from "../../App";

function LogIn() {
  const { db } = GetDataBaseContext();
  const [user] = useLocalStorage("user", null);
  if (user) {
    window.location.href = "/";
  }
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
  };

  const deleteAll = async () => {
    const promises = [];

    for (const key in STORES) {
      promises.push(indexedDBController.deleteAllRecord(db, STORES[key].name));
    }

    await Promise.all(promises);
  };

  const fetchAll = async () => {
    const promises = [];

    for (const key in STORES) {
      promises.push(databaseDownloader({ db, store: STORES[key].name }));
    }

    await Promise.all(promises);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const { username, password } = loginInfo;
      if (!username || !password) {
        alert("Please fill all the fields");
        setLoading(false);
        return;
      }

      const data = await fetchAPI.post(`${API_URL}/login`, {
        username,
        password,
      });
      if (data.error) {
        setError(data.error);
        alert(data.error);
      } else {
        setLoginInfo({ username: "", password: "" });
        setError("");
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        await deleteAll();
        await fetchAll();
        setError("");
        alert("Login Success");
        window.location.href = "/";
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const border =
    error !== ""
      ? "form-floating mb-3 border border-danger border-2 rounded"
      : "form-floating mb-3";

  return (
    <>
      {loading && <Loader />}
      <div className="row justify-content-center">
        <div className="col-lg-5">
          <div className="card shadow-lg border-0 rounded-lg mt-5">
            <div className="card-header">
              <h3 className="text-center font-weight-light my-4">Login</h3>
            </div>
            <div className="card-body">
              <form>
                <div className={border}>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="username"
                    aria-label="username"
                    name="username"
                    value={loginInfo.username}
                    onChange={handleChange}
                  />
                  <label htmlFor="inputEmail">User Name</label>
                </div>
                <div className={border}>
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    aria-label="Password"
                    name="password"
                    value={loginInfo.password}
                    onChange={handleChange}
                  />
                  <label htmlFor="inputPassword">Password</label>
                </div>
                
                <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                  <a className="small" to="/forgotpassword" onClick={() => {alert('This feature has not yet been implemented!'); return;}}>
                    Forgot Password?
                  </a>
                  <button onClick={handleSubmit} className="btn btn-primary">
                    Login
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center py-3">
              <div className="small">
                <Link to="/signup">Don't have an account? Sign up!</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LogIn;
