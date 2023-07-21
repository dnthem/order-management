import {BiDownload} from "react-icons/bi";

/**
 * Create a downloadable file as text
 * @param {*} props data - string type data to write, contentFormat - a function to format input data, insert null if not use, fileName - file name
 * @returns 
 */
function DownloadBtn(props) {
    const handleSaveToLocal = async () => {
        let content = undefined;
        if (props.contentFormat === null) {
            content = JSON.stringify(props.data);
        }
            
        else
            content= props.contentFormat(props.data)
        const a = document.createElement("a");
        const file = new Blob([content], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = props.fileName + new Date().toLocaleDateString('en-us');
        a.click();
    }
    return ( 
        <button className="mt-4 btn" onClick={handleSaveToLocal} disabled={props.disabled}>Download <BiDownload/></button>
     );
}

export default DownloadBtn;