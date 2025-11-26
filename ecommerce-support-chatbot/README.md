# E-Commerce Support Chatbot - EthicalZen Accelerator

**Status:** ⏳ **Pending Testing**  
**Industry:** E-Commerce  
**Compliance:** PCI-DSS, GDPR, CCPA

A customer support chatbot for e-commerce protected by EthicalZen guardrails.

## 🛡️ Active Guardrails

1. **PCI Compliance** - Prevents payment information exposure
2. **Scam Link Detector** - Blocks phishing/malicious links
3. **Prompt Injection Detector** - Blocks manipulation attempts
4. **PII Detector** - Prevents customer information leakage

## 🚀 Quick Start

```bash
export GROQ_API_KEY="your-groq-key"
docker compose -f docker-compose.test.yml up -d
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I track my order?"}'
```

See parent README and template guide for full setup instructions.
