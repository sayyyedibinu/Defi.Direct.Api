#!/bin/bash

source ./cd-pipeline/utilities.sh

K8S_PROD_TOKEN=$(getK8sInfo "prod" "token")
K8S_PROD_SERVER=$(getK8sInfo "prod" "endpoint")

kubectl config set-credentials prod --token=$K8S_PROD_TOKEN
kubectl config set-cluster prod --insecure-skip-tls-verify=true --server=$K8S_PROD_SERVER
kubectl config set-context prod --namespace=prod --user=prod --cluster=prod
kubectl config use-context prod

kubectl apply -f ./defi-direct-ui/cd-pipeline/prod-deployment/k8s/prod-deployment.yaml
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

echo Waiting for defi-directui-prod API deploy to finish...
retryableWaitForDeployment "defi-directui-prod"