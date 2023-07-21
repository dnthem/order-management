function PageLink({ page, handlePageChange, filteredCustomers, numberToDisplay }) {
  const disabledBackward = page === 1;
  const disabledForward = page === Math.ceil(filteredCustomers.length / numberToDisplay);
  return ( 
    <div className="row">
          <div className="d-flex justify-content-center">
              <nav aria-label="Page navigation example">
                  <ul className="pagination">
                      <li className="page-item">
                          <button
                              className="page-link"
                              aria-label="Previous"
                              onClick={() => handlePageChange(page - 1)}
                              disabled={disabledBackward}
                          >
                              <span 
                                className={disabledBackward? "text-muted":""}
                                aria-hidden="true">&laquo;</span>
                          </button>
                      </li>
                      <li>
                        <span className="page-link">{page}</span>
                      </li>
                      <li className="page-item">

                          <button
                              className="page-link"
                              aria-label="Next"
                              onClick={() => handlePageChange(page + 1)}
                              disabled={disabledForward}
                          >
                              <span className={disabledForward? "text-muted":""} aria-hidden="true">&raquo;</span>
                          </button>
                      </li>
                  </ul>
              </nav>
          </div>
      </div>
   );
}

export default PageLink;