#!/bin/bash
set -e
set -o pipefail

echo "$MYGET_NUGET_CONFIG" > "./nuget.config"

sudo dotnet build Defi.Direct.Api/Defi.Direct.Api.csproj

sudo dotnet build Defi.Direct.DatabaseMigrator/Defi.Direct.DatabaseMigrator.csproj