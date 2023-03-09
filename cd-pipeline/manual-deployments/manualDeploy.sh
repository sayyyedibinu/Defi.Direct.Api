#!/bin/bash

source ./cd-pipeline/utilities.sh

K8S_NONPROD_TOKEN=$(getK8sInfo "test" "token")
K8S_NONPROD_SERVER=$(getK8sInfo "test" "endpoint")

echo "DropDatabase = $DROP_DATABASE" 

sed -i -e "s/{{TEST_ENVIRONMENT_NAME}}/$TEST_ENVIRONMENT_NAME/g" ./cd-pipeline/manual-deployments/k8s/test-deployment.yaml
sed -i -e "s/{{DROP_DATABASE}}/$DROP_DATABASE/g" ./cd-pipeline/manual-deployments/k8s/test-deployment.yaml

kubectl config set-credentials test --token=$K8S_NONPROD_TOKEN
kubectl config set-cluster test --insecure-skip-tls-verify=true --server=$K8S_NONPROD_SERVER
kubectl config set-context test --namespace=test --user=test --cluster=test
kubectl config use-context test

kubectl apply -f ./cd-pipeline/manual-deployments/k8s/test-deployment.yaml
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

echo Waiting for  defi-direct-api API deploy to finish...
retryableWaitForDeployment "defi-direct-api-api-$TEST_ENVIRONMENT_NAME"