#!/bin/bash

source ./cd-pipeline/utilities.sh

# Create/update the CloudFormation stack
existing_stack=$(aws --region us-east-1 cloudformation describe-stacks --stack-name defi-apps-nonprod-db-direct-eks-endpoint-cd --output text --query 'Stacks[?StackName==`defi-apps-nonprod-db-direct-eks-endpoint-cd`].StackName' 2>&1)

if [[ $existing_stack = *"does not exist"* ]] ; then
  echo "defi-apps-nonprod-db-direct-eks-endpoint-cd does not exist, creating new stack."
	aws --region us-east-1 cloudformation create-stack --stack-name defi-apps-nonprod-db-direct-eks-endpoint-cd --template-body file://CloudFormation/direct.aurora-mysql.yml  --parameters file://CloudFormation/direct.aurora-mysql-cd-parameters.json
	aws --region us-east-1 cloudformation wait stack-create-complete --stack-name defi-apps-nonprod-db-direct-eks-endpoint-cd
else
  echo "defi-apps-nonprod-db-direct-eks-endpoint-cd already exists, updating stack."
	update_response=$(aws --region us-east-1 cloudformation update-stack --stack-name defi-apps-nonprod-db-direct-eks-endpoint-cd --template-body file://CloudFormation/direct.aurora-mysql.yml  --parameters file://CloudFormation/direct.aurora-mysql-cd-parameters.json 2>&1)
	
	echo $update_response
	
	if [[ $update_response != *"No updates are to be performed"* ]] ; then
		aws --region us-east-1 cloudformation wait stack-update-complete --stack-name defi-apps-nonprod-db-direct-eks-endpoint-cd
	fi
fi

return_code=$?
if [[ $return_code -ne 0 ]] ; then 
  exit $return_code;
fi

aws --region us-east-1 cloudformation update-termination-protection --stack-name defi-apps-nonprod-db-direct-eks-endpoint-cd --enable-termination-protection