#!/bin/bash

dotnet test Defi.Direct.Api.unit.tests/Defi.Direct.Api.unit.tests.csproj --test-adapter-path:. --logger:xunit     # Run the unit tests and output the results in an xunit style report
unitTestReturnCode=$?   # Capture the return code and don't fail this step immediately because we want to output the test results to Jenkins

xsltproc --output Defi.Direct.Api.unit.tests/TestResults/NUnitResults.xml cd-pipeline/NUnitXml.xslt Defi.Direct.Api.unit.tests/TestResults/TestResults.xml    # Transform the xunit results to nunit style results
xsltproc --output TestResults/JUnitResults-Unit.xml cd-pipeline/nunit-to-junit.xsl Defi.Direct.Api.unit.tests/TestResults/NUnitResults.xml # Transform the nunit results to junit style results, which is the Jenkins junit plugin uses

if [[ $unitTestReturnCode != 0 ]]; then exit $unitTestReturnCode; fi  # Return the error code from `dotnet test` if applicable