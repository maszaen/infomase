import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8080/api/v1';

interface RouteContext {
  params: Promise<{ path?: string[] | string }>;
}

async function getPath(context: RouteContext): Promise<string[]> {
  const { path } = await context.params;
  if (Array.isArray(path)) return path;
  if (typeof path === 'string') return [path];
  return [];
}

export async function GET(req: NextRequest, context: RouteContext) {
  return handleProxy(req, await getPath(context));
}

export async function POST(req: NextRequest, context: RouteContext) {
  return handleProxy(req, await getPath(context));
}

export async function PUT(req: NextRequest, context: RouteContext) {
  return handleProxy(req, await getPath(context));
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  return handleProxy(req, await getPath(context));
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  return handleProxy(req, await getPath(context));
}

function proxyError(message: string, status = 502) {
  return NextResponse.json({ success: false, message }, { status });
}

async function handleProxy(req: NextRequest, pathSegments: string[]) {
  const targetUrl = `${BACKEND_BASE}/${pathSegments.join('/')}${req.nextUrl.search}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };

  const authHeader = req.headers.get('authorization');
  if (authHeader) headers['Authorization'] = authHeader;

  const contentType = req.headers.get('content-type');
  let body: BodyInit | undefined;

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (contentType?.includes('multipart/form-data')) {
      body = await req.formData();
    } else {
      if (contentType) headers['Content-Type'] = contentType;
      body = await req.text();
    }
  }

  try {
    const res = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });

    return new NextResponse(await res.text(), {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    });
  } catch (error) {
    // Never echo the upstream URL: it can disclose internal hostnames/ports.
    const timedOut = error instanceof DOMException && error.name === 'TimeoutError';
    console.warn('[proxy] upstream request failed', error instanceof Error ? error.name : 'unknown');
    return proxyError(
      timedOut ? 'Server backend tidak merespons tepat waktu.' : 'Server backend tidak dapat dihubungi.'
    );
  }
}