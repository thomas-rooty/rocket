docker build -t rocket:rocket .
docker run -d -it --rm -v /app -v /app/node_modules -p 3001:3000 -e CHOKIDAR_USEPOLLING=true rocket:rocket
echo "Rock.ET built and deployed at http://localhost:3001"