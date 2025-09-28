# Self-Hosting Guide for Popup Builder

This guide will help you deploy the Popup Builder on your own server.

## Prerequisites

- Docker and Docker Compose installed
- A server with at least 1GB RAM
- Domain name (optional, for HTTPS)

## Quick Start

### 1. Clone and Deploy

```bash
# Clone the repository
git clone <your-repo-url>
cd popup-builder

# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### 2. Access Your Application

- **Local**: http://localhost
- **Server**: http://your-server-ip

## Manual Deployment

### 1. Using Docker Compose

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Using Docker Only

```bash
# Build the image
docker build -t popup-builder .

# Run the container
docker run -d -p 80:80 --name popup-builder popup-builder
```

## Configuration

### Environment Variables

Create a `.env` file for custom configuration:

```env
NODE_ENV=production
PORT=3000
```

### SSL/HTTPS Setup

1. **Get SSL Certificate**:
   ```bash
   # Using Let's Encrypt (recommended)
   sudo apt install certbot
   sudo certbot certonly --standalone -d your-domain.com
   ```

2. **Copy certificates**:
   ```bash
   sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/cert.pem
   sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/key.pem
   ```

3. **Update nginx.conf**:
   - Uncomment the HTTPS server block
   - Replace `your-domain.com` with your actual domain

4. **Restart services**:
   ```bash
   docker-compose restart nginx
   ```

### Custom Domain

1. **Update nginx.conf**:
   ```nginx
   server_name your-domain.com;
   ```

2. **DNS Configuration**:
   - Point your domain's A record to your server's IP
   - Wait for DNS propagation (up to 24 hours)

## Maintenance

### Updates

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose build
docker-compose up -d
```

### Backups

```bash
# Backup data directory
tar -czf popup-builder-backup-$(date +%Y%m%d).tar.gz data/

# Restore from backup
tar -xzf popup-builder-backup-YYYYMMDD.tar.gz
```

### Monitoring

```bash
# View real-time logs
docker-compose logs -f

# Check service status
docker-compose ps

# View resource usage
docker stats
```

## Troubleshooting

### Common Issues

1. **Port 80 already in use**:
   ```bash
   # Check what's using port 80
   sudo lsof -i :80
   
   # Stop conflicting service (e.g., Apache)
   sudo systemctl stop apache2
   ```

2. **Permission denied**:
   ```bash
   # Fix permissions
   sudo chown -R $USER:$USER ./data
   chmod +x deploy.sh
   ```

3. **Docker daemon not running**:
   ```bash
   # Start Docker service
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

### Performance Optimization

1. **Increase worker processes** in nginx.conf:
   ```nginx
   worker_processes auto;
   ```

2. **Add resource limits** in docker-compose.yml:
   ```yaml
   deploy:
     resources:
       limits:
         memory: 512M
       reservations:
         memory: 256M
   ```

## Security Considerations

1. **Firewall Configuration**:
   ```bash
   # Allow HTTP and HTTPS
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

2. **Regular Updates**:
   - Keep Docker images updated
   - Monitor security advisories
   - Update SSL certificates before expiry

3. **Access Control**:
   - Use strong passwords
   - Consider IP whitelisting
   - Enable fail2ban for brute force protection

## Support

For issues and questions:
- Check the logs: `docker-compose logs`
- Review this documentation
- Check Docker and system resources
- Ensure all prerequisites are met

## Advanced Configuration

### Reverse Proxy Setup

If you're using an existing reverse proxy (like Traefik or another Nginx):

```yaml
# docker-compose.yml - remove nginx service and expose app directly
services:
  popup-builder:
    build: .
    ports:
      - "3000:3000"
    # ... rest of config
```

### Database Integration

For persistent data storage, you can add a database service:

```yaml
services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: popupbuilder
      POSTGRES_USER: popup
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

This setup provides a robust, scalable solution for self-hosting your popup builder with proper security, monitoring, and maintenance procedures.