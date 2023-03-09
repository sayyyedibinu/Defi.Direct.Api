import React from 'react';

import './HomePageComponent.css';
import styles from './HomePageComponentStyle';

import compose from 'recompose/compose';
//import Hidden from '@material-ui/core/Hidden';
import withWidth from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
//import Paper from '@material-ui/core/Paper';
//import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class HomePageComponent extends React.Component{
    constructor(props){
        super(props);
        
        this.redirect = this.redirect.bind(this);
    }
    
    redirect(){
        window.scrollTo(0, 0);
        this.props.history.push('/Application/'+this.props.pageID);
        /*this.props.history.push('/PersonalLoan');*/
    }
    
    render(){
        return (
            <div className="HomeContainer">
                <Grid container spacing={0} >
            
                    <Grid item xs={12} style={styles.HomeContainerGrid1}>
                        <h1 className="firstSectionHeader">Generic Lender Headline</h1>
                        <p className="firstSectionText">This is just example content of a lender website</p>
                    </Grid>
                    
                    <Grid container spacing={0} >
            
                        <Grid item xs={12} md={4} style={styles.HomeContainerGrid2}>
                            <h2 className="secondSectionHeader">Here's how it works</h2>
                            <p><img src={require("../../assets/img/form.png")} width="90" alt="ICON"/></p>
                            <p className="firstSectionText" style={styles.firstSectionText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum interdum turpis ac.</p>
                        </Grid>

                        <Grid item xs={12} md={4} style={styles.HomeContainerGrid3}>
                            <p><img src={require("../../assets/img/holdingMoney.png")} width="90" alt="ICON"/></p>
                            <p className="firstSectionText" style={styles.firstSectionText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum interdum turpis ac.</p>
                        </Grid>

                        <Grid item xs={12} md={4} style={styles.HomeContainerGrid4}>
                            <p><img src={require("../../assets/img/carHouse.png")} width="90" alt="ICON"/></p>
                            <p className="firstSectionText" style={styles.firstSectionText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum interdum turpis ac.</p>
                        </Grid>

                    </Grid>
                    
            
                    <Grid item xs={12} style={styles.HomeContainerGrid5}>
                        <p className="bottomSectionText">Ready to start?</p>
                        <Button variant="raised" style={styles.personalLoanBtn} onClick={this.redirect}> Apply for a loan now!</Button>
                    </Grid>
                    
                    <Grid item xs={12} style={styles.HomeContainerGrid6}>
                        <p><img src={require("../../assets/img/logo-acmeMuted.png")} width="250" className="footerImg" alt="ACME" /></p>
                        <p className="footerExtraItems">
                            <a href="" className="footerLink">Legal Stuff</a>
                            <a href="" className="footerLink">Legal Stuff</a>
                            <a href="" className="footerLink">Legal Stuff</a>
                        </p>
                        <p className="footerDesc">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum interdum turpis acLorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum interdum turpis acLorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum interdum turpis ac.
                        </p>
                        
                    </Grid>
                        
                        
                </Grid>
                
            </div>
            
        );
    }
}

export default compose(withWidth(), withStyles(styles))(HomePageComponent);
                        
                        
/*<Button variant="raised" style={styles.personalLoanBtn} onClick={this.redirect}>Personal Loan</Button>
<br />
<Button variant="raised" style={styles.autoLoanBtn}>Auto Loan</Button>*/