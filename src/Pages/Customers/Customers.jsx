import { useData, useToggle } from "../../customHooks";
import { STORES } from "../../indexedDB/indexedDB";
import { CustomerTable, CustomerHeader, Select, PageLink } from "./components"
import {UserInfoForm} from "../Orders/components";
import { useDeferredValue, useState } from "react";

function Customers(props) {
  const [customers, setCustomers] = useData({
    store: STORES.CUSTOMERS.name,
    index: STORES.CUSTOMERS.keyPath,
    keyPath: null,
  });

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [addFormToggle, setAddFormToggle] = useToggle(false);
  const [sortedBy, setSortedBy] = useState("registerationDate");
  const [page, setPage] = useState(1);
  const [numberToDisplay, setNumberToDisplay] = useState(10); // [10, 25, 50]
  const isStale = query !== deferredQuery;
  const customerProperties = customers[0] ? Object.keys(customers[0]) : [];

  const handleSortBy = (sortBy) => {
    setSortedBy(sortBy);
  };

  const filteredCustomers = customers.filter((customer) => {
    return customer.customerName
      .toLowerCase()
      .includes(deferredQuery.toLowerCase());
  });

  const sortedCustomers = filteredCustomers.sort((a, b) => {
    if (a[sortedBy] < b[sortedBy]) {
      return 1;
    }
    if (a[sortedBy] > b[sortedBy]) {
      return -1;
    }
    return 0;
  });

  const numberToDisplayCustomers = sortedCustomers.slice(
    (page - 1) * numberToDisplay,
    page * numberToDisplay
  );

  const handlePageChange = (page) => {
    setPage(page);
  };

  const deleteCustomer = async (id) => {
    await setCustomers({
      type: "delete",
      indexField: STORES.CUSTOMERS.keyPath,
      keyPath: id,
    });
  };

  const updateCustomer = (id, newVal) => {
    setCustomers({
      type: "update",
      indexField: STORES.CUSTOMERS.keyPath,
      newVal: { ...newVal, [STORES.CUSTOMERS.keyPath]: id },
    });
  };

  return (
    <>
      {addFormToggle && (
        <UserInfoForm
          setCustomers={setCustomers}
          customers={customers}
          onAddCustomerSubmit={() => setAddFormToggle(false)}
          showForm={setAddFormToggle}
        />
      )}
      <CustomerHeader
        query={query}
        setQuery={setQuery}
        setAddFormToggle={setAddFormToggle}
      />

      <div className="row">
        <div className="d-flex justify-content-between">
          <Select
            label='Sort By'
            selectOnChange={handleSortBy}
            values={customerProperties}
            displayValues={customerProperties.map((property) =>
              property.replace(/([A-Z])/g, " $1").trim()
            )}
          />
          <Select
            label="Entry per page"
            selectOnChange={setNumberToDisplay}
            values={[10, 25, 50]}
          />
        </div>
      </div>
      <div
        className="row"
        style={{
          opacity: isStale ? "0.5" : "1",
          transition: isStale
            ? "opacity 0.2s 0.2s linear"
            : "opacity 0s 0s linear",
        }}
      >
        <CustomerTable
          sortedCustomers={numberToDisplayCustomers}
          deleteCustomer={deleteCustomer}
          updateCustomer={updateCustomer}
        />
      </div>
      <PageLink
        page={page}
        handlePageChange={handlePageChange}
        filteredCustomers={filteredCustomers}
        numberToDisplay={numberToDisplay}
      />
    </>
  );
}

export default Customers;
