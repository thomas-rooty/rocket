docker build -t rocketrocket-app:rocket-app .
docker run -d -it --rm -v ${PWD}:/app -v /app/node_modules -p 3001:3000 -e CHOKIDAR_USEPOLLING=true rocketrocket-app:rocketrocket-app
echo "Rock.ET built and deployed at http://localhost:3001"