# Stop the previous container if it's running
docker stop kassiesrecipies || true

# Remove the stopped container
docker rm kassiesrecipies || true
