import { useRef } from "react";
import { template } from "../assets";
function MenuTableCard(props) {
    const trRef = useRef();
    const handleOnclick = () => {

        trRef.current.classList.remove('fade-out');
        trRef.current.classList.add('fade-out');
        setTimeout(() => {
            trRef.current.classList.remove('fade-out');
        },1000);

        props.select(props.cardID);
    }

    return ( 
        <tr 
            data-test-id="menu-table-card"
            ref={trRef}>
            <td style={{verticalAlign:'middle'}}>
                <img loading="lazy" src={props.Photo !== undefined? URL.createObjectURL(props.Photo):template} alt="" width={'100vw'} /> 
                <span data-test-id="menu-table-card-name">{props.Title}</span>
            </td>
            <td
                data-test-id="menu-table-card-price"
             style={{verticalAlign:'middle'}}>${props.Price}</td>
            <td colSpan={2}  style={{verticalAlign:'middle'}}>
                <button 
                    data-test-id="add-to-order-btn"
                    className="btn" onClick={handleOnclick}>select</button>
                </td>
        </tr>
     );
}

export default MenuTableCard;