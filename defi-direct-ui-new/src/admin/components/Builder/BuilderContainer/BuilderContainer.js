import React from "react";
/*import ReactDOM from "react-dom";*/

import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import Resizable from 're-resizable';
import "./BuilderContainer.css";
import Empty from "./Empty/Empty";
//import FormSteps from "./FormSteps/FormSteps";
//import Grid from '@material-ui/core/Grid';
/*import Frame from 'react-frame-component';*/
//import Hidden from '@material-ui/core/Hidden';

import Playground from './Playground/Playground';
import PlaygroundWithoutSteps from './Playground/PlaygroundWithoutSteps';

class BuilderContainerComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {width: '100%', height: '100%', curMode: 'desktopMode'};
        /*if(this.props.width === 'xs') this.state.curMode = 'mobileMode';
        else if(this.props.width === 'sm') this.state.curMode = 'tabMode';
        else this.state.curMode = 'desktopMode';*/
        /*if(!window.primaryColor) window.primaryColor = "#7068E2";
        if(!window.secondaryColor) window.secondaryColor = "#83CAFD";
        if(!window.backgroundColor) window.backgroundColor = "#FCFCFD";*/
        localStorage.setItem('askToLeave', false);
    }
    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    resize = () => {
        var _tempVar = this.state;
        if(document.getElementById("_bulderResponsiveWrapper") === null) return;
        if(document.getElementById("_bulderResponsiveWrapper").offsetWidth < 450) _tempVar.curMode = 'mobileMode';
        else if(document.getElementById("_bulderResponsiveWrapper").offsetWidth > 450 &&  document.getElementById("_bulderResponsiveWrapper").offsetWidth < 768) _tempVar.curMode = 'tabMode';
        else _tempVar.curMode = 'desktopMode';
        this.setState(_tempVar);
    }
    /*updateIFrameContents = () => {
        console.log(this.el);
    }
    componentDidMount = () => {
        console.log(ReactDOM.findDOMNode(this));    
    }*/
    /*getWidthValue = () => {
        if(this.state.width.indexOf('%')) return 1000;
        return this.state.width.replace('px', '');
        console.log(this.state.width);
    }*/
    componentDidUpdate = (prevProps) => {
        if (prevProps.displayMode === this.props.displayMode) return;
        var _tempVar = this.state;
        if (this.props.displayMode === 'default') {
            _tempVar.width = '100%';
            _tempVar.curMode = 'desktopMode';
        } else if (this.props.displayMode === 'tab') {
            _tempVar.width = '768px';
            _tempVar.curMode = 'tabMode';
        } else {
            _tempVar.width = '375px';
            _tempVar.curMode = 'mobileMode';
        }
        this.setState(_tempVar);
    }
   
    render(){
        return(
            <div>
                {
                    this.props.pages.length === 0 && 
                    <div className={"bulderResponsiveWrapper"+(this.props.displayMode ? this.props.displayMode:'default')}>
                        <Empty openModal={this.props.openModal}/>
                    </div>
                }

                {
                    this.props.pages.length > 0 && 
                    <Resizable id="_bulderResponsiveWrapper" className={"bulderResponsiveWrapper "+(this.props.displayMode ? this.props.displayMode:'default')}
                      size={{ width: this.state.width, height: this.state.height }}
                      minWidth={375} 
                      enable={{top: false, bottom: false, left: false, right: (this.props.displayMode === 'default' ? false : true)}}
                        onResize={(e, direction, ref, d) => {
                            this.setState({
                              width: ref.style.width
                            });
                            this.resize();
                        }
                      }
                      >
                        {
                            this.props.displayMode !== 'default' &&
                            <span className="screenWidthIndicatorCnt">
                                Screen Width: 
                                <span className="screenWidthIndicatorBox">
                                    {this.state.width}
                                </span>
                            </span>
                        }
                        
                        {
                            this.props.selectedPage === 'Application' && <Playground className="iFrame" parentClass={this.state.curMode} siteData={this.props.siteData} steps={this.props.steps} selectedPage={this.props.selectedPage} selectedStep={this.props.selectedStep} showNotification={this.props.showNotification} showInsertText={this.props.showInsertText} showInsertImage={this.props.showInsertImage} showInsertField={this.props.showInsertField} openInsertField={this.props.openInsertField} closeInsertField={this.props.closeInsertField}  invokeSaveSite={this.props.invokeSaveSite} onSaveComplete={this.props.onSaveComplete} saveCallback={this.props.saveCallback}/>
                        }
                        {
                           this.props.selectedPage === 'Decision' && <PlaygroundWithoutSteps parentClass={this.state.curMode} siteData={this.props.siteData} showNotification={this.props.showNotification} saveCallback={this.props.saveCallback} selectedPage={this.props.selectedPage} invokeSaveSite={this.props.invokeSaveSite} onSaveComplete={this.props.onSaveComplete} showInsertField={this.props.showInsertField} openInsertField={this.props.openInsertField} closeInsertField={this.props.closeInsertField} />
                        }
                        {
                            this.props.selectedPage === 'Pending' && <PlaygroundWithoutSteps parentClass={this.state.curMode} siteData={this.props.siteData} showNotification={this.props.showNotification} saveCallback={this.props.saveCallback} selectedPage={this.props.selectedPage} isPending = {true} invokeSaveSite={this.props.invokeSaveSite} onSaveComplete={this.props.onSaveComplete} showInsertField={this.props.showInsertField} openInsertField={this.props.openInsertField} closeInsertField={this.props.closeInsertField} />
                        }

                        {
                            this.props.displayMode !== 'default' &&
                            <span className="screenResizeIndicatorCnt">
                                <span className="shape1"></span>
                                <span className="shape2"></span>
                            </span>
                        }

                    </Resizable>
                }
            </div>
        )
    }
}
export default compose(withWidth())(BuilderContainerComponent);
/*<Frame className="iFrame" initialContent={'<!DOCTYPE html><html><head>'+document.head.innerHTML+'</head><div id="iFrameRoot"></div></body></html>'} mountTarget='#iFrameRoot'>
                            <IFrameContent pages={this.props.pages} selectedPage={this.props.selectedPage} />
                        </Frame>*/
/*<div className="builderMainContainer">
                <Grid container spacing={0}>
                    <Hidden only={['xs', 'sm']}>
                        <Grid item md={1}>
                        </Grid>
                    </Hidden>
                    <Grid item xs={12} sm={4} md={3}>
                        <Hidden only={['md', 'lg', 'xl']}>
                            <LinearProgress variant="determinate" value={1 * 100} style={{"height": "10px", "borderRadius": "5px", "marginTop": "4px"}} />
                        </Hidden>
                        <Hidden only={['xs', 'sm']}>
                            <FormSteps pages={this.props.pages} selectedPage={this.props.selectedPage} />
                        </Hidden>
                        
                    </Grid>
                    <Grid item xs={12} sm={8} md={7} className="workingArea">
                        Container
                    </Grid>
                </Grid>
            </div>*/

/*{
                    this.props.pages.length > 0 && 
                        <Frame className="iFrame" initialContent={`<!DOCTYPE html><html><head>${document.head.innerHTML}</head><div id="iFrameRoot"></div></body></html>`} mountTarget='#iFrameRoot'>
                            {this.getContainer()}
                        </Frame>
                }*/