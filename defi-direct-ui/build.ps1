# Input parameters to the script
param (
  [string]$task = "help"  # What task to run
)

# Default color for informational messages
$infoColor = "Yellow"

# Print usage options to screen
function printHelp() {
  $color = "Green"
  Write-Host "USAGE:" -foregroundcolor $color
  Write-Host "  `.\build.ps1 help` - Print this help message" -foregroundcolor $color
  Write-Host "  `.\build.ps1 bootstrap` - Create Docker external resources, build and run from source, run migrations, profit" -foregroundcolor $color
}

# Stop any containers running this solution's projects
function stopAllContainers() {
  Write-Host "Stopping any running project containers..."  -foregroundcolor $infoColor
  docker stop @(docker ps --format "{{.ID}}" --filter "name=defi.direct.ui")  # This stops any running containers whose name starts with def.labs*
}

# Publish web application project
function publishProjects() {
  Write-Host "Publishing solution's projects..."  -foregroundcolor $infoColor
  npm build
}

# Build and run this projects Docker containers using docker-compose
function startContainers()
{
  Write-Host "Building and running containers from local source code..." -foregroundcolor $infoColor
  stopAllContainers  # We have to stop any existing project containers that are running in order to start new ones
  publishProjects  # dotnet publish the new bits from source code
  docker-compose -f "docker-compose.yml" -f "docker-compose.override.yml" -f "docker-compose.local.yml" up -d --build
  docker ps  # List the running containers
}

function bootstrap()
{
Write-Host "Creating Docker network shared by all defidirect containers..." -foregroundcolor $infoColor
docker network create defi.direct-network

#  Write-Host "Creating data volume container for MySQL..." -foregroundcolor $infoColor
#  docker volume create defi.labs.docker.mysql

  startContainers
}

switch($task)
{
  "help" { printHelp }
  "bootstrap" { bootstrap }
  default { printHelp }
}