#!/bin/bash

# Prompt the user for the version number
read -p "Enter the version number of frontend you want: " version

# Clone the repository
git clone https://github.com/KaifSayyad/chat-wave-client-build-files.git

# Move into the cloned repository
cd chat-wave-client-build-files

# Checkout the specific version
git checkout "dist-$version"

# Move the dist folder to the desired location using relative paths
mv "dist-$version" ./../nginx

# Cleanup - remove the cloned repository
cd ..
rm -rf chat-wave-client-build-files

echo "dist-$version folder has been pulled and moved to ../chat-wave-server/nginx"
