function InputFile(props) {
    return ( 
        <div className="input-group my-2">
            {props.title && <label class="input-group-text" >{props.title}</label>}
            <input onChange={props.onChange} type="file" className="form-control"/>
        </div>
     );
}

export default InputFile;