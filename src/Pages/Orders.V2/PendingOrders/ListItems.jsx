import React, { useState } from 'react';
function ListItem(props) {
    const [showMore, setShowMore] = useState(false);
    const list = props.list;
    return ( 
        <ul data-test-id="order-cart-list" className="list-group" style={{ listStyle: "none" }} onClick={() => list.length > 3 && setShowMore(!showMore)}>
            {
                list.map((item, index, arr) => {
                    if (index === 3 && !showMore) {
                        return (
                            <li key={index}>
                               ...show more
                            </li>
                        )
                        
                    }
                    else if (index > 3 && !showMore) {
                        return;
                    }
                    else if (index === arr.length - 1 && showMore) {
                        return (
                            <>
                            <li key={index}>
                                {`${item.quantity} x ${item.name}`}
                            </li>
                            
                            <li key={index+1}>
                                show less
                            </li>
                            </>
                        )
                    }
                    else {
                        return (
                            <li key={index}>
                               {`${item.quantity} x ${item.name}`}
                            </li>
                        )
                    }
                })
            }
        </ul>
     );
}

export default ListItem;