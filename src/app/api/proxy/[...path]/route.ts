import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://elvin-affectional-edwardo.ngrok-free.dev/wedding_digital/api/v1';


async function getPath(context: any): Promise<string[]> {
  try {
    const resolved = await Promise.resolve(context?.params);
    if (Array.isArray(resolved?.path)) return resolved.path;
    if (typeof resolved?.path === 'string') return [resolved.path];
    return [];
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest, context: any) {
  const path = await getPath(context);
  return handleProxy(req, path);
}

export async function POST(req: NextRequest, context: any) {
  const path = await getPath(context);
  return handleProxy(req, path);
}

export async function PUT(req: NextRequest, context: any) {
  const path = await getPath(context);
  return handleProxy(req, path);
}

export async function DELETE(req: NextRequest, context: any) {
  const path = await getPath(context);
  return handleProxy(req, path);
}

async function handleProxy(req: NextRequest, pathSegments: string[]) {
  const subPath = pathSegments.join('/');
  const searchParams = req.nextUrl.search;
  const targetUrl = `${BACKEND_BASE}/${subPath}${searchParams}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };

  const authHeader = req.headers.get('authorization');
  if (authHeader) headers['Authorization'] = authHeader;

  const contentType = req.headers.get('content-type');
  if (contentType && !contentType.includes('multipart/form-data')) {
    headers['Content-Type'] = contentType;
  }

  let body: any = undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (contentType?.includes('multipart/form-data')) {
      body = await req.formData();
    } else {
      body = await req.text();
    }
  }

  try {
    const res = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    });

    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: `Proxy error to backend: ${err.message}`,
        targetUrl,
      },
      { status: 502 }
    );
  }
}
