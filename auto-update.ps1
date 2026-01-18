Write-Host "Checking for updates..."

cd $PSScriptRoot

git fetch origin

$local = git rev-parse HEAD
$remote = git rev-parse origin/main

if ($local -ne $remote) {
  Write-Host "New version found. Pulling code..."
  git pull origin main

  Write-Host "Installing dependencies..."
  npm install

  Write-Host "Building project..."
  CI=false npm run build

  Write-Host "Starting project..."
  npm run start
}
else {
  Write-Host "Project is already up to date."
}
