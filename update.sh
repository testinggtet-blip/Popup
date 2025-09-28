#!/bin/bash

# Update script for native deployment

set -e

APP_DIR="/opt/popup-builder"
APP_USER="popup"

echo "🔄 Updating Popup Builder..."

# Check if running from project directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Run this from your project directory."
    exit 1
fi

# Backup current version
echo "💾 Creating backup..."
sudo /usr/local/bin/backup-popup-builder

# Stop services if running
if systemctl is-active --quiet popup-builder; then
    echo "⏹️  Stopping application service..."
    sudo systemctl stop popup-builder
fi

# Update application files
echo "📦 Updating application files..."
sudo cp -r . $APP_DIR/
sudo chown -R $APP_USER:$APP_USER $APP_DIR

# Install/update dependencies
echo "📚 Installing dependencies..."
sudo -u $APP_USER bash -c "cd $APP_DIR && npm ci --only=production"

# Build application
echo "🔨 Building application..."
sudo -u $APP_USER bash -c "cd $APP_DIR && npm run build"

# Restart services
if systemctl is-enabled --quiet popup-builder; then
    echo "🔄 Restarting application service..."
    sudo systemctl start popup-builder
fi

# Reload Nginx
echo "🌐 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Update completed successfully!"
echo "🌐 Your popup builder is now running the latest version"