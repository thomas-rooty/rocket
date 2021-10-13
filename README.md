# Rocket App sisi les réacteurs !

## Lancer l'app

### Linux
Lancer l'environnement de dév (localhost:3001) :
```bash
sudo bash start.sh
```

### Windows
Lancer l'environnement de dév (localhost:3001) :
```bash
docker build -t rocket:rocket .
docker run -d -it --rm -v ${PWD}:/app -v /app/node_modules -p 3001:3000 -e CHOKIDAR_USEPOLLING=true rocket:rocket
```
