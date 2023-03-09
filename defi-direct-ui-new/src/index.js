import 'core-js/es6/string';
import 'core-js/es7/array';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { unregister } from './registerServiceWorker';
import './index.css';
import ClientApp from './client/App';
import AdminApp from './admin/App';
//import 'date-input-polyfill-react';

/*This is for IE11*/
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

/*This is for IE11*/
window.CustomEvent = function(_eventName){
    var event = document.createEvent("Event");
    event.initEvent(_eventName, false, true); 
    // args: string type, boolean bubbles, boolean cancelable
    return event;
}

/*This is for IE11*/
if(Object.prototype.toString.call(Promise.prototype.finally) !== "[object Function]"){
    Promise.prototype.finally = function(_callback){
        if(Object.prototype.toString.call(_callback) === "[object Function]") _callback();
    }
}

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
    configurable: true,
    writable: true
  });
}

/*This is for IE11*/
if (!String.prototype.includes) {
  Object.defineProperty(String.prototype, 'includes', {
    value: function(search, start) {
      if (typeof start !== 'number') {
        start = 0
      }
      
      if (start + search.length > this.length) {
        return false
      } else {
        return this.indexOf(search, start) !== -1
      }
    }
  })
}

class IndexComponent extends React.Component{
    
    render(){
        return(
            <Router>
                <Switch>
                    <Route exact path="/" component={() => <Redirect to={"/admin"} />} />
                    <Route path="/admin" component={(args) => <AdminApp {...args}/>} />
                    <Route component={(args) => <ClientApp {...args}/>} />
                </Switch>
            </Router>
        )
    }
}

ReactDOM.render( <IndexComponent /> , document.getElementById('root'));

unregister();