# Education Tutoring Bot - EthicalZen Accelerator

**Status:** ⏳ **Pending Testing**  
**Industry:** Education  
**Compliance:** FERPA, COPPA

A FERPA-compliant education tutor protected by EthicalZen guardrails.

## 🛡️ Active Guardrails

1. **FERPA Compliance** - Protects student education records
2. **Academic Integrity Enforcer** - Prevents direct homework answers
3. **Prompt Injection Detector** - Blocks manipulation attempts
4. **PII Detector** - Prevents student information leakage

## 🚀 Quick Start

```bash
export GROQ_API_KEY="your-groq-key"
docker compose -f docker-compose.test.yml up -d
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Can you explain photosynthesis?"}'
```

See parent README and template guide for full setup instructions.
