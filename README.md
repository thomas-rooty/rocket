# Rocket App sisi les réacteurs !

## Lancer l'app

Lancer l'environnement de dév (port 3001:3000) :
```bash
docker-compose -f .\docker-compose.yml up -d --build
```

Lancer l'environnement de prod avec nginx (port 1337:80) :
```bash
docker-compose -f .\docker-compose.prod.yml up -d --build
```

