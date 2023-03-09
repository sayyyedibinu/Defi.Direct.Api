#!/bin/bash

branchName=`./defi-direct-ui/cd-pipeline/getBranchName.sh`
echo 'Setting up deployment artifacts'
# Replace test deployment tokens
sed -i -e "s/{{BRANCH_NAME_LOWERCASE}}/$branchName/g" ./defi-direct-ui/cd-pipeline/manual-deployments/k8s/test-deployment.yaml
sed -i -e "s/{{BUILD_NUMBER}}/$BUILD_NUMBER/g" ./defi-direct-ui/cd-pipeline/manual-deployments/k8s/test-deployment.yaml
sed -i -e "s/{{HealthCheckOptions.Key}}/$CD_HEALTH_CHECK_KEY/g" ./defi-direct-ui/cd-pipeline/manual-deployments/k8s/test-deployment.yaml

# Replace staging deployment tokens
sed -i -e "s/{{BRANCH_NAME_LOWERCASE}}/$branchName/g" ./defi-direct-ui/cd-pipeline/staging-deployment/k8s/staging-deployment.yaml
sed -i -e "s/{{BUILD_NUMBER}}/$BUILD_NUMBER/g" ./defi-direct-ui/cd-pipeline/staging-deployment/k8s/staging-deployment.yaml
sed -i -e "s/{{HealthCheckOptions.Key}}/$STAGING_HEALTH_CHECK_KEY/g" ./defi-direct-ui/cd-pipeline/staging-deployment/k8s/staging-deployment.yaml

# Replace qa deployment tokens
sed -i -e "s/{{BRANCH_NAME_LOWERCASE}}/$branchName/g" ./defi-direct-ui/cd-pipeline/qa-deployment/k8s/qa-deployment.yaml
sed -i -e "s/{{BUILD_NUMBER}}/$BUILD_NUMBER/g" ./defi-direct-ui/cd-pipeline/qa-deployment/k8s/qa-deployment.yaml
sed -i -e "s/{{HealthCheckOptions.Key}}/$QA_HEALTH_CHECK_KEY/g" ./defi-direct-ui/cd-pipeline/qa-deployment/k8s/qa-deployment.yaml

sed -i -e "s/{{BRANCH_NAME}}/$BRANCH_NAME/g" ./defi-direct-ui/cd-pipeline/qa-deployment/qaDeploy.sh
sed -i -e "s/{{BUILD_NUMBER}}/$BUILD_NUMBER/g" ./defi-direct-ui/cd-pipeline/qa-deployment/qaDeploy.sh

# Replace prod deployment tokens
sed -i -e "s/{{BRANCH_NAME_LOWERCASE}}/$branchName/g" ./defi-direct-ui/cd-pipeline/prod-deployment/k8s/prod-deployment.yaml
sed -i -e "s/{{BUILD_NUMBER}}/$BUILD_NUMBER/g" ./defi-direct-ui/cd-pipeline/prod-deployment/k8s/prod-deployment.yaml
sed -i -e "s/{{HealthCheckOptions.Key}}/$PROD_HEALTH_CHECK_KEY/g" ./defi-direct-ui/cd-pipeline/prod-deployment/k8s/prod-deployment.yaml

sed -i -e "s/{{BRANCH_NAME}}/$BRANCH_NAME/g" ./defi-direct-ui/cd-pipeline/prod-deployment/prodDeploy.sh
sed -i -e "s/{{BUILD_NUMBER}}/$BUILD_NUMBER/g" ./defi-direct-ui/cd-pipeline/prod-deployment/prodDeploy.sh