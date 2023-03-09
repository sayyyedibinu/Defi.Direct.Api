#!/bin/bash

source ./cd-pipeline/utilities.sh

npm install

K8S_NONPROD_TOKEN=$(getK8sInfo "qa" "token")
K8S_NONPROD_SERVER=$(getK8sInfo "qa" "endpoint")

# Build the ingress based on clients in database
# echo Building clients yaml...
# node ./defi-direct-ui/cd-pipeline/qa-deployment/qa-hosts-builder.js

echo Applying clients yaml...
kubectl config set-credentials qa --token=$K8S_NONPROD_TOKEN
kubectl config set-cluster qa --insecure-skip-tls-verify=true --server=$K8S_NONPROD_SERVER
kubectl config set-context qa --namespace=qa --user=qa --cluster=qa
kubectl config use-context qa

kubectl apply -f ./defi-direct-ui/cd-pipeline/qa-deployment/k8s/qa-deployment.ingress.yaml
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

echo Waiting for defi-directui-qa API deploy to finish...
retryableWaitForDeployment "defi-directui-qa"