#!/bin/bash
set -e
set -o pipefail
chmod 755 ./defi-direct-ui/cd-pipeline/getBranchName.sh
branchName=`./defi-direct-ui/cd-pipeline/getBranchName.sh`

function pushImages(){
  sudo docker push 680054776144.dkr.ecr.us-east-1.amazonaws.com/defi-apps-directui:$branchName-$BUILD_NUMBER.$1
  sudo docker push 680054776144.dkr.ecr.us-east-1.amazonaws.com/defi-apps-directui:$branchName-latest.$1

  # We keep the -latest image to take advantage of Docker layer caching (improves Docker image build times)
  sudo docker rmi 680054776144.dkr.ecr.us-east-1.amazonaws.com/defi-apps-directui:$branchName-$BUILD_NUMBER.$1
}

# login to ECR
sudo $(aws ecr get-login --region us-east-1 --no-include-email)
echo 'Docker build'
# Build and push API image
# We update the api image latest tag to be this image
sudo docker build -f defi-direct-ui/cd-pipeline/Dockerfile.deployment -t 680054776144.dkr.ecr.us-east-1.amazonaws.com/defi-apps-directui:$branchName-latest.ui .
# Tag the image with this specific build number
sudo docker build -f defi-direct-ui/cd-pipeline/Dockerfile.deployment -t 680054776144.dkr.ecr.us-east-1.amazonaws.com/defi-apps-directui:$branchName-$BUILD_NUMBER.ui .
echo 'pushImages'
pushImages "ui"
echo 'docker rmi'
# Cleanup any orphaned untagged images, don't fail script if no images found
sudo docker rmi $(sudo docker images -q --filter "dangling=true") || true