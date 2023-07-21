import { useState } from "react";


const IMAGE_TEMPLATE = '/template.jpg'

function ItemCardV2(props) {
    const [cardProps, setCardProps] = useState({});
    const [edit, setEdit] = useState(false);
    const [itemName, setItemName] = useState(props.Title);
    const [itemPrice, setItemPrice] = useState(props.Price);
    const [itemDescription, setItemDescription] = useState(props.Description);
    const [itemPhoto, setItemPhoto] = useState(props.Photo);
    const [itemCount, setItemCount] = useState(props.Count);
    const [itemHidden, setItemHidden] = useState(props.Hidden);


    const saveHandler = (e) => {
      const Title = itemName;
      const Price = itemPrice;
      const Description = itemDescription;
      const Photo = itemPhoto // imageRef.current.files[0];

      const newProp = {...cardProps}

      newProp.Title = Title? Title: newProp.Title;
      newProp.Price = Price? Number(Price): Number(newProp.Price);
      newProp.Description = Description? Description: newProp.Description;
      newProp.Photo = !(Photo === null || typeof Photo === 'undefined')? Photo: newProp.Photo;
      // update database
      const newData = {
        Description: newProp.Description,
        Photo: newProp.Photo,
        Title: newProp.Title,
        Price: newProp.Price,
        id: props.cardID,
        Count: props.Count,
        Hidden: props.Hidden
      }
      // update current card
      props.updateMenu(newData)
      // setCardProps(newProp);
      setEdit(false);
    }

    const removeHandler = (e) => {
      if (!confirm('Are you sure to remove this item?')) return;
      props.remove(props.cardID)
    }

    const cancleHandler = () => {
      setEdit(false);
    }

    const handleOnFocus = (e) => {
      if (!edit) return;
      e.target.select();
     
    }

    const hideHandler = () => {

      const newData = {
        Description: itemDescription,
        Photo: itemPhoto,
        Title: itemName,
        Price: itemPrice,
        id: props.cardID,
        Count: itemCount,
        Hidden: !itemHidden
      }
      setItemHidden(!itemHidden)
      props.updateMenu(newData)

    }

    const cardClass = edit? 'card border-danger border-2 overflow-hidden': 'card overflow-hidden';
    
  return (
    <div data-test-id="menu-item-card" className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 my-2 " style={itemHidden? {opacity: 0.5}:{}}>
    <div className={cardClass}>
      <img loading="lazy" src={itemPhoto !== undefined? URL.createObjectURL(itemPhoto):IMAGE_TEMPLATE} className="card-img-top" alt={cardProps.Title} />
      {edit && <input type='file' accept="image" onChange={(e) => setItemPhoto(e.target.files[0])}/>}

      <div className="card-body">
     
        {!edit && <span data-test-id={props.isNew?'new-card-item-name':'item-name'}  className="card-title border-0 fw-bold text-capitalize text-dark text-truncate">{itemName}</span>}
        {edit && <input data-test-id={props.isNew?'new-card-item-name':'item-name'} type='text' disabled={!edit} className="card-title bg-transparent border-0 text-capitalize" onFocus={handleOnFocus}  onChange={(e) => setItemName(e.target.value)} value={itemName} placeholder="item name"/>}

        <h6 className="card-subtitle mb-2" >
            
            Prices: $
            
            <input data-test-id={props.isNew?'new-card-item-price':'item-price'} type='number' inputMode="numeric" disabled={!edit} className="card-title bg-transparent border-0" onFocus={handleOnFocus}  onChange={(e) => setItemPrice(e.target.value)} value={itemPrice} style={{maxWidth: 'auto'}} min={0} max={100}/>

        </h6>

        <input type="textarea" className="form-control border-0 bg-transparent" disabled={!edit} id="exampleFormControlTextarea1" rows="3" placeholder="description here..." value={itemDescription} onChange={(e) => setItemDescription(e.target.value)}/>

        <div className="d-grid gap-2">
          <div className="d-flex justify-content-between">
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Hide from menu</label>
            <div className="form-check form-switch">
              <input data-test-id='hide' className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={hideHandler} checked={itemHidden}/>
              
            </div>
          </div>

          {
            !edit && 
            <button data-test-id={props.isNew?'new-card-edit':'edit'}  className="btn btn-primary" type="button" onClick={() => {setEdit(true)}}>Edit</button>
          }

          {
            edit && 
            <button data-test-id={props.isNew?'new-item-save':'save'}  className="btn btn-primary "  type="button"onClick={saveHandler}>Save</button>
          }

          {
            !edit && <button data-test-id={props.isNew?'new-item-remove':'remove'}  onClick={removeHandler} className="btn btn-danger" type="button">Remove</button>
          }

          {
            edit && <button data-test-id={props.isNew?'new-item-cancel':'cancle'}  onClick={cancleHandler} className="btn btn-danger" type="button">Cancel</button>
          }

          
        </div>
      </div>
    </div>
    </div>
  );
}

export default ItemCardV2;
