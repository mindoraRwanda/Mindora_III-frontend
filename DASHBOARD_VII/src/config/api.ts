const configuredBase = import.meta.env.VITE_API_BASE_URL?.trim();

// This dashboard was supplied with the legacy REST API route contract.
// Configure this origin for a compatible API gateway; V3 route compatibility
// must be mapped and verified separately before production use.
export const API_BASE_URL = (configuredBase || 'http://localhost:8000').replace(/\/+$/, '');
