/**
 * app/api/docs/route.ts
 * 
 * OpenAPI/Swagger 規範端點
 * 用於 Swagger UI 和其他工具訪問 API 文檔
 */

import { openApiSpec } from '@/lib/openapi';

/**
 * GET /api/docs
 * 返回 OpenAPI 3.0 規範 JSON
 */
export async function GET() {
  return Response.json(openApiSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
