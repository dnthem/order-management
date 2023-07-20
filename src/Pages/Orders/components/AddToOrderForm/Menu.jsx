import MenuTable from "../../../../components/MenuTable";
function Menu(props) {
    return ( 
        <div className="col-8 px-4 h-100 position-relative overflow-auto">        
            <h2 className="section-title text-center position-sticky top-0 bg-white" style={{zIndex: '9999'}}>Menu</h2>
            <MenuTable menu={props.menu} select={props.updateOrder}/>
        </div>
     );
}

export default Menu;