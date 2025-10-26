#!/usr/bin/env pwsh
# Start only the database service, wait until it's ready, then run tests with TEST_DATABASE_URL pointed at host:5433
param()

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Write-Host "Starting test database via docker-compose..."
Push-Location $root/../

docker-compose up -d database

# Wait for Postgres to accept connections on host port 5433
Write-Host "Waiting for Postgres to become available on localhost:5433..."
$maxTries = 30
$i = 0
while ($i -lt $maxTries) {
  try {
    $conn = Test-NetConnection -ComputerName 'localhost' -Port 5433 -WarningAction SilentlyContinue
    if ($conn.TcpTestSucceeded) { Write-Host 'Postgres port open'; break }
  } catch {}
  Start-Sleep -Seconds 2
  $i++
}

if ($i -ge $maxTries) {
  Write-Error 'Postgres did not become ready in time.'
  exit 1
}

Write-Host 'Running backend tests (using TEST_DATABASE_URL -> localhost:5433)...'
Push-Location $root/../backend

$env:TEST_DATABASE_URL = 'postgresql://skillwise_user:skillwise_pass@localhost:5433/skillwise_db'
npm install
npm test
