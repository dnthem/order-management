import Header from "../../components/Header";
import ItemCardV2 from "../../components/ItemCard_v2";
import {GrFormAdd} from 'react-icons/gr';
import {MdMenuBook} from 'react-icons/md';
import { dateFormat } from "../../utils";
import { useData } from "../../customHooks/useData";
import { STORES } from "../../indexedDB/indexedDB";

function Menu(props) {
  const [menu, setMenu] = useData({ store: STORES.MENU.name, index: STORES.MENU.keyPath });

  /**
   * Callback function passed to itemCard, and is called from item card
   * @param {Number} key item identifier, it is uneque to each item
   */
  const removeItemFromMenu = (key) => {
    setMenu({
      type: "delete",
      indexField: "id",
      keyPath: key,
    })
  };

  const addNewItem = async () => {
    // create empty item from db
    const data = {
      Title: undefined,
      Price: 0,
      Notes: undefined,
      Count: 0,
      Photo: undefined,
      Hidden: false,
      DateAdded: dateFormat(),
      new: true,
    };
    setMenu({
      type: "add",
      indexField: "id",
      newVal: data,
    });
    
  };

  const updateMenu = (newItem) => {
    console.log(newItem);
    newItem.new = false;
    setMenu({
      type: "update",
      indexField: "id",
      newVal: newItem,
    });
  };

  return (
    <>
      <div className="row">
        <div className="col">
          <Header icon={<MdMenuBook/>} title="Menu" />
        </div>
        <div className="col">
          <div className="d-flex justify-content-center">
            <button data-test-id='add-new-item' className="mt-4 btn border-black" onClick={addNewItem}>
            <GrFormAdd/>Add new item 
            </button>
          </div>
          
        </div>
      </div>
      <div className="row">
        {
          menu.map((e) => (
            <ItemCardV2
              remove={removeItemFromMenu}
              key={e.id}
              cardID={e.id}
              Title={e.Title}
              Price={e.Price}
              Content={e.Content}
              Photo={e.Photo}
              updateMenu={updateMenu}
              Count={e.Count}
              Hidden={e.Hidden}
              isNew={e.new}
            />
          )).reverse()
        }
      </div>
    </>
  );
}

export default Menu;
