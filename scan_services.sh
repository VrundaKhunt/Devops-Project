#!/bin/bash

# Make sure reports folder exists
mkdir -p reports

# List of services
services=("order-service" "payment-service" "user-service" "product-service")

echo "Starting vulnerability scans for all services..."

for service in "${services[@]}"; do
  echo "----------------------------------------"
  echo "Building Docker image for $service..."
  docker build -t vrunda/$service:latest ./$service

  echo "Scanning $service with Trivy..."
  docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v ${PWD}/reports:/reports \
    aquasec/trivy image --format json --output /reports/${service}-trivy.json vrunda/$service:latest
  echo "Trivy report saved as reports/${service}-trivy.json"

  echo "Scanning $service with Grype..."
  docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
    anchore/grype:latest vrunda/$service:latest -o json > reports/${service}-grype.json
  echo "Grype report saved as reports/${service}-grype.json"
done

echo "----------------------------------------"
echo "All services scanned with Trivy and Grype!"


