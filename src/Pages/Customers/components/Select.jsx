function Select({label, selectOnChange, values, displayValues = values, ariaLabel = label }) {

  return (
    <div className="d-inline-flex mt-4">
      <label className="form-label me-2 mt-2" htmlFor="SelectGroup">
        {label}
      </label>

      <select
        aria-label={ariaLabel}
        className="form-select text-capitalize"
        id="SelectGroup"
        onChange={(e) => selectOnChange(e.target.value)}
        style={{ maxWidth: "max-content" }}
      >
        {values.map((value, index) => (
          <option key={value} value={value}>
            {displayValues[index]}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;