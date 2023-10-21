Sample .env
```
NODE_ENV=development
SERVICE_PORT="5200"
MATCHING_TIMEOUT=10000
LOG_LEVEL="debug"
REDIS_EVENT_BUS=redis://localhost:6380/
```

Run event bus between matching and collaboration service:
```
$ sudo docker run -p 6380:6380 --name peerprep-eventbus -d redis
```

Start service
```bash
npm run dev
```

docker build
```bash
docker build -t matching-service .
```
