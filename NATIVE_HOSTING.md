# Native Server Hosting Guide

This guide will help you deploy the Popup Builder directly on your server without Docker containers.

## Prerequisites

- Ubuntu 18.04+ / Debian 10+ / CentOS 7+ / RHEL 7+
- Root or sudo access
- At least 1GB RAM and 10GB disk space
- Domain name (optional, for SSL)

## Quick Start

### 1. Server Setup

```bash
# Download and run server setup
curl -fsSL https://raw.githubusercontent.com/your-repo/popup-builder/main/server-setup.sh | bash

# Or manually:
chmod +x server-setup.sh
./server-setup.sh
```

### 2. Deploy Application

```bash
# Clone your repository
git clone https://github.com/your-repo/popup-builder.git
cd popup-builder

# Deploy
chmod +x deploy-native.sh
./deploy-native.sh
```

### 3. Access Your Application

- **HTTP**: `http://your-server-ip`
- **With Domain**: `http://your-domain.com`
- **With SSL**: `https://your-domain.com`

## Manual Installation

### 1. Install Dependencies

#### Ubuntu/Debian:
```bash
# Update system
sudo apt-get update
sudo apt-get install -y curl wget git build-essential

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt-get install -y nginx

# Install PM2
sudo npm install -g pm2
```

#### CentOS/RHEL:
```bash
# Update system
sudo yum update -y
sudo yum groupinstall -y "Development Tools"
sudo yum install -y curl wget git

# Install Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install Nginx
sudo yum install -y epel-release
sudo yum install -y nginx

# Install PM2
sudo npm install -g pm2
```

### 2. Create Application User

```bash
# Create dedicated user
sudo useradd -r -s /bin/bash -d /opt/popup-builder popup

# Create application directory
sudo mkdir -p /opt/popup-builder
sudo chown popup:popup /opt/popup-builder
```

### 3. Deploy Application

```bash
# Copy application files
sudo cp -r . /opt/popup-builder/
sudo chown -R popup:popup /opt/popup-builder

# Install dependencies and build
sudo -u popup bash -c "cd /opt/popup-builder && npm ci --only=production"
sudo -u popup bash -c "cd /opt/popup-builder && npm run build"
```

### 4. Configure Nginx

```bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/popup-builder > /dev/null <<'EOF'
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or use _
    root /opt/popup-builder/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security
    location ~ /\. {
        deny all;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/popup-builder /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx  # Ubuntu/Debian
# OR
sudo yum install -y certbot python3-certbot-nginx      # CentOS/RHEL

# Update Nginx config with your domain
sudo sed -i 's/server_name _;/server_name your-domain.com;/' /etc/nginx/sites-available/popup-builder
sudo systemctl reload nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com
```

### Using Custom SSL Certificate

```bash
# Copy your certificates
sudo mkdir -p /etc/nginx/ssl
sudo cp your-cert.pem /etc/nginx/ssl/
sudo cp your-key.pem /etc/nginx/ssl/

# Update Nginx configuration
sudo tee -a /etc/nginx/sites-available/popup-builder > /dev/null <<'EOF'

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/nginx/ssl/your-cert.pem;
    ssl_certificate_key /etc/nginx/ssl/your-key.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Include the rest of your server configuration here
    root /opt/popup-builder/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

sudo systemctl reload nginx
```

## Firewall Configuration

### Ubuntu/Debian (UFW)
```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### CentOS/RHEL (firewalld)
```bash
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Process Management

### Using systemd (Recommended)

Create a service file for background processes:

```bash
sudo tee /etc/systemd/system/popup-builder.service > /dev/null <<'EOF'
[Unit]
Description=Popup Builder Application
After=network.target

[Service]
Type=simple
User=popup
WorkingDirectory=/opt/popup-builder
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Enable and start (only if you have a backend server)
sudo systemctl daemon-reload
sudo systemctl enable popup-builder
sudo systemctl start popup-builder
```

### Using PM2

```bash
# Start application with PM2 (if you have a backend)
sudo -u popup pm2 start /opt/popup-builder/server.js --name popup-builder

# Save PM2 configuration
sudo -u popup pm2 save

# Setup PM2 startup
sudo pm2 startup
```

## Monitoring and Logs

### Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Application Logs (if using PM2)
```bash
sudo -u popup pm2 logs popup-builder
```

### System Monitoring
```bash
# Check services
sudo systemctl status nginx
sudo systemctl status popup-builder

# Monitor resources
htop
df -h
free -h
```

## Backup and Restore

### Automated Backup Script

The deployment script creates `/usr/local/bin/backup-popup-builder`:

```bash
# Manual backup
sudo /usr/local/bin/backup-popup-builder

# Backups are stored in /opt/backups/popup-builder/
```

### Manual Backup
```bash
# Create backup
sudo tar -czf popup-builder-backup-$(date +%Y%m%d).tar.gz -C /opt popup-builder

# Restore backup
sudo tar -xzf popup-builder-backup-YYYYMMDD.tar.gz -C /opt
sudo chown -R popup:popup /opt/popup-builder
```

## Updates

### Using Update Script
```bash
# In your project directory
./update.sh
```

### Manual Update
```bash
# Pull latest changes
git pull

# Copy files
sudo cp -r . /opt/popup-builder/
sudo chown -R popup:popup /opt/popup-builder

# Rebuild
sudo -u popup bash -c "cd /opt/popup-builder && npm ci --only=production"
sudo -u popup bash -c "cd /opt/popup-builder && npm run build"

# Restart services
sudo systemctl reload nginx
```

## Performance Optimization

### Nginx Optimization
```bash
# Edit /etc/nginx/nginx.conf
sudo nano /etc/nginx/nginx.conf

# Add/modify these settings:
worker_processes auto;
worker_connections 1024;
keepalive_timeout 65;
client_max_body_size 10M;
```

### System Optimization
```bash
# Increase file limits
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf

# Optimize kernel parameters
echo "net.core.somaxconn = 65536" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   sudo chown -R popup:popup /opt/popup-builder
   sudo chmod -R 755 /opt/popup-builder
   ```

2. **Nginx Won't Start**
   ```bash
   sudo nginx -t  # Test configuration
   sudo systemctl status nginx
   sudo journalctl -u nginx
   ```

3. **Port Already in Use**
   ```bash
   sudo lsof -i :80
   sudo systemctl stop apache2  # If Apache is running
   ```

4. **SSL Certificate Issues**
   ```bash
   sudo certbot renew --dry-run
   sudo systemctl reload nginx
   ```

### Log Locations
- Nginx: `/var/log/nginx/`
- System: `/var/log/syslog` or `journalctl`
- Application: `/var/log/popup-builder/` (if configured)

## Security Best Practices

1. **Keep System Updated**
   ```bash
   sudo apt-get update && sudo apt-get upgrade  # Ubuntu/Debian
   sudo yum update  # CentOS/RHEL
   ```

2. **Configure Fail2Ban**
   ```bash
   sudo apt-get install fail2ban
   sudo systemctl enable fail2ban
   ```

3. **Regular Backups**
   - Automated daily backups are configured
   - Test restore procedures regularly

4. **Monitor Security**
   - Review logs regularly
   - Keep SSL certificates updated
   - Monitor for unusual activity

This native deployment approach gives you full control over your popup builder installation with excellent performance and security.