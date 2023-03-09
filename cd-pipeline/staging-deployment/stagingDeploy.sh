#!/bin/bash

source ./cd-pipeline/utilities.sh

K8S_NONPROD_TOKEN=$(getK8sInfo "staging" "token")
K8S_NONPROD_SERVER=$(getK8sInfo "staging" "endpoint")

# Deploy the new containers
kubectl config set-credentials staging --token=$K8S_NONPROD_TOKEN
kubectl config set-cluster staging --insecure-skip-tls-verify=true --server=$K8S_NONPROD_SERVER
kubectl config set-context staging --namespace=staging --user=staging --cluster=staging
kubectl config use-context staging

kubectl apply -f ./cd-pipeline/staging-deployment/k8s/staging-deployment.yaml
return_code=$?
if [[ $return_code -ne 0 ]] ; then 
  exit $return_code;
fi

# Hacky fix for https://github.com/kubernetes/kubernetes/issues/40224
function retryableWaitForDeployment(){
	local ROLLOUT_STATUS=1
	local INTERVAL=0
	
	while [[ $ROLLOUT_STATUS -eq 1 && $INTERVAL -le 5 ]]
	do
	 ROLLOUT_MESSAGE=$(kubectl rollout status deploy/$1)
	 ROLLOUT_STATUS=$?
	 INTERVAL=$((INTERVAL + 1))
	done
	echo "Checked rollout status for $1 $INTERVAL time(s)..."
	echo $ROLLOUT_MESSAGE
	if [[ $ROLLOUT_STATUS != 0 ]]; then exit $ROLLOUT_STATUS; fi
}

echo Waiting for defi-direct-api API deploy to finish...
retryableWaitForDeployment "defi-direct-api-api-staging"