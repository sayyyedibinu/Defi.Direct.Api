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
        /*console.log(_obj);
        console.log(_obj.isRequired);*/
        
        if(_obj.isRequired === false){
            return false;
        }else{
            if(Object.prototype.toString.call(_obj.isRequiredRule) === "[object Undefined]"){
                return true;
            }
            if(_obj.isRequiredRule === "null" || _obj.isRequiredRule === ""){
                return true;
            }else{
                try{
                    let rule = JSON.parse(_obj.isRequiredRuleDesc);
                    let ruleString = "";
                    
                    for(let i = 0; i < rule.length; i++){
                        
                        if(i > 0) ruleString += operatorMapping[rule[i].operator];
                        
                        ruleString += "(";
                        
                        for(let j = 0; j < rule[i].criteria.length; j++){
                            if(j > 0) ruleString += operatorMapping[rule[i].ruleGroupOperator];
                            
                            if(rule[i].criteria[j].c1 !== "Select Criteria Field"){
                                ruleString += "(";
                                ruleString += "'"+_dataSet[rule[i].criteria[j].c1]+"'";
                                ruleString += operatorMapping[rule[i].criteria[j].c2];
                                
                                if(rule[i].criteria[j].c2 !== "isEmpty" && rule[i].criteria[j].c2 !== "isNotEmpty" && rule[i].criteria[j].c2 !== "isActive" && rule[i].criteria[j].c2 !== "isInActive"){
                                    if(rule[i].criteria[j].c3Details === 'field')
                                        ruleString += "'"+_dataSet[rule[i].criteria[j].c3]+"'";
                                    else if(rule[i].criteria[j].c3Details === 'static')
                                        ruleString += rule[i].criteria[j].c3;
                                    else
                                        ruleString += "'"+rule[i].criteria[j].c3+"'";
                                }
                                /*if(rule[i].criteria[j].c1) */ruleString += ")";
                            }
                        }
                        
                        ruleString += ")";
                    }
                    
                    try{
                        return eval(ruleString);
                    }catch(e){
                        return false;
                    }
                    
                }catch(e){
                    console.error(e);
                    return true;
                }
            }
        }
        return true;
    }

let getConditionalDisplay = (_obj, _dataSet) => {
        if(_obj.displayLogic === false){
            return false;
        }else{
            if(Object.prototype.toString.call(_obj.displayLogicRule) === "[object Undefined]"){
                return true;
            }
            if(_obj.displayLogicRule === "null" || _obj.displayLogicRule === ""){
                return true;
            }else{
                try{
                    let rule = JSON.parse(_obj.displayLogicRuleDesc);
                    let ruleString = "";
                    
                    for(let i = 0; i < rule.length; i++){
                        
                        if(i > 0) ruleString += operatorMapping[rule[i].operator];
                        
                        ruleString += "(";
                        
                        for(let j = 0; j < rule[i].criteria.length; j++){
                            if(j > 0) ruleString += operatorMapping[rule[i].ruleGroupOperator];
                            
                            if(rule[i].criteria[j].c1 !== "Select Criteria Field"){
                                ruleString += "(";
                                ruleString += "'"+_dataSet[rule[i].criteria[j].c1]+"'";
                                ruleString += operatorMapping[rule[i].criteria[j].c2];
                                
                                if(rule[i].criteria[j].c2 !== "isEmpty" && rule[i].criteria[j].c2 !== "isNotEmpty" && rule[i].criteria[j].c2 !== "isActive" && rule[i].criteria[j].c2 !== "isInActive"){
                                    if(rule[i].criteria[j].c3Details === 'field')
                                        ruleString += "'"+_dataSet[rule[i].criteria[j].c3]+"'";
                                    else if(rule[i].criteria[j].c3Details === 'static')
                                        ruleString += rule[i].criteria[j].c3;
                                    else
                                        ruleString += "'"+rule[i].criteria[j].c3+"'";
                                }
                                /*if(rule[i].criteria[j].c1) */ruleString += ")";
                            }
                        }
                        
                        ruleString += ")";
                    }
                    
                    try{
                        return eval(ruleString);
                    }catch(e){
                        return false;
                    }
                    
                }catch(e){
                    console.error(e);
                    return true;
                }
            }
        }
        return true;
    }

let getConditionalDecisionDisplay = (_obj, _dataSet) => {
        if(_obj.displayLogic === false){
            return false;
        }else{
            if(Object.prototype.toString.call(_obj.displayLogicRule) === "[object Undefined]"){
                return true;
            }
            if(_obj.displayLogicRule === "null" || _obj.displayLogicRule === ""){
                return true;
            }else{
                try{
                    let rule = JSON.parse(_obj.displayLogicRuleDesc);
                    let ruleString = "";
                    
                    for(let i = 0; i < rule.length; i++){
                        
                        if(i > 0) ruleString += operatorMapping[rule[i].operator];
                        
                        ruleString += "(";
                        
                        for(let j = 0; j < rule[i].criteria.length; j++){
                            if(j > 0) ruleString += operatorMapping[rule[i].ruleGroupOperator];
                            
                            if(rule[i].criteria[j].c1 !== "Select Criteria Field"){
                                ruleString += "(";
                                ruleString += "_dataSet"+rule[i].criteria[j].c1;
                                ruleString += operatorMapping[rule[i].criteria[j].c2];
                                
                                if(rule[i].criteria[j].c2 !== "isEmpty" && rule[i].criteria[j].c2 !== "isNotEmpty" && rule[i].criteria[j].c2 !== "isActive" && rule[i].criteria[j].c2 !== "isInActive"){
                                    if(rule[i].criteria[j].c3Details === 'field')
                                        ruleString += "_dataSet"+rule[i].criteria[j].c3;
                                    else if(rule[i].criteria[j].c3Details === 'static')
                                        ruleString += rule[i].criteria[j].c3;
                                    else
                                        ruleString += "'"+rule[i].criteria[j].c3+"'";
                                }
                                /*if(rule[i].criteria[j].c1) */ruleString += ")";
                            }
                        }
                        
                        ruleString += ")";
                    }
                    
                    try{
                        console.log(_dataSet);
                        console.log(eval(ruleString));
                        return eval(ruleString);
                    }catch(e){
                        return false;
                    }
                    
                }catch(e){
                    console.error(e);
                    return true;
                }
            }
        }
        return true;
    }
export default {
    operatorMapping: operatorMapping,
    getConditionalMandatory: getConditionalMandatory,
    getConditionalDisplay: getConditionalDisplay,
    getConditionalDecisionDisplay: getConditionalDecisionDisplay
}