import { Header } from "../../components";
import {RiSettings5Line} from 'react-icons/ri'
import { DownloadSection, UploadSection, DeleteSection } from "./components";
function Settings(props) {

    return ( 
        <>
        <div className="row">
            <Header icon={<RiSettings5Line/>} title='Settings'/>
            <aside>
                This section allows you to save all data into a file and transfer it to a different device.
            </aside>
        </div>
        <div className="row">
            <DownloadSection />

            <UploadSection/>

            <DeleteSection/>
        </div>
        
        </>
     );
}

export default Settings;