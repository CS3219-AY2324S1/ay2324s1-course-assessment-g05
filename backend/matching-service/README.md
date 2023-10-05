Sample .env
```
NODE_ENV=development
SERVICE_PORT="5200"
MATCHING_TIMEOUT=10000
LOG_LEVEL="debug"
```

Start service
```bash
npm run dev
```

docker build
```bash
docker build -t matching-service .
```