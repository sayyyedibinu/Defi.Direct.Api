#!/bin/bash

source ./cd-pipeline/utilities.sh

branchName=`./defi-direct-ui/cd-pipeline/getBranchName.sh`
K8S_NONPROD_TOKEN=$(getK8sInfo "cd" "token")
K8S_NONPROD_SERVER=$(getK8sInfo "cd" "endpoint")

sed -i -e "s/{{BRANCH_NAME_LOWERCASE}}/$branchName/g" ./defi-direct-ui/cd-pipeline/k8s/cd-deployment.yaml
sed -i -e "s/{{BUILD_NUMBER}}/$BUILD_NUMBER/g" ./defi-direct-ui/cd-pipeline/k8s/cd-deployment.yaml
sed -i -e "s/{{HealthCheckOptions.Key}}/$CD_HEALTH_CHECK_KEY/g" ./defi-direct-ui/cd-pipeline/k8s/cd-deployment.yaml

# Tell `kubectl` what cluster to use
kubectl config set-credentials cd --token=$K8S_NONPROD_TOKEN
kubectl config set-cluster cd --insecure-skip-tls-verify=true --server=$K8S_NONPROD_SERVER
kubectl config set-context cd --namespace=cd --user=cd --cluster=cd
kubectl config use-context cd

# Create the services and deployments
kubectl create -f ./defi-direct-ui/cd-pipeline/k8s/cd-deployment.yaml
return_code=$?
if [[ $return_code -ne 0 ]] ; then 
  exit $return_code;
fi

# Hacky fix for https://github.com/kubernetes/kubernetes/issues/40224
function retryableWaitForDeployment(){
  local ROLLOUT_STATUS=1
  local INTERVAL=0
  
  while [[ $ROLLOUT_STATUS -eq 1 && $INTERVAL -le 15 ]]
  do
   ROLLOUT_MESSAGE=$(kubectl rollout status deploy/$1 --namespace=cd)
   ROLLOUT_STATUS=$?
   INTERVAL=$((INTERVAL + 1))
  done
  echo "Checked rollout status for $1 $INTERVAL time(s)..."
  echo $ROLLOUT_MESSAGE
  if [[ $ROLLOUT_STATUS != 0 ]]; then exit $ROLLOUT_STATUS; fi
}

echo Waiting for API deploy to finish...
retryableWaitForDeployment "defi-directui-$branchName-$BUILD_NUMBER"