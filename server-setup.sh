#!/bin/bash

# Popup Builder Native Server Setup Script
# Supports Ubuntu/Debian and CentOS/RHEL

set -e

echo "🚀 Setting up Popup Builder for native server deployment..."

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
else
    echo "❌ Cannot detect OS. This script supports Ubuntu/Debian and CentOS/RHEL."
    exit 1
fi

# Function to install Node.js
install_nodejs() {
    echo "📦 Installing Node.js..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        # Install Node.js 18.x on Ubuntu/Debian
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        # Install Node.js 18.x on CentOS/RHEL
        curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
        sudo yum install -y nodejs
    fi
    
    # Verify installation
    node --version
    npm --version
}

# Function to install Nginx
install_nginx() {
    echo "🌐 Installing Nginx..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        sudo apt-get update
        sudo apt-get install -y nginx
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        sudo yum install -y epel-release
        sudo yum install -y nginx
    fi
    
    # Enable and start Nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
}

# Function to install PM2
install_pm2() {
    echo "⚡ Installing PM2 process manager..."
    sudo npm install -g pm2
    
    # Setup PM2 startup script
    sudo pm2 startup
}

# Function to create application user
create_app_user() {
    echo "👤 Creating application user..."
    
    # Create popup user if it doesn't exist
    if ! id "popup" &>/dev/null; then
        sudo useradd -r -s /bin/bash -d /opt/popup-builder popup
    fi
    
    # Create application directory
    sudo mkdir -p /opt/popup-builder
    sudo chown popup:popup /opt/popup-builder
}

# Function to setup firewall
setup_firewall() {
    echo "🔥 Configuring firewall..."
    
    if command -v ufw &> /dev/null; then
        # Ubuntu/Debian with UFW
        sudo ufw allow 22/tcp
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp
        sudo ufw --force enable
    elif command -v firewall-cmd &> /dev/null; then
        # CentOS/RHEL with firewalld
        sudo firewall-cmd --permanent --add-service=ssh
        sudo firewall-cmd --permanent --add-service=http
        sudo firewall-cmd --permanent --add-service=https
        sudo firewall-cmd --reload
    fi
}

# Main installation
main() {
    echo "🔍 Detected OS: $OS $VER"
    
    # Update system packages
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        sudo apt-get update
        sudo apt-get install -y curl wget git build-essential
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        sudo yum update -y
        sudo yum groupinstall -y "Development Tools"
        sudo yum install -y curl wget git
    fi
    
    # Install components
    install_nodejs
    install_nginx
    install_pm2
    create_app_user
    setup_firewall
    
    echo "✅ Server setup complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Clone your popup builder code to /opt/popup-builder"
    echo "2. Run the deployment script: ./deploy-native.sh"
    echo "3. Configure your domain and SSL certificate"
    echo ""
    echo "🔧 Useful commands:"
    echo "  - Check Nginx status: sudo systemctl status nginx"
    echo "  - Check PM2 processes: pm2 list"
    echo "  - View application logs: pm2 logs popup-builder"
}

# Run main function
main