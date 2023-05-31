import Backdrop from "../Backdrop";
import "./Loader.css";
function Loader(props) {
    return ( 
        <>
        <Backdrop zIndex={999}/>
        <div className="position-fixed top-50 start-50 translate-middle" style={{zIndex: 1000}}>
            <svg id="loader" viewBox="25 25 50 50">
                <circle r="20" cy="50" cx="50"></circle>
            </svg>
            <span className='text-white d-block'>loading...</span>
        </div>
        </>
     );
}

export default Loader;