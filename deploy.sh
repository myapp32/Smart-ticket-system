#!/bin/bash

set -e   # Exit immediately if any command fails

echo "🚀 Starting Smart Ticket System Automation..."

# -------- CONFIG --------
NAMESPACE="smartticket"
BACKEND_DIR="BACKEND"
FRONTEND_DIR="FRONTEND"

# -------- CHECK DOCKER --------
if ! command -v docker &> /dev/null; then
  echo "❌ Docker not found. Installing Docker..."
  sudo apt update
  sudo apt install -y docker.io
  sudo systemctl start docker
  sudo systemctl enable docker
fi

# -------- CHECK DOCKER COMPOSE --------
if ! command -v docker-compose &> /dev/null; then
  echo "❌ Docker Compose not found. Installing..."
  sudo curl -L "https://github.com/docker/compose/releases/download/2.24.0/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
fi

# -------- BUILD DOCKER IMAGES --------
echo "🐳 Building Backend Image..."
docker build -t smartticket-backend:latest $BACKEND_DIR

echo "🐳 Building Frontend Image..."
docker build -t smartticket-frontend:latest $FRONTEND_DIR

# -------- DOCKER COMPOSE --------
echo "📦 Starting services using Docker Compose..."
docker-compose up -d --build

echo "✅ Docker services running"
docker ps

# -------- KUBERNETES SECTION --------
echo "☸️ Checking Kubernetes..."
if ! command -v kubectl &> /dev/null; then
  echo "❌ kubectl not found. Install kubectl first."
  exit 1
fi

echo "📦 Creating Namespace..."
kubectl apply -f namespace.yml || true

echo "📦 Deploying Smart Ticket App to Kubernetes..."
kubectl apply -f smartticket-all-in-one.yml -n $NAMESPACE

echo "📊 Kubernetes Status:"
kubectl get pods -n $NAMESPACE
kubectl get svc -n $NAMESPACE

echo "🎉 Deployment Completed Successfully!"

