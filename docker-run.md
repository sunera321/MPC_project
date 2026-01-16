# 🐳 Docker Deployment Guide

## Quick Start

### 1. Build Docker Image
```bash
docker build -t srilanka-news .
```

### 2. Run with Docker
```bash
docker run -d \
  --name srilanka-news \
  -p 3000:3000 \
  -e GROQ_API_KEY="your_api_key_here" \
  srilanka-news
```

### 3. Run with Docker Compose (Recommended)
```bash
# Make sure .env file exists with GROQ_API_KEY
docker-compose up -d
```

## Docker Commands

### View Logs
```bash
docker logs srilanka-news -f
```

### Stop Container
```bash
docker-compose down
# OR
docker stop srilanka-news
```

### Restart Container
```bash
docker-compose restart
# OR
docker restart srilanka-news
```

### Remove Container & Image
```bash
docker-compose down --rmi all
# OR
docker stop srilanka-news
docker rm srilanka-news
docker rmi srilanka-news
```

### Check Health Status
```bash
docker ps
docker inspect srilanka-news --format='{{.State.Health.Status}}'
```

## Environment Variables

Create a `.env` file in the project root:
```
GROQ_API_KEY=gsk_your_actual_api_key_here
```

## Access Application

Once running, access at:
- **Local**: http://localhost:3000
- **Network**: http://YOUR_IP:3000

## Production Deployment

For production, consider:
1. Use environment variables for sensitive data
2. Set up reverse proxy (nginx)
3. Use Docker volumes for persistence
4. Configure logging and monitoring
5. Set up automatic restarts

## Troubleshooting

### Container won't start
```bash
docker logs srilanka-news
```

### Port already in use
```bash
# Use different port
docker run -p 8080:3000 ...
```

### Rebuild after code changes
```bash
docker-compose down
docker-compose up -d --build
```
