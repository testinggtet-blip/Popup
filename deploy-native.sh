#!/bin/bash

# Native Deployment Script for Popup Builder

set -e

APP_NAME="popup-builder"
APP_DIR="/opt/popup-builder"
APP_USER="popup"
NGINX_CONF="/etc/nginx/sites-available/$APP_NAME"
NGINX_ENABLED="/etc/nginx/sites-enabled/$APP_NAME"

echo "🚀 Deploying Popup Builder natively..."

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
    echo "❌ Don't run this script as root. Use a regular user with sudo privileges."
    exit 1
fi

# Function to deploy application
deploy_app() {
    echo "📦 Deploying application..."
    
    # Create app directory if it doesn't exist
    sudo mkdir -p $APP_DIR
    
    # Copy application files
    sudo cp -r . $APP_DIR/
    sudo chown -R $APP_USER:$APP_USER $APP_DIR
    
    # Switch to app user and install dependencies
    sudo -u $APP_USER bash -c "cd $APP_DIR && npm ci --only=production"
    
    # Build the application
    sudo -u $APP_USER bash -c "cd $APP_DIR && npm run build"
    
    echo "✅ Application deployed successfully"
}

# Function to configure Nginx
configure_nginx() {
    echo "🌐 Configuring Nginx..."
    
    # Create Nginx configuration
    sudo tee $NGINX_CONF > /dev/null <<EOF
server {
    listen 80;
    server_name localhost _;
    root $APP_DIR/dist;
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
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Handle client-side routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security - deny access to hidden files
    location ~ /\. {
        deny all;
    }

    # Optional: API proxy (if you add backend functionality)
    # location /api/ {
    #     proxy_pass http://localhost:3001;
    #     proxy_http_version 1.1;
    #     proxy_set_header Upgrade \$http_upgrade;
    #     proxy_set_header Connection 'upgrade';
    #     proxy_set_header Host \$host;
    #     proxy_set_header X-Real-IP \$remote_addr;
    #     proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    #     proxy_set_header X-Forwarded-Proto \$scheme;
    #     proxy_cache_bypass \$http_upgrade;
    # }
}
EOF

    # Enable the site
    sudo ln -sf $NGINX_CONF $NGINX_ENABLED
    
    # Remove default Nginx site
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test Nginx configuration
    sudo nginx -t
    
    # Reload Nginx
    sudo systemctl reload nginx
    
    echo "✅ Nginx configured successfully"
}

# Function to setup SSL with Let's Encrypt
setup_ssl() {
    local domain=$1
    
    if [ -z "$domain" ]; then
        echo "⚠️  No domain provided, skipping SSL setup"
        return
    fi
    
    echo "🔒 Setting up SSL for domain: $domain"
    
    # Install Certbot
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx
    elif command -v yum &> /dev/null; then
        sudo yum install -y certbot python3-certbot-nginx
    fi
    
    # Update Nginx config with domain
    sudo sed -i "s/server_name localhost _;/server_name $domain;/" $NGINX_CONF
    sudo systemctl reload nginx
    
    # Obtain SSL certificate
    sudo certbot --nginx -d $domain --non-interactive --agree-tos --email admin@$domain
    
    echo "✅ SSL certificate installed successfully"
}

# Function to create systemd service (optional, for backend API)
create_service() {
    echo "⚙️  Creating systemd service..."
    
    sudo tee /etc/systemd/system/$APP_NAME.service > /dev/null <<EOF
[Unit]
Description=Popup Builder Application
After=network.target

[Service]
Type=simple
User=$APP_USER
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
EOF

    # Only enable if server.js exists
    if [ -f "$APP_DIR/server.js" ]; then
        sudo systemctl daemon-reload
        sudo systemctl enable $APP_NAME
        sudo systemctl start $APP_NAME
        echo "✅ Systemd service created and started"
    else
        echo "ℹ️  No server.js found, skipping service creation"
    fi
}

# Function to setup monitoring
setup_monitoring() {
    echo "📊 Setting up basic monitoring..."
    
    # Create log directory
    sudo mkdir -p /var/log/$APP_NAME
    sudo chown $APP_USER:$APP_USER /var/log/$APP_NAME
    
    # Setup logrotate
    sudo tee /etc/logrotate.d/$APP_NAME > /dev/null <<EOF
/var/log/$APP_NAME/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $APP_USER $APP_USER
}
EOF

    echo "✅ Basic monitoring setup complete"
}

# Function to create backup script
create_backup_script() {
    echo "💾 Creating backup script..."
    
    sudo tee /usr/local/bin/backup-popup-builder > /dev/null <<'EOF'
#!/bin/bash

BACKUP_DIR="/opt/backups/popup-builder"
APP_DIR="/opt/popup-builder"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
tar -czf $BACKUP_DIR/popup-builder-$DATE.tar.gz -C /opt popup-builder

# Keep only last 7 backups
find $BACKUP_DIR -name "popup-builder-*.tar.gz" -mtime +7 -delete

echo "Backup created: $BACKUP_DIR/popup-builder-$DATE.tar.gz"
EOF

    sudo chmod +x /usr/local/bin/backup-popup-builder
    
    # Add to crontab for daily backups
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-popup-builder") | crontab -
    
    echo "✅ Backup script created (runs daily at 2 AM)"
}

# Main deployment function
main() {
    echo "Starting deployment process..."
    
    # Check if required files exist
    if [ ! -f "package.json" ]; then
        echo "❌ package.json not found. Make sure you're in the project directory."
        exit 1
    fi
    
    # Deploy application
    deploy_app
    
    # Configure web server
    configure_nginx
    
    # Setup optional components
    create_service
    setup_monitoring
    create_backup_script
    
    # Prompt for SSL setup
    echo ""
    read -p "🔒 Do you want to setup SSL with a domain? (y/N): " setup_ssl_choice
    if [[ $setup_ssl_choice =~ ^[Yy]$ ]]; then
        read -p "Enter your domain name: " domain
        setup_ssl $domain
    fi
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "📋 Your popup builder is now available at:"
    if [ ! -z "$domain" ]; then
        echo "  🌐 https://$domain"
    else
        echo "  🌐 http://$(curl -s ifconfig.me || echo 'your-server-ip')"
        echo "  🏠 http://localhost (if accessing locally)"
    fi
    echo ""
    echo "🔧 Management commands:"
    echo "  - Check Nginx status: sudo systemctl status nginx"
    echo "  - View Nginx logs: sudo tail -f /var/log/nginx/error.log"
    echo "  - Reload Nginx: sudo systemctl reload nginx"
    echo "  - Create backup: sudo /usr/local/bin/backup-popup-builder"
    echo "  - View app files: ls -la $APP_DIR"
    echo ""
    echo "📚 For updates:"
    echo "  1. Pull latest changes to your project directory"
    echo "  2. Run this script again: ./deploy-native.sh"
}

# Run main function
main "$@"