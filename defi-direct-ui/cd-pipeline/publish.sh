#!/bin/bash
set -e
set -o pipefail

function replaceWithEnvironmentTokens(){
    username=$2_LOGIN_USERNAME
    organization=$2_LOGIN_ORGANIZATION
    password=$2_LOGIN_PASSWORD
    apikey=$2_HEALTH_CHECK_KEY

    sed -i -e "s/{{eOriginalCredentials.loginUsername}}/${!username}/g" $1
    sed -i -e "s/{{eOriginalCredentials.loginOrganization}}/${!organization}/g" $1
    sed -i -e "s/{{eOriginalCredentials.loginPassword}}/${!password}/g" $1
    sed -i -e "s/{{HealthCheckOptions.Key}}/${!apikey}/g" $1
}

function createEnvironmentSpecificAppSettingsFile(){
    cp $1 $2
        replaceWithEnvironmentTokens $2 $3
}

cd defi-direct-ui
echo 'yarn run build'
yarn run build

# createEnvironmentSpecificAppSettingsFile Defi.Direct.Api/appsettings.json Defi.Direct.Api/bin/Release/netcoreapp2.0/publish/appsettings.Cd.json "CD"
# createEnvironmentSpecificAppSettingsFile Defi.Direct.Api/appsettings.json Defi.Direct.Api/bin/Release/netcoreapp2.0/publish/appsettings.staging.json "STAGING"
# createEnvironmentSpecificAppSettingsFile Defi.Direct.Api/appsettings.json Defi.Direct.Api/bin/Release/netcoreapp2.0/publish/appsettings.qa.json "QA"
# createEnvironmentSpecificAppSettingsFile Defi.Direct.Api/appsettings.json Defi.Direct.Api/bin/Release/netcoreapp2.0/publish/appsettings.prod.json "PROD"