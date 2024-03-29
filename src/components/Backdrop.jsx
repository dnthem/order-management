function Backdrop({zIndex = 999}) {
  return (
    <div
      className="backdrop"
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,.5)",
        zIndex,
      }}
    ></div>
  );
}

export default Backdrop;
