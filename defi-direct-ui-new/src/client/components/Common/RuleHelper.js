let operatorMapping = {
    "isEmpty": "=== ''",
    "isNotEmpty": "!== ''",
    "isActive": "=== 'Active'",
    "isInActive": "!== 'Active'",
    "equalto": "===",
    "notEqualTo": "!==",
    "isGreaterThan": ">",
    "isgreaterThanOrEqualTo": ">=",
    "isLessThan": "<",
    "isLessThanOrEqualTo": "<=",
    "AND": "&&",
    "OR": "||",
    "": ""
};

let getConditionalMandatory = (_obj, _dataSet) => {
    let ruleString = "";
    let groupCount = 0;
    
    let recursion = (type, _obj) => {
        if(groupCount > 0) ruleString += operatorMapping[_obj.ruleGroupOperator];
        groupCount = groupCount + 1;

        for(let j = 0; j < _obj.criteria.length; j++){
            if(Object.prototype.toString.call(_obj.criteria[j].subGroup) !== "[object Array]") _obj.criteria[j].subGroup = [];
            if(j > 0) ruleString += operatorMapping[_obj.ruleGroupOperator];
            if(_obj.criteria[j].c1 !== "Select Criteria Field"){
                ruleString += " (";
                ruleString += (_dataSet[_obj.criteria[j].c1] === "" ? ((_obj.criteria[j].c2 === "isEmpty" || _obj.criteria[j].c2 === "isNotEmpty") ? "''" : undefined) : (Object.prototype.toString.call(_dataSet[_obj.criteria[j].c1]) === "[object String]"? "'"+_dataSet[_obj.criteria[j].c1]+"'" : _dataSet[_obj.criteria[j].c1]));
                ruleString += operatorMapping[_obj.criteria[j].c2];

                if(_obj.criteria[j].c2 !== "isEmpty" && _obj.criteria[j].c2 !== "isNotEmpty" && _obj.criteria[j].c2 !== "isActive" && _obj.criteria[j].c2 !== "isInActive"){
                    if(_obj.criteria[j].c3Details === 'field')
                        ruleString += (_dataSet[_obj.criteria[j].c3] === "" ? undefined : (Object.prototype.toString.call(_dataSet[_obj.criteria[j].c3]) === "[object String]"? "'"+_dataSet[_obj.criteria[j].c3]+"'" : _dataSet[_obj.criteria[j].c3]));
                    else if(_obj.criteria[j].c3Details === 'static')
                        ruleString += _obj.criteria[j].c3;
                    else
                        ruleString += (Object.prototype.toString.call(_obj.criteria[j].c3) !== "[object Boolean]"? "'"+_obj.criteria[j].c3+"'" : _obj.criteria[j].c3) ;
                }
                ruleString += ") ";

                /*if(_obj.criteria[j].subGroup.length > 0) ruleString += operatorMapping[_obj.criteria[j].subGroup[0].ruleGroupOperator];*/
            }
            /*if(_obj.criteria[j].subGroup.length > 0){
                ruleString += " (";
                groupCount = 0;
            }
            for(let k = 0; k < _obj.criteria[j].subGroup.length; k++){
                recursion('subgroup', _obj.criteria[j].subGroup[k]);
            }
            if(_obj.criteria[j].subGroup.length > 0) ruleString += ") ";*/
        }
    };
    
    if (_obj.isRequired === false) {
        return false;
    }else{
        if (Object.prototype.toString.call(_obj.isRequiredRule) === "[object Undefined]") {
            return true;
        }
        if (_obj.isRequiredRule === "null" || _obj.isRequiredRule === "") {
            return true;
        } else {
            try{
                let rule = [];
                if(Object.prototype.toString.call(_obj.isRequiredRuleDesc) === "[object String]")
                    rule = JSON.parse(_obj.isRequiredRuleDesc);
                else rule = _obj.isRequiredRuleDesc;
                //console.log(rule);
                
                for(let i = 0; i < rule.length; i++){
                    if(i > 0) ruleString += operatorMapping[rule[i].operator];
                    groupCount = 0;
                    ruleString += " (";
                    recursion('group', rule[i]);
                    ruleString += ") ";
                }
                
                try {
//                    console.log(ruleString);
                    return eval(ruleString);
                } catch (e) {
                    return false;
                }
                
            }catch(e){
                console.warn(e);
                return true;
            }
        }
    }
    return true;
}

let getConditionalDisplay = (_obj, _dataSet) => {
    let ruleString = "";
    let groupCount = 0;
    
    let recursion = (type, _obj) => {
        if(groupCount > 0) ruleString += operatorMapping[_obj.ruleGroupOperator];
        groupCount = groupCount + 1;

        for(let j = 0; j < _obj.criteria.length; j++){
            /*if(Object.prototype.toString.call(_obj.criteria[j].subGroup) !== "[object Array]") _obj.criteria[j].subGroup = [];*/
            if(j > 0) ruleString += operatorMapping[_obj.ruleGroupOperator];
            if(_obj.criteria[j].c1 !== "Select Criteria Field"){
                ruleString += " (";
                ruleString += (_dataSet[_obj.criteria[j].c1] === "" ? ((_obj.criteria[j].c2 === "isEmpty" || _obj.criteria[j].c2 === "isNotEmpty")? "''" : undefined) : (Object.prototype.toString.call(_dataSet[_obj.criteria[j].c1]) === "[object String]"? "'"+_dataSet[_obj.criteria[j].c1]+"'" : _dataSet[_obj.criteria[j].c1]));
                ruleString += operatorMapping[_obj.criteria[j].c2];
                if(_obj.criteria[j].c2 !== "isEmpty" && _obj.criteria[j].c2 !== "isNotEmpty" && _obj.criteria[j].c2 !== "isActive" && _obj.criteria[j].c2 !== "isInActive"){
                    if(_obj.criteria[j].c3Details === 'field')
                        ruleString += (_dataSet[_obj.criteria[j].c3] === "" ? undefined : (Object.prototype.toString.call(_dataSet[_obj.criteria[j].c3]) === "[object String]"? "'"+_dataSet[_obj.criteria[j].c3]+"'" : _dataSet[_obj.criteria[j].c3]));
                    else if(_obj.criteria[j].c3Details === 'static')
                        ruleString += _obj.criteria[j].c3;
                    else
                        ruleString += (Object.prototype.toString.call(_obj.criteria[j].c3) !== "[object Boolean]"? "'"+_obj.criteria[j].c3+"'" : _obj.criteria[j].c3)
                }
                ruleString += ") ";

                /*if(_obj.criteria[j].subGroup.length > 0) ruleString += operatorMapping[_obj.criteria[j].subGroup[0].ruleGroupOperator];*/
            }
            /*if(_obj.criteria[j].subGroup.length > 0){
                ruleString += " (";
                groupCount = 0;
            }
            for(let k = 0; k < _obj.criteria[j].subGroup.length; k++){
                recursion('subgroup', _obj.criteria[j].subGroup[k]);
            }
            if(_obj.criteria[j].subGroup.length > 0) ruleString += ") ";*/
        }
    };
    
    if (_obj.displayLogic === false) {
        return false;
    }else{
        if (Object.prototype.toString.call(_obj.displayLogicRule) === "[object Undefined]") {
            return true;
        }
        if (_obj.displayLogicRule === "null" || _obj.displayLogicRule === "") {
            return true;
        } else {
            try{
                let rule = [];
                if(Object.prototype.toString.call(_obj.displayLogicRuleDesc) === "[object String]")
                    rule = JSON.parse(_obj.displayLogicRuleDesc);
                else rule = _obj.displayLogicRuleDesc;
                /*console.log(rule);*/
                
                for(let i = 0; i < rule.length; i++){
                    if(i > 0) ruleString += operatorMapping[rule[i].operator];
                    groupCount = 0;
                    ruleString += " (";
                    recursion('group', rule[i]);
                    ruleString += ") ";
                }
                try {
 //                   console.log(ruleString);
                    return eval(ruleString);
                } catch (e) {
                    return false;
                }
                
            }catch(e){
                console.warn(e);
                return true;
            }
        }
    }
    return true;
}

let getConditionalDecisionDisplay = (_obj, _dataSet) => {
    let ruleString = "";
    let groupCount = 0;
    
    let recursion = (type, _obj) => {
        if(groupCount > 0) ruleString += operatorMapping[_obj.ruleGroupOperator];
        groupCount = groupCount + 1;

        for(let j = 0; j < _obj.criteria.length; j++){
            /*if(Object.prototype.toString.call(_obj.criteria[j].subGroup) !== "[object Array]") _obj.criteria[j].subGroup = [];*/
            if(j > 0) ruleString += operatorMapping[_obj.ruleGroupOperator];
            if(_obj.criteria[j].c1 !== "Select Criteria Field"){
                ruleString += " (";
                if(_obj.criteria[j].c1.indexOf('.') == 0)
                {                
                    ruleString += "_dataSet" + _obj.criteria[j].c1;
                }else{                
                        for(let i = 0; i < _dataSet.decisionPageFieldData.fields.length; i++){

                        if(_dataSet.decisionPageFieldData.fields[i].id==_obj.criteria[j].c1)
                        {
                            ruleString+= "'"+_dataSet.decisionPageFieldData.fields[i].currentValue+ "'";
                            break;
                        }
                    }                                       
                }   
                
                ruleString += operatorMapping[_obj.criteria[j].c2];

                if(_obj.criteria[j].c2 !== "isEmpty" && _obj.criteria[j].c2 !== "isNotEmpty" && _obj.criteria[j].c2 !== "isActive" && _obj.criteria[j].c2 !== "isInActive"){
                    if(_obj.criteria[j].c3Details === 'field')
                        ruleString += "_dataSet" + _obj.criteria[j].c3;
                    else if(_obj.criteria[j].c3Details === 'static')
                        ruleString += _obj.criteria[j].c3;
                    else
                        ruleString += "'"+_obj.criteria[j].c3+"'";
                }
                ruleString += ") ";

                /*if(_obj.criteria[j].subGroup.length > 0) ruleString += operatorMapping[_obj.criteria[j].subGroup[0].ruleGroupOperator];*/
            }
            /*if(_obj.criteria[j].subGroup.length > 0){
                ruleString += " (";
                groupCount = 0;
            }
            for(let k = 0; k < _obj.criteria[j].subGroup.length; k++){
                recursion('subgroup', _obj.criteria[j].subGroup[k]);
            }
            if(_obj.criteria[j].subGroup.length > 0) ruleString += ") ";*/
        }
    };
    
    if (_obj.displayLogic === false) {
        return false;
    }else{
        if (Object.prototype.toString.call(_obj.displayLogicRule) === "[object Undefined]") {
            return true;
        }
        if (_obj.displayLogicRule === "null" || _obj.displayLogicRule === "") {
            return true;
        } else {
            try{
                /*console.log(_obj.displayLogicRuleDesc);*/
                let rule = [];
                if(Object.prototype.toString.call(_obj.displayLogicRuleDesc) === "[object String]")
                    rule = JSON.parse(_obj.displayLogicRuleDesc);
                else rule = _obj.displayLogicRuleDesc;
                /*console.log(rule);*/
                
                for(let i = 0; i < rule.length; i++){
                    if(i > 0) ruleString += operatorMapping[rule[i].operator];
                    groupCount = 0;
                    ruleString += " (";
                    recursion('group', rule[i]);
                    ruleString += ") ";
                }
                
                try {
                    /*console.log(_dataSet, ruleString);*/
                    return eval(ruleString);
                } catch (e) {
                    return false;
                }
                
            }catch(e){
                console.warn(e);
                return true;
            }
        }
    }
    return true;
}

/*let getConditionalDisplay = (_obj, _dataSet) => {
    if (_obj.displayLogic === false) {
        return false;
    } else {
        if (Object.prototype.toString.call(_obj.displayLogicRule) === "[object Undefined]") {
            return true;
        }
        if (_obj.displayLogicRule === "null" || _obj.displayLogicRule === "") {
            return true;
        } else {
            try {
                let rule = JSON.parse(_obj.displayLogicRuleDesc);
                let ruleString = "";

                for (let i = 0; i < rule.length; i++) {

                    if (i > 0) ruleString += operatorMapping[rule[i].operator];

                    ruleString += "(";

                    for (let j = 0; j < rule[i].criteria.length; j++) {
                        if (j > 0) ruleString += operatorMapping[rule[i].ruleGroupOperator];

                        if (rule[i].criteria[j].c1 !== "Select Criteria Field") {
                            ruleString += "(";
                            ruleString += "'" + _dataSet[rule[i].criteria[j].c1] + "'";
                            ruleString += operatorMapping[rule[i].criteria[j].c2];

                            if (rule[i].criteria[j].c2 !== "isEmpty" && rule[i].criteria[j].c2 !== "isNotEmpty" && rule[i].criteria[j].c2 !== "isActive" && rule[i].criteria[j].c2 !== "isInActive") {
                                if (rule[i].criteria[j].c3Details === 'field')
                                    ruleString += "'" + _dataSet[rule[i].criteria[j].c3] + "'";
                                else if (rule[i].criteria[j].c3Details === 'static')
                                    ruleString += rule[i].criteria[j].c3;
                                else
                                    ruleString += "'" + rule[i].criteria[j].c3 + "'";
                            }
                            if(rule[i].criteria[j].c1) 
                            ruleString += ")";
                        }
                    }

                    ruleString += ")";
                }

                try {
                    return eval(ruleString);
                } catch (e) {
                    return false;
                }

            } catch (e) {
                console.error(e);
                return true;
            }
        }
    }
    return true;
}*/

/*let getConditionalDecisionDisplay = (_obj, _dataSet) => {
    if (_obj.displayLogic === false) {
        return false;
    } else {
        if (Object.prototype.toString.call(_obj.displayLogicRule) === "[object Undefined]") {
            return true;
        }
        if (_obj.displayLogicRule === "null" || _obj.displayLogicRule === "") {
            return true;
        } else {
            try {
                let rule = JSON.parse(_obj.displayLogicRuleDesc);
                let ruleString = "";

                for (let i = 0; i < rule.length; i++) {

                    if (i > 0) ruleString += operatorMapping[rule[i].operator];

                    ruleString += "(";

                    for (let j = 0; j < rule[i].criteria.length; j++) {
                        if (j > 0) ruleString += operatorMapping[rule[i].ruleGroupOperator];

                        if (rule[i].criteria[j].c1 !== "Select Criteria Field") {
                            ruleString += "(";
                            ruleString += "_dataSet" + rule[i].criteria[j].c1;
                            ruleString += operatorMapping[rule[i].criteria[j].c2];

                            if (rule[i].criteria[j].c2 !== "isEmpty" && rule[i].criteria[j].c2 !== "isNotEmpty" && rule[i].criteria[j].c2 !== "isActive" && rule[i].criteria[j].c2 !== "isInActive") {
                                if (rule[i].criteria[j].c3Details === 'field')
                                    ruleString += "_dataSet" + rule[i].criteria[j].c3;
                                else if (rule[i].criteria[j].c3Details === 'static')
                                    ruleString += rule[i].criteria[j].c3;
                                else
                                    ruleString += "'" + rule[i].criteria[j].c3 + "'";
                            }
                            if(rule[i].criteria[j].c1) 
                            ruleString += ")";
                        }
                    }

                    ruleString += ")";
                }

                try {
                    console.log(_dataSet);
                    console.log(eval(ruleString));
                    return eval(ruleString);
                } catch (e) {
                    return false;
                }

            } catch (e) {
                console.error(e);
                return true;
            }
        }
    }
    return true;
}*/
export default {
    operatorMapping: operatorMapping,
    getConditionalMandatory: getConditionalMandatory,
    getConditionalDisplay: getConditionalDisplay,
    getConditionalDecisionDisplay: getConditionalDecisionDisplay
}
