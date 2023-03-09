#!/bin/bash

# TODO: Change the all the stack name references in this file!!!

# First check the syntax of the template
aws --region us-east-1 cloudformation validate-template --template-body file://CloudFormation/defidirect-ecr.yml
return_code=$?
if [[ $return_code -ne 0 ]] ; then 
  exit $return_code;
fi

# Check if there's an existing ECR repository stack
existing_stack=$(aws --region us-east-1 cloudformation describe-stacks --stack-name defi-apps-nonprod-direct-api-ecr --output text --query 'Stacks[?StackName==`defi-apps-nonprod-direct-api-ecr`].StackName' 2>&1)
echo $existing_stack
if [[ $existing_stack = *"does not exist"* ]] ; then
  echo "defi-apps-nonprod-direct-api-ecr does not exist, creating new stack."
	aws --region us-east-1 cloudformation create-stack --stack-name defi-apps-nonprod-direct-api-ecr --template-body file://CloudFormation/defidirect-ecr.yml --stack-policy-body file://CloudFormation/defidirect-ecr-stack-policy.json
	aws --region us-east-1 cloudformation wait stack-create-complete --stack-name defi-apps-nonprod-direct-api-ecr
else
  echo "defi-apps-nonprod-direct-api-ecr already exists, updating stack."
	update_response=$(aws --region us-east-1 cloudformation update-stack --stack-name defi-apps-nonprod-direct-api-ecr --template-body file://CloudFormation/defidirect-ecr.yml --stack-policy-body file://CloudFormation/defidirect-ecr-stack-policy.json 2>&1)

	if [[ $update_response != *"No updates are to be performed"* ]] ; then
		aws --region us-east-1 cloudformation wait stack-update-complete --stack-name defi-apps-nonprod-direct-api-ecr
	fi
fi
return_code=$?
if [[ $return_code -ne 0 ]] ; then 
  exit $return_code;
fi

aws --region us-east-1 cloudformation update-termination-protection --stack-name defi-apps-nonprod-direct-api-ecr --enable-termination-protection
return_code=$?
if [[ $return_code -ne 0 ]] ; then 
  exit $return_code;
fi