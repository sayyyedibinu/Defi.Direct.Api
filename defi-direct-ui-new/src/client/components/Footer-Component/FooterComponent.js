import React from 'react';
import { draftToHtml} from 'react-wysiwyg-typescript';
import ReactHtmlParser from 'react-html-parser';

import './FooterComponentStyle.css';

export default class FooterComponent extends React.Component {
    
    getHTML = () =>{
        if(!this.props.data) return "";
        this.props.data.footerText = this.props.data.footerText ? this.props.data.footerText : '{}';
        try{
            return ReactHtmlParser( draftToHtml(JSON.parse(this.props.data.footerText.replace(new RegExp("targetOption", "g"), "target"))) );
        }catch(e){
            console.warn('error:::', e);
            return "";
        }
    }
    
    render() {
        return (
            <div className="footerContainer">
            {
                this.getHTML()
            }
            </div>
        );
    }
    
}