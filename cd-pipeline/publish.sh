#!/bin/bash
set -e
set -o pipefail

function replaceWithEnvironmentTokens(){
    apikey=$2_HEALTH_CHECK_KEY
    logglyhostname=$2_LOGGLY_ENDPOINT_HOSTNAME
    logglytoken=$2_LOGGLY_CUSTOMER_TOKEN
	dirapikey=$2_API_KEY
    aeskey=$2_AES_KEY
    aesiv=$2_AES_IV
    sbucket=$2_S3_BUCKET
    skey=$2_S3_KEY
    directConnString=$2_MYSQL_DIRECT_CONNECTION_STRING
    directAuthConnString=$2_MYSQL_DIRECTAUTH_CONNECTION_STRING
	dataDogOptionsEnabled=$2_DATADOGOPTIONS_ENABLED
	dataDogOptionsServerName=DATADOGOPTIONS_SERVERNAME
	dataDogOptionsAPIKey=DATADOG_API_KEY
    dataDogOptionsTags=$2_DATADOGOPTIONS_TAGS

    sed -i -e "s/{{HealthCheckOptions.Key}}/${!apikey}/g" $1
    sed -i -e "s/{{LogglyOptions.EndpointHostName}}/${!logglyhostname}/g" $1
    sed -i -e "s/{{LogglyOptions.CustomerToken}}/${!logglytoken}/g" $1
    sed -i -e "s/{{LogglyOptions.Enabled}}/true/g" $1
	sed -i -e "s/{{ApiKey}}/${!dirapikey}/g" $1
    sed -i -e "s/{{Key}}/${!aeskey}/g" $1
    sed -i -e "s/{{Iv}}/${!aesiv}/g" $1
    sed -i -e "s/{{S3Bucket}}/${!sbucket}/g" $1
    sed -i -e "s|{{S3Key}}|${!skey}|g" $1
    sed -i -e "s/{{ConnectionStrings.MySqlDirectConnectionString}}/${!directConnString}/g" $1
    sed -i -e "s/{{ConnectionStrings.MySqlDirectAuthConnectionString}}/${!directAuthConnString}/g" $1
	
	sed -i -e "s/{{DataDogOptions.Enabled}}/${!dataDogOptionsEnabled}/g" $1
	sed -i -e "s/{{DataDogOptions.ServerName}}/${!dataDogOptionsServerName}/g" $1
	sed -i -e "s/{{DataDogOptions.Tags}}/${!dataDogOptionsTags}/g" $1
	sed -i -e "s/{{DataDogOptions.ApiKey}}/${!dataDogOptionsAPIKey}/g" $1
	
    if [ "$2" == "QA" ] || [ "$2" == "PROD" ]
    then      
		sed -i -e "s/{{DatabaseMigrator.ApplyMigration}}/true/g" $1
    else
        sed -i -e "s/{{DatabaseMigrator.ApplyMigration}}/false/g" $1
    fi

    if [ "$2" == "PROD" ]
    then
        # This seems pointless, but I'll keep it because it's what we've done so far
        echo 'replace api-qa with api'
        sed -i -e "s/api-qa.defidirect.com/api-qa.defidirect.com/g" $1
    fi
}

function createEnvironmentSpecificAppSettingsFile(){
    cp $1 $2
        replaceWithEnvironmentTokens $2 $3
}

dotnet publish Defi.Direct.Api/Defi.Direct.Api.csproj -c Release

dotnet publish Defi.Direct.DatabaseMigrator/Defi.Direct.DatabaseMigrator.csproj -c Release

createEnvironmentSpecificAppSettingsFile Defi.Direct.Api/appsettings.json Defi.Direct.Api/bin/Release/netcoreapp3.1/publish/appsettings.Cd.json "CD"
createEnvironmentSpecificAppSettingsFile Defi.Direct.Api/appsettings.json Defi.Direct.Api/bin/Release/netcoreapp3.1/publish/appsettings.staging.json "STAGING"
createEnvironmentSpecificAppSettingsFile Defi.Direct.Api/appsettings.json Defi.Direct.Api/bin/Release/netcoreapp3.1/publish/appsettings.qa.json "QA"
createEnvironmentSpecificAppSettingsFile Defi.Direct.Api/appsettings.json Defi.Direct.Api/bin/Release/netcoreapp3.1/publish/appsettings.prod.json "PROD"

createEnvironmentSpecificAppSettingsFile Defi.Direct.DatabaseMigrator/appsettings.json Defi.Direct.DatabaseMigrator/bin/Release/netcoreapp3.1/publish/appsettings.Cd.json "CD"
createEnvironmentSpecificAppSettingsFile Defi.Direct.DatabaseMigrator/appsettings.json Defi.Direct.DatabaseMigrator/bin/Release/netcoreapp3.1/publish/appsettings.staging.json "STAGING"
createEnvironmentSpecificAppSettingsFile Defi.Direct.DatabaseMigrator/appsettings.json Defi.Direct.DatabaseMigrator/bin/Release/netcoreapp3.1/publish/appsettings.qa.json "QA"
createEnvironmentSpecificAppSettingsFile Defi.Direct.DatabaseMigrator/appsettings.json Defi.Direct.DatabaseMigrator/bin/Release/netcoreapp3.1/publish/appsettings.prod.json "PROD"