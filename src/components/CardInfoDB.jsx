function CardInfoDB(props) {
    return ( 
        <div
            data-test-id={props.dataTestId}
         className="col-xl-3 col-md-6 mb-4 bg-" >
            <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                {props.title}</div>
                            <div 
                            data-test-id="card-info-value"
                            className="h5 mb-0 font-weight-bold text-gray-800">
                                {props.value}
                            </div>
                        </div>
                        <div className="col-auto">
                            {props.icon}
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default CardInfoDB;