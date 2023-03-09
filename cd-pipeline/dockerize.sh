#!/bin/bash
set -e
set -o pipefail
chmod 755 ./cd-pipeline/getBranchName.sh
branchName=`./cd-pipeline/getBranchName.sh`

function pushImages(){
  sudo docker push 680054776144.dkr.ecr.us-east-1.amazonaws.com/defi-apps-defidirect:$branchName-$BUILD_NUMBER.$1
  sudo docker push 680054776144.dkr.ecr.us-east-1.amazonaws.com/defi-apps-defidirect:$branchName-latest.$1

  # We keep the -latest image to take advantage of Docker layer caching (improves Docker image build times)
  sudo docker rmi 680054776144.dkr.ecr.us-east-1.amazonaws.com/defi-apps-defidirect:$branchName-$BUILD_NUMBER.$1
}

# login to ECR
sudo $(aws ecr get-login --region us-east-1 --no-include-email)

# Build and push API image
# We update the api image latest tag to be this image
sudo docker build -f Defi.Direct.Api/bin/Release/netcoreapp3.1/publish/Dockerfile.deployment -t 680054776144.dkr.ecr.us-east-1.amazonaws.com/defi-apps-defidirect:$branchName-latest.api Defi.Direct.Api/bin/Release/netcoreapp3.1/publish/.
# Tag the image with this specific build number
sudo docker build -f Defi.Direct.Api/bin/Release/netcoreapp3.1/publish/Dockerfile.deployment -t 680054776144.dkr.ecr.us-east-1.amazonaws.com/defi-apps-defidirect:$branchName-$BUILD_NUMBER.api Defi.Direct.Api/bin/Release/netcoreapp3.1/publish/.

pushImages "api"

# Build and push DatabaseMigrator image
sudo docker build -f Defi.Direct.DatabaseMigrator/bin/Release/netcoreapp3.1/publish/Dockerfile.deployment -t 680054776144.dkr.ecr.us-east-1.amazonaws.com/defi-apps-defidirect:$branchName-latest.dbmigrator Defi.Direct.DatabaseMigrator/bin/Release/netcoreapp3.1/publish/.
 
sudo docker build -f Defi.Direct.DatabaseMigrator/bin/Release/netcoreapp3.1/publish/Dockerfile.deployment -t 680054776144.dkr.ecr.us-east-1.amazonaws.com/defi-apps-defidirect:$branchName-$BUILD_NUMBER.dbmigrator Defi.Direct.DatabaseMigrator/bin/Release/netcoreapp3.1/publish/.

pushImages "dbmigrator"

# Cleanup any orphaned untagged images, don't fail script if no images found
sudo docker rmi $(sudo docker images -q --filter "dangling=true") || true