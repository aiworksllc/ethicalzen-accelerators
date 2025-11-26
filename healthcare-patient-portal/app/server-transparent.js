// Healthcare Patient Portal - TRANSPARENT PROXY VERSION
// This version uses the new transparent proxy pattern (NO custom headers needed)

const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// TRANSPARENT PROXY CONFIGURATION
// ============================================================================
// Gateway URL with certificate embedded in path
const GATEWAY_URL = process.env.ETHICALZEN_GATEWAY_URL || 'http://gateway:8080';
const CERTIFICATE_ID = process.env.ETHICALZEN_CERTIFICATE_ID || 'demo-healthcare-portal';

// Build transparent proxy URL:
// Format: {gateway}/proxy/{certificate}/{target_service_url}
const OPENAI_TARGET = 'https://api.groq.com/openai/v1';  // Using Groq
const PROXY_BASE_URL = `${GATEWAY_URL}/proxy/${CERTIFICATE_ID}/${OPENAI_TARGET}`;

console.log('🔧 Transparent Proxy Configuration:');
console.log(`   Gateway: ${GATEWAY_URL}`);
console.log(`   Certificate: ${CERTIFICATE_ID}`);
console.log(`   Target: ${OPENAI_TARGET}`);
console.log(`   Proxy URL: ${PROXY_BASE_URL}`);

// ============================================================================
// STANDARD OPENAI CLIENT (with transparent proxy)
// ============================================================================
// This is the ONLY line that makes it use EthicalZen!
// Everything else is standard OpenAI SDK code.

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,  // Your LLM API key (BYOK)
  baseURL: PROXY_BASE_URL             // Point to transparent proxy
});

// ============================================================================
// MAIN CHAT ENDPOINT (Protected by EthicalZen - transparently)
// ============================================================================
app.post('/chat', async (req, res) => {
  try {
    const { message, user_id } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Message is required'
      });
    }

    console.log(`[${new Date().toISOString()}] Chat request from user ${user_id || 'anonymous'}`);
    console.log(`  Input: "${message.substring(0, 100)}..."`);

    const startTime = Date.now();

    // ============================================================================
    // STANDARD OPENAI SDK CALL - No gateway awareness!
    // ============================================================================
    // Gateway transparently validates input, forwards to Groq, validates output
    const completion = await openai.chat.completions.create({
      model: process.env.LLM_MODEL || 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful healthcare assistant. Provide information about general health topics. You MUST NOT provide medical diagnosis or treatment advice.'
        },
        { role: 'user', content: message }
      ]
    });

    const latency = Date.now() - startTime;
    const responseContent = completion.choices[0].message.content;

    console.log(`  ✅ Response received in ${latency}ms`);

    // Return standard response
    res.json({
      response: responseContent,
      metadata: {
        latency_ms: latency,
        timestamp: new Date().toISOString(),
        model: completion.model,
        usage: completion.usage,
        guardrails_applied: true  // Transparent - user knows they're protected
      }
    });

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);

    // Gateway blocks requests/responses with 403
    if (error.status === 403 || error.response?.status === 403) {
      return res.status(403).json({
        error: 'BLOCKED',
        message: 'Request blocked by AI safety policy',
        details: error.response?.data || error.message
      });
    }

    // Other errors
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'An error occurred processing your request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================================================
// UNSAFE ENDPOINT (for comparison - NO guardrails)
// ============================================================================
app.post('/chat/unsafe', async (req, res) => {
  try {
    const { message } = req.body;

    // Create standard OpenAI client WITHOUT proxy
    const unsafeClient = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1'  // Direct to Groq (no gateway)
    });

    const completion = await unsafeClient.chat.completions.create({
      model: process.env.LLM_MODEL || 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful healthcare assistant.'
        },
        { role: 'user', content: message }
      ]
    });

    res.json({
      response: completion.choices[0].message.content,
      warning: 'THIS ENDPOINT HAS NO SAFETY GUARDRAILS - FOR DEMO ONLY',
      metadata: {
        model: completion.model,
        usage: completion.usage
      }
    });

  } catch (error) {
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: error.message
    });
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: require('../package.json').version,
    transparent_proxy: {
      enabled: true,
      gateway: GATEWAY_URL,
      certificate: CERTIFICATE_ID,
      target: OPENAI_TARGET
    },
    llm: {
      provider: 'groq',
      model: process.env.LLM_MODEL || 'llama-3.3-70b-versatile'
    }
  });
});

// ============================================================================
// START SERVER
// ============================================================================
async function startServer() {
  try {
    // Verify LLM API key
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not configured. Please set it in .env');
    }

    // Verify gateway is reachable
    const axios = require('axios');
    try {
      await axios.get(`${GATEWAY_URL}/health`, { timeout: 5000 });
      console.log('✅ EthicalZen Gateway is reachable');
    } catch (err) {
      console.warn(`⚠️  Gateway health check failed: ${err.message}`);
      console.warn('   Continuing anyway - gateway may not be started yet');
    }

    // Start HTTP server
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(70));
      console.log('🏥 Healthcare Patient Portal - TRANSPARENT PROXY MODE');
      console.log('='.repeat(70));
      console.log(`📍 Server: http://localhost:${PORT}`);
      console.log(`🛡️  Protected by: EthicalZen Transparent Proxy`);
      console.log(`🔑 Certificate: ${CERTIFICATE_ID}`);
      console.log(`🚀 LLM Provider: Groq (BYOK)`);
      console.log('='.repeat(70));
      console.log('\n📖 Endpoints:');
      console.log('  POST /chat          - Secure chat (EthicalZen protected)');
      console.log('  POST /chat/unsafe   - Demo endpoint (NO protection)');
      console.log('  GET  /health        - Health check');
      console.log('\n💡 Try it:');
      console.log('  curl -X POST http://localhost:3000/chat \\');
      console.log('    -H "Content-Type: application/json" \\');
      console.log('    -d \'{"message": "What are symptoms of a cold?"}\'');
      console.log('\n🎉 ZERO CUSTOM CODE - Just standard OpenAI SDK!');
      console.log('   Only change: baseURL points to transparent proxy\n');
    });
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    console.log('\n🔍 Troubleshooting:');
    console.log(`  1. Check your .env file has GROQ_API_KEY`);
    console.log(`  2. Verify gateway is running at ${GATEWAY_URL}`);
    console.log(`  3. Verify certificate ${CERTIFICATE_ID} exists`);
    process.exit(1);
  }
}

startServer();

