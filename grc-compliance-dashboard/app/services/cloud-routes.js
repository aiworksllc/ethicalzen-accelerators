/**
 * Cloud API route configuration.
 * Paths are loaded from environment variables so the public source
 * does not reveal the backend's internal URL structure.
 * Set these in your .env file (see .env.example).
 */

module.exports = {
  health:           process.env.CLOUD_PATH_HEALTH           || '/health',
  violations:       process.env.CLOUD_PATH_VIOLATIONS       || '/api/dc/violations',
  evidence:         process.env.CLOUD_PATH_EVIDENCE         || '/api/dc/evidence',
  requests:         process.env.CLOUD_PATH_REQUESTS         || '/api/dc/contracts',
  guardrails:       process.env.CLOUD_PATH_GUARDRAILS       || '/api/guardrails/list',
  driftStatus:      process.env.CLOUD_PATH_DRIFT            || '/api/ops/metrics',
  exportOscal:      process.env.CLOUD_PATH_OSCAL            || '/api/dc/evidence',
  exportStix:       process.env.CLOUD_PATH_STIX             || '/api/dc/evidence',
  taxiiDiscovery:   process.env.CLOUD_PATH_TAXII_DISCOVERY  || '/api/v2/grc/export/ethicalzen/',
  taxiiCollections: process.env.CLOUD_PATH_TAXII_COLLECTIONS || '/api/v2/grc/export/ethicalzen/collections/',
  taxiiObjects:     process.env.CLOUD_PATH_TAXII_OBJECTS    || '/api/v2/grc/export/ethicalzen/collections',
  taxiiManifest:    process.env.CLOUD_PATH_TAXII_MANIFEST   || '/api/v2/grc/export/ethicalzen/collections',
  certificates:     process.env.CLOUD_PATH_CERTIFICATES     || '/api/certificates',
};
