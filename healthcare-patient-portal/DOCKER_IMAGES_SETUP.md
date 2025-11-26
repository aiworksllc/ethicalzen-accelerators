# Healthcare Patient Portal - Docker Images Setup

This accelerator uses pre-built Docker images to protect proprietary code while allowing easy deployment.

## 📦 Download Pre-Built Docker Images

Download the required Docker images from GitHub Releases:

1. **Healthcare Patient Portal App**: `healthcare-patient-portal-v1.0.tar.gz` (67 MB)
2. **ACVPS Gateway**: `acvps-gateway-v1.0.tar.gz` (12 MB)
3. **Metrics Service**: `metrics-service-v1.0.tar.gz` (142 MB)

**Download Link**: https://github.com/YOUR-ORG/ethicalzen/releases/tag/v1.0

## 🚀 Load Docker Images

After downloading, load the images into Docker:

```bash
# Load healthcare app image
docker load < healthcare-patient-portal-v1.0.tar.gz

# Load gateway image
docker load < acvps-gateway-v1.0.tar.gz

# Load metrics service image
docker load < metrics-service-v1.0.tar.gz

# Verify images are loaded
docker images | grep ethicalzen
```

Expected output:
```
ethicalzen/healthcare-patient-portal   v1.0   ...   67MB
ethicalzen/acvps-gateway              v1.0   ...   12MB
ethicalzen/metrics-service            v1.0   ...   142MB
```

## ✅ Verify Images

```bash
# Test gateway image
docker run --rm ethicalzen/acvps-gateway:v1.0 --version

# Test metrics service image
docker run --rm ethicalzen/metrics-service:v1.0 node --version

# Test healthcare app image
docker run --rm ethicalzen/healthcare-patient-portal:v1.0 node --version
```

## 🏃 Run the Accelerator

Once images are loaded, follow the main [README.md](./README.md) starting from **Step 1: Set API Keys**.

Use the production docker-compose file:

```bash
# Set your API keys
export GROQ_API_KEY="your-groq-api-key"
export LLM_PROVIDER="groq"
export LLM_MODEL="llama-3.3-70b-versatile"

# Start services
docker compose -f docker-compose.prod.yml up -d

# Check status
docker compose -f docker-compose.prod.yml ps
```

## 🔄 Alternative: Use GitHub Container Registry (GHCR)

If images are published to GHCR, you can pull them directly:

```bash
# Login to GHCR (if images are private)
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull images
docker pull ghcr.io/YOUR-ORG/healthcare-patient-portal:v1.0
docker pull ghcr.io/YOUR-ORG/acvps-gateway:v1.0
docker pull ghcr.io/YOUR-ORG/metrics-service:v1.0

# Tag for local use
docker tag ghcr.io/YOUR-ORG/healthcare-patient-portal:v1.0 ethicalzen/healthcare-patient-portal:v1.0
docker tag ghcr.io/YOUR-ORG/acvps-gateway:v1.0 ethicalzen/acvps-gateway:v1.0
docker tag ghcr.io/YOUR-ORG/metrics-service:v1.0 ethicalzen/metrics-service:v1.0
```

## 🗑️ Cleanup

```bash
# Stop services
docker compose -f docker-compose.prod.yml down -v

# Remove images (if needed)
docker rmi ethicalzen/healthcare-patient-portal:v1.0
docker rmi ethicalzen/acvps-gateway:v1.0
docker rmi ethicalzen/metrics-service:v1.0
```

## 📝 Notes

- **Pre-built images** contain compiled code only (no source code exposed)
- **Images are architecture-specific**: Built for `linux/amd64`
- **Size**: Total ~220 MB compressed, ~800 MB uncompressed
- **Updates**: Check GitHub Releases for new versions

## 🆘 Troubleshooting

### "Image not found" error
```bash
# Check if images are loaded
docker images | grep ethicalzen

# If not loaded, run docker load commands again
```

### "No space left on device"
```bash
# Clean up unused Docker resources
docker system prune -a

# Then reload images
```

### Performance issues
```bash
# Check Docker resource allocation
docker info | grep -i "CPUs\|Memory"

# Increase Docker resources in Docker Desktop settings
```

