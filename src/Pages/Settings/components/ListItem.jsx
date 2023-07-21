function ListItem(props) {
    return ( 
        <div className="list-group-item">
            <div className="row align-items-center">
                <div className="col">
                    <strong className="mb-2">{props.title}</strong>
                    <p className="text-muted mb-0">{props.detail}</p>
                </div>
                <div className="col-auto">
                        {props.children}
                </div>
            </div>
        </div>
     );
}

export default ListItem;