import Header from "../../components/Header";
import {RiSettings5Line} from 'react-icons/ri'
import DownloadSection from "./Download/DownloadSection";
import UploadSection from "./Upload/UploadSection";
import DeleteSection from "./Delete/DeleteSection";

function Settings(props) {

    return ( 
        <>
        <div className="row">
            <Header icon={<RiSettings5Line/>} title='Settings'/>
            <aside>
                This section allows you to save all data into a file and transfer it to different device
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