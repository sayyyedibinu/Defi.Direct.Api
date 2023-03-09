import React from 'react';
import './SelectImageModalStyle.css';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
/*import TextField from '@material-ui/core/TextField';*/

export default class SelectImageModalComponent extends React.Component{
    constructor(props){      
        super(props);
        this.state = {filevalue: '', error: false};
       
    }
    
    handleChange = (event) => {
        let filevalue = event.target.files[0];       
        this.setState({filevalue: event.target.files[0], error: false});
        this.props.SelectedImage(filevalue);
      }
   insertImage = () =>{
       if(this.state.filevalue === ''){
           this.setState({error: true});
          return;
      }
       this.props.insertImage();
       this.setState({filevalue: '', error: false});
   }
   
        
    render(){
        return(
            <Modal open={this.props.showChooseImageModal} onClose={this.props.showChooseImageCloseModal} >
              <div  style={{width: "100%"}}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={10} md={9} lg={6} className="SIM-Wrapper">
                        <div className="SIM-Container">
                            <span className="SIM-CloseBtn" onClick={this.props.showChooseImageCloseModal}>
                                <i className="material-icons">clear</i>
                            </span>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <h2 className="SIM-Header">Upload an Image</h2>
                                </Grid>
                                <Grid item xs={12}>
                                
                                    <div className="SIM-Footer">
                                        <div className="upload-file">
                                            <input title="" type="file" className="file-upload-input" id="image_uploads" name="image_uploads" accept=".jpg, .jpeg, .png, .svg, .gif"  onChange={this.handleChange}/>
                                            <label htmlFor="image_uploads" className="file-label">Browse</label>
                                        </div>
                                        <p className="descTxt error-mesage">Acceptable file types are .png ,.jpg,.svg and .gif</p>
                                        {
                                            this.state.error === true && <p className="descTxt error">Select Image and Continue.</p>
                                        }
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <div className="SIM-Footer">
                                        <Button variant="contained"  className="cancelBtn appSecondaryClr" onClick={this.props.showChooseImageCloseModal}>
                                            Cancel
                                        </Button>
                                        <Button variant="contained" className="insertBtn appSecondaryBGClr" onClick= {this.insertImage}>
                                            Insert Image
                                        </Button>                                          
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
              </div>
        </Modal>
        )
    }
}
