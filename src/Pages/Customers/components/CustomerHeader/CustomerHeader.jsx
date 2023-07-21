import { Header } from "../../../../components";
import { AiOutlineUser, AiOutlineSearch} from "react-icons/ai";
function CustomerHeader({ query, setQuery, setAddFormToggle }) {
  return (
    <div className="row">
      <div className="col-sm-12 col-md-4">
        <Header title="Customers" icon={<AiOutlineUser />} />
      </div>

      <div className="col-sm-12 col-md-8">
        <div className="d-flex justify-content-evenly mt-4">
          <button
            aria-label="add-new-customer-btn"
            className="btn text-primary "
            onClick={setAddFormToggle}
          >
            + Add Customer
          </button>

          <div className="input-group " style={{ width: "15em" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search customers"
              aria-label="customer-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <label className="input-group-text" id="basic-addon2">
              <AiOutlineSearch />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerHeader;
