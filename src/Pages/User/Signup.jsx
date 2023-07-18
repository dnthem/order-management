import { useState } from "react";
import { Link } from "react-router-dom";
import { fetchAPI } from "../../utils";
import { API_URL } from "../../constants";
import indexedDBController, { STORES } from "../../indexedDB/indexedDB";
import { GetDataBaseContext } from "../../App";
function Signup() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [loading, setLoading] = useState(false);
  const { db } = GetDataBaseContext();

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const deleteAll = async () => {
    const promises = [];

    for (const key in STORES) {
      promises.push(indexedDBController.deleteAllRecord(db, STORES[key].name));
    }

    await Promise.all(promises);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      if (!userInfo.name || !userInfo.username || !userInfo.email || !userInfo.password || !userInfo.passwordConfirm) {
        alert("Please fill all the fields");
        return;
      }


      if (userInfo.password !== userInfo.passwordConfirm) {
        alert("Password and Confirm Password must be the same");
        return;
      }

      const payload = { ...userInfo };
      delete payload.passwordConfirm;
      const data = await fetchAPI.post(`${API_URL}/signup`, payload);
      if (data.error) {
        alert(data.error);
      } else {
        await deleteAll();
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/";
      }
      
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="row justify-content-center">
      <div className="col-lg-7">
        <div className="card shadow-lg border-0 rounded-lg mt-5">
          <div className="card-header">
            <h3 className="text-center font-weight-light my-4">Create Account</h3>
          </div>
          <div className="card-body">
            <form>
            <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="text"
                  placeholder="your name"
                  aria-label="name"
                  name="name"
                  value={userInfo.name}
                  onChange={handleChange}
                />
                <label htmlFor="name">Your Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="text"
                  placeholder="username"
                  name="username"
                  value={userInfo.username}
                  onChange={handleChange}
                />
                <label htmlFor="username">Username</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="inputEmail"
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  value={userInfo.email}
                  onChange={handleChange}
                />
                <label htmlFor="inputEmail">Email address</label>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="form-floating mb-3 mb-md-0">
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Create a password"
                      aria-label="password"
                      name="password"
                      value={userInfo.password}
                      onChange={handleChange}
                    />
                    <label htmlFor="password">Password</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating mb-3 mb-md-0">
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Confirm password"
                      aria-label="confirmPassword"
                      name="passwordConfirm"
                      value={userInfo.passwordConfirm}
                      onChange={handleChange}
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                  </div>
                </div>
              </div>
              <div className="mt-4 mb-0">
                <div className="d-grid">
                  <button className="btn btn-primary btn-block" onClick={handleSubmit}>
                    Create Account
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="card-footer text-center py-3">
            <div className="small">
              <Link to="/login">Have an account? Go to login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
