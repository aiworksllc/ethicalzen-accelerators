# 🚀 Deployment Options

The EthicalZen Healthcare Accelerator supports **two deployment architectures**:

---

## Option 1: SaaS Mode (Simple) ☁️

**Best for:** Development, testing, prototypes

### Architecture
```
Your App (Local) → EthicalZen Gateway (Cloud) → Your LLM (BYOK)
                            ↓
                   EthicalZen Portal (Cloud)
                   (metrics & monitoring)
```

### What You Need
- ✅ EthicalZen API key (free signup)
- ✅ LLM API key (OpenAI, Anthropic, or Groq)
- ✅ Docker

### Deployment
```bash
# 1. Configure keys
cp env.example .env
# Edit .env:
#   ETHICALZEN_API_KEY=sk-your-key
#   OPENAI_API_KEY=sk-your-key

# 2. Start (uses default docker-compose.yml)
docker-compose up -d

# 3. Test
npm test
```

### Pros
- ✅ **Simple setup** (1 service to run)
- ✅ **Automatic updates** (guardrails kept current)
- ✅ **Managed infrastructure** (we handle scaling)
- ✅ **Cloud dashboard** (metrics at app.ethicalzen.ai)
- ✅ **Free tier** (10K requests/month)

### Cons
- ⚠️ **Requires internet** (gateway is cloud-hosted)
- ⚠️ **Data in transit** (requests go to our gateway)
- ⚠️ **Not HIPAA BAA** (free/pro tier)

### Cost
- **EthicalZen:** Free (10K req/month) or $99/month (100K req)
- **Your LLM:** Pay provider directly (BYOK)

---

## Option 2: Fully Local Mode (Secure) 🔒

**Best for:** Production, HIPAA, financial, on-premises

### Architecture
```
Your App → Local Gateway → Your LLM (BYOK)
               ↓
         Local Metrics
         (audit trail)

ALL runs on YOUR infrastructure
ZERO data leaves your VPC
```

### What You Need
- ✅ LLM API key (OpenAI, Anthropic, or Groq)
- ✅ Docker
- ❌ **No EthicalZen account needed** (fully self-hosted)

### Deployment
```bash
# 1. Configure LLM key only
cp env.example .env
# Edit .env:
#   OPENAI_API_KEY=sk-your-key
#   (No ETHICALZEN_API_KEY needed!)

# 2. Start with local compose file
docker-compose -f docker-compose.local.yml up -d

# 3. Test
npm test

# 4. Access
#    - App: http://localhost:3000
#    - Metrics Dashboard: http://localhost:3001
#    - Gateway Metrics: http://localhost:9090/metrics
```

### Services Included
| Service | Port | Purpose |
|---------|------|---------|
| Healthcare App | 3000 | Your patient portal |
| ACVPS Gateway | 8080 | Local guardrail enforcement |
| Metrics Service | 4001 | Evidence logging & audit |
| Metrics Dashboard | 3001 | Monitoring UI |

### Pros
- ✅ **Zero data exfiltration** (nothing leaves your VPC)
- ✅ **Offline-first** (works without internet)
- ✅ **HIPAA compliant** (all data stays local)
- ✅ **No vendor lock-in** (fully open source)
- ✅ **Complete control** (you own the infrastructure)
- ✅ **No EthicalZen fees** (just your LLM costs)

### Cons
- ⚠️ **More services** (3 containers vs 1)
- ⚠️ **Manual updates** (you maintain guardrails)
- ⚠️ **You manage scaling** (no cloud auto-scaling)

### Cost
- **EthicalZen:** $0 (fully self-hosted)
- **Your LLM:** Pay provider directly (BYOK)
- **Infrastructure:** Your cloud/on-prem costs

---

## Comparison Matrix

| Feature | SaaS Mode | Local Mode |
|---------|-----------|------------|
| **Setup Complexity** | ⭐ Simple (1 service) | ⭐⭐⭐ Moderate (3 services) |
| **Internet Required** | ✅ Yes | ❌ No (after initial setup) |
| **Data Leaves VPC** | ✅ Yes (to our gateway) | ❌ Never |
| **HIPAA Compliant** | ⚠️ Enterprise only | ✅ Yes (built-in) |
| **Auto Updates** | ✅ Yes | ❌ Manual |
| **Cost** | Free/$99/month | $0 + your infra |
| **Vendor Lock-in** | ⚠️ Moderate | ✅ None |
| **Best For** | Dev/testing/prototypes | Production/regulated |

---

## How to Choose

### Use SaaS Mode If:
- 🧪 You're building a prototype or MVP
- 📚 You're in development/testing phase
- 🚀 You want the fastest time-to-market
- ☁️ You're okay with cloud dependencies
- 💰 You want managed infrastructure

### Use Local Mode If:
- 🏥 You handle PHI, PII, or sensitive data
- ⚖️ You're in a regulated industry (healthcare, finance, legal)
- 🔒 You need HIPAA, SOC 2, or ISO compliance
- 🛡️ Your security policy requires zero data exfiltration
- 🏢 You deploy on-premises or in your own VPC
- 🌐 You need offline operation

---

## Migration Path

### Start with SaaS, Move to Local

Many customers use this approach:

**Phase 1: Development (SaaS)**
```bash
docker-compose up -d
# Fast iteration, managed infra
```

**Phase 2: Production (Local)**
```bash
docker-compose -f docker-compose.local.yml up -d
# Zero data exfiltration, full control
```

**Migration is seamless:**
- ✅ Same application code
- ✅ Same guardrails
- ✅ Same API
- ✅ Just change compose file

---

## Detailed Local Setup

### 1. System Requirements

```yaml
Minimum:
  - CPU: 2 cores
  - RAM: 4 GB
  - Disk: 10 GB
  - Docker: 20+

Recommended (Production):
  - CPU: 4+ cores
  - RAM: 8+ GB
  - Disk: 50+ GB (for logs/metrics)
  - Docker: 24+
```

### 2. Environment Variables

**SaaS Mode (.env):**
```bash
# Required
ETHICALZEN_API_KEY=sk-your-ethicalzen-key
OPENAI_API_KEY=sk-your-openai-key

# Optional
LLM_PROVIDER=openai
LLM_MODEL=gpt-4
```

**Local Mode (.env):**
```bash
# Required
OPENAI_API_KEY=sk-your-openai-key

# Optional
LLM_PROVIDER=openai
LLM_MODEL=gpt-4
RETENTION_DAYS=90
```

### 3. Volumes & Data Persistence

**Local mode creates persistent volumes:**
```bash
# View volumes
docker volume ls | grep healthcare

# Backup volumes
docker run --rm -v healthcare_gateway-cache:/data \
  -v $(pwd):/backup alpine tar czf /backup/gateway-backup.tar.gz /data

docker run --rm -v healthcare_metrics-data:/data \
  -v $(pwd):/backup alpine tar czf /backup/metrics-backup.tar.gz /data

# Restore volumes
docker run --rm -v healthcare_gateway-cache:/data \
  -v $(pwd):/backup alpine tar xzf /backup/gateway-backup.tar.gz -C /
```

### 4. Monitoring & Logs

```bash
# View logs (all services)
docker-compose -f docker-compose.local.yml logs -f

# View specific service
docker-compose -f docker-compose.local.yml logs -f gateway

# Export metrics
curl http://localhost:9090/metrics > gateway-metrics.txt

# View audit trail
curl http://localhost:4001/api/evidence/recent
```

### 5. Health Checks

```bash
# App health
curl http://localhost:3000/health

# Gateway health
curl http://localhost:8080/health

# Metrics health
curl http://localhost:4001/health

# All-in-one check
docker-compose -f docker-compose.local.yml ps
```

---

## Production Deployment

### Local Mode on GCP (Example)

```bash
# 1. Provision VM
gcloud compute instances create healthcare-portal \
  --machine-type=n1-standard-4 \
  --image-family=cos-stable \
  --image-project=cos-cloud \
  --boot-disk-size=50GB \
  --zone=us-central1-a

# 2. SSH and clone
gcloud compute ssh healthcare-portal
git clone https://github.com/ethicalzen-accelerators/healthcare-patient-portal.git
cd healthcare-patient-portal

# 3. Configure
cp env.example .env
nano .env  # Add OPENAI_API_KEY

# 4. Deploy
docker-compose -f docker-compose.local.yml up -d

# 5. Verify
curl http://localhost:3000/health
```

### Local Mode on AWS (Example)

```bash
# 1. Launch EC2 (t3.large, Ubuntu 22.04)
# 2. Install Docker
sudo apt update && sudo apt install -y docker.io docker-compose
sudo usermod -aG docker ubuntu

# 3. Deploy
git clone https://github.com/ethicalzen-accelerators/healthcare-patient-portal.git
cd healthcare-patient-portal
cp env.example .env
nano .env  # Add OPENAI_API_KEY
docker-compose -f docker-compose.local.yml up -d
```

---

## Security Considerations

### SaaS Mode
- ✅ TLS in transit (your app → our gateway → your LLM)
- ✅ API key authentication
- ✅ Rate limiting (DDoS protection)
- ⚠️ Data transits through our infrastructure
- ⚠️ Compliance: Depends on our certifications

### Local Mode
- ✅ **Zero data exfiltration** (nothing leaves your VPC)
- ✅ **Offline-first** (no internet dependency)
- ✅ **You control encryption** (TLS, disk encryption)
- ✅ **You control access** (firewall, VPN, etc.)
- ✅ **Compliance: Your responsibility** (you own it)

---

## Support

### SaaS Mode
- 💬 Community: [Discord](https://discord.gg/ethicalzen)
- 📧 Email: support@ethicalzen.ai
- 📖 Docs: [docs.ethicalzen.ai](https://docs.ethicalzen.ai)

### Local Mode
- 💬 Community: [Discord](https://discord.gg/ethicalzen)
- 📧 Email: support@ethicalzen.ai (best-effort for OSS)
- 🐛 GitHub Issues: Report bugs/feature requests
- 📚 Self-service: Full docs included

---

## FAQs

**Q: Can I switch from SaaS to Local later?**
A: Yes! Just change the compose file. Same code, same guardrails.

**Q: Does Local mode require an EthicalZen account?**
A: No! Fully self-hosted, no account needed.

**Q: Can I customize guardrails in Local mode?**
A: Yes! Edit `ethicalzen-config.json` and add custom guardrails.

**Q: What's the performance difference?**
A: Local mode is typically **faster** (no network latency to our gateway).

**Q: Does Local mode work offline?**
A: Yes! After initial Docker image pull, works 100% offline (except LLM calls).

**Q: Can I use Local mode in production?**
A: Absolutely! That's what it's designed for.

---

**Ready to deploy?**
- 🚀 [Quick Start (SaaS)](./README.md#quick-start)
- 🔒 [Local Deployment](./README.md#local-deployment)

