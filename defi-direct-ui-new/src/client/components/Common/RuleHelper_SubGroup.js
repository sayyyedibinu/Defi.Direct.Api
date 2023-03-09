var _tempVar = [
    {
        operator: "AND",
        ruleGroupOperator: "AND",
        criteria: [
            {
                c1: "Select Criteria Field1",
                c2: "equalto",
                c3: "Select Criteria Field1",
                c3Details: "field",
                subGroup: [
                    {
                        operator: "AND",
                        ruleGroupOperator: "OR",
                        criteria: [
                            {
                                c1: "Select Criteria Field2",
                                c2: "equalto",
                                c3: "Select Criteria Field2",
                                c3Details: "field",
                                subGroup: [
                                    {
                                        operator: "AND",
                                        ruleGroupOperator: "AND",
                                        criteria: [
                                            {
                                                c1: "Select Criteria Field3",
                                                c2: "equalto",
                                                c3: "Select Criteria Field3",
                                                c3Details: "field",
                                                subGroup: [
                                                    
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },{
                c1: "Select Criteria Field1",
                c2: "equalto",
                c3: "Select Criteria Field1",
                c3Details: "field",
                subGroup: [
                    {
                        operator: "AND",
                        ruleGroupOperator: "OR",
                        criteria: [
                            {
                                c1: "Select Criteria Field2",
                                c2: "equalto",
                                c3: "Select Criteria Field2",
                                c3Details: "field",
                                subGroup: [
                                    {
                                        operator: "AND",
                                        ruleGroupOperator: "AND",
                                        criteria: [
                                            {
                                                c1: "Select Criteria Field3",
                                                c2: "equalto",
                                                c3: "Select Criteria Field3",
                                                c3Details: "field",
                                                subGroup: [
                                                    
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },{
        operator: "AND",
        ruleGroupOperator: "AND",
        criteria: [
            {
                c1: "Select Criteria Field1",
                c2: "equalto",
                c3: "Select Criteria Field1",
                c3Details: "field",
                subGroup: [
                    {
                        operator: "AND",
                        ruleGroupOperator: "OR",
                        criteria: [
                            {
                                c1: "Select Criteria Field2",
                                c2: "equalto",
                                c3: "Select Criteria Field2",
                                c3Details: "field",
                                subGroup: [
                                    {
                                        operator: "AND",
                                        ruleGroupOperator: "AND",
                                        criteria: [
                                            {
                                                c1: "Select Criteria Field3",
                                                c2: "equalto",
                                                c3: "Select Criteria Field3",
                                                c3Details: "field",
                                                subGroup: [
                                                    
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },{
                c1: "Select Criteria Field1",
                c2: "equalto",
                c3: "Select Criteria Field1",
                c3Details: "field",
                subGroup: [
                    {
                        operator: "AND",
                        ruleGroupOperator: "OR",
                        criteria: [
                            {
                                c1: "Select Criteria Field2",
                                c2: "equalto",
                                c3: "Select Criteria Field2",
                                c3Details: "field",
                                subGroup: [
                                    {
                                        operator: "AND",
                                        ruleGroupOperator: "AND",
                                        criteria: [
                                            {
                                                c1: "Select Criteria Field3",
                                                c2: "equalto",
                                                c3: "Select Criteria Field3",
                                                c3Details: "field",
                                                subGroup: [
                                                    
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
]

var operatorMapping = {
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
    "": "",
    "IF": ""
};
var ruleString = "";
var groupCount = 0;
var _dataSet = {};
function recursion(type, _obj){
    if(groupCount > 0) ruleString += operatorMapping[_obj.ruleGroupOperator];
    groupCount = groupCount + 1;
    
    for(let j = 0; j < _obj.criteria.length; j++){
        if(j > 0) ruleString += operatorMapping[_obj.ruleGroupOperator];
        if(_obj.criteria[j].c1 !== "Select Criteria Field"){
            ruleString += " (";
            ruleString += "'"+_obj.criteria[j].c1+"'";
            ruleString += operatorMapping[_obj.criteria[j].c2];

            if(_obj.criteria[j].c2 !== "isEmpty" && _obj.criteria[j].c2 !== "isNotEmpty" && _obj.criteria[j].c2 !== "isActive" && _obj.criteria[j].c2 !== "isInActive"){
                if(_obj.criteria[j].c3Details === 'field')
                    ruleString += "'"+_obj.criteria[j].c3+"'";
                else if(_obj.criteria[j].c3Details === 'static')
                    ruleString += _obj.criteria[j].c3;
                else
                    ruleString += "'"+_obj.criteria[j].c3+"'";
            }
            ruleString += ") ";
            
            if(_obj.criteria[j].subGroup.length > 0) ruleString += operatorMapping[_obj.ruleGroupOperator];
        }
        if(_obj.criteria[j].subGroup.length > 0){
            ruleString += " (";
            groupCount = 0;
        }
        for(let k = 0; k < _obj.criteria[j].subGroup.length; k++){
            recursion('subgroup', _obj.criteria[j].subGroup[k]);
        }
        if(_obj.criteria[j].subGroup.length > 0) ruleString += ") ";
    }
    
}

for(let i = 0; i < _tempVar.length; i++){
    if(i > 0) ruleString += operatorMapping[_tempVar[i].operator];
    groupCount = 0;
    ruleString += " (";
    recursion('group', _tempVar[i]);
    ruleString += ") ";
}
