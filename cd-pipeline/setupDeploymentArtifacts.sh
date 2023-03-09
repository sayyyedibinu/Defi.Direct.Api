#!/bin/bash

branchName=`./cd-pipeline/getBranchName.sh`

# Replace test deployment tokens
sed -i -e "s/{{BRANCH_NAME_LOWERCASE}}/$branchName/g" ./cd-pipeline/manual-deployments/k8s/test-deployment.yaml
sed -i -e "s/{{BUILD_NUMBER}}/$BUILD_NUMBER/g" ./cd-pipeline/manual-deployments/k8s/test-deployment.yaml
sed -i -e "s/{{HealthCheckOptions.Key}}/$CD_HEALTH_CHECK_KEY/g" ./cd-pipeline/manual-deployments/k8s/test-deployment.yaml

# Replace staging deployment tokens
sed -i -e "s/{{BRANCH_NAME_LOWERCASE}}/$branchName/g" ./cd-pipeline/staging-deployment/k8s/staging-deployment.yaml
sed -i -e "s/{{BUILD_NUMBER}}/$BUILD_NUMBER/g" ./cd-pipeline/staging-deployment/k8s/staging-deployment.yaml
sed -i -e "s/{{HealthCheckOptions.Key}}/$STAGING_HEALTH_CHECK_KEY/g" ./cd-pipeline/staging-deployment/k8s/staging-deployment.yaml

# Replace qa deployment tokens
sed -i -e "s/{{BRANCH_NAME_LOWERCASE}}/$branchName/g" ./cd-pipeline/qa-deployment/k8s/qa-deployment.yaml
sed -i -e "s/{{BUILD_NUMBER}}/$BUILD_NUMBER/g" ./cd-pipeline/qa-deployment/k8s/qa-deployment.yaml
sed -i -e "s/{{HealthCheckOptions.Key}}/$QA_HEALTH_CHECK_KEY/g" ./cd-pipeline/qa-deployment/k8s/qa-deployment.yaml

sed -i -e "s/{{BRANCH_NAME}}/$BRANCH_NAME/g" ./cd-pipeline/qa-deployment/qaDeploy.sh
sed -i -e "s/{{BUILD_NUMBER}}/$BUILD_NUMBER/g" ./cd-pipeline/qa-deployment/qaDeploy.sh

# Replace prod deployment tokens
sed -i -e "s/{{BRANCH_NAME_LOWERCASE}}/$branchName/g" ./cd-pipeline/prod-deployment/k8s/prod-deployment.yaml
sed -i -e "s/{{BUILD_NUMBER}}/$BUILD_NUMBER/g" ./cd-pipeline/prod-deployment/k8s/prod-deployment.yaml
sed -i -e "s/{{HealthCheckOptions.Key}}/$PROD_HEALTH_CHECK_KEY/g" ./cd-pipeline/prod-deployment/k8s/prod-deployment.yaml

sed -i -e "s/{{BRANCH_NAME}}/$BRANCH_NAME/g" ./cd-pipeline/prod-deployment/prodDeploy.sh
sed -i -e "s/{{BUILD_NUMBER}}/$BUILD_NUMBER/g" ./cd-pipeline/prod-deployment/prodDeploy.sh