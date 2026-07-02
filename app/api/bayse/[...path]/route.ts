import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://relay.bayse.markets";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const apiKey = process.env.NEXT_PUBLIC_BAYSE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "No API key configured" }, { status: 401 });
  }

  const query = request.nextUrl.searchParams.toString();
  const url = `${API_BASE}/${path.join("/")}${query ? `?${query}` : ""}`;

  try {
    const res = await fetch(url, {
      headers: { "X-Public-Key": apiKey },
    });
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json({ ...data, _httpStatus: res.status }, { status: 200 });
    }
    const text = await res.text();
    console.error(`[Bayse API] ${res.status} ${url}: ${text.slice(0, 300)}`);
    return NextResponse.json(
      { error: `Bayse API returned ${res.status}`, detail: text.slice(0, 200) },
      { status: 502 }
    );
  } catch (err) {
    console.error("[Bayse API] Fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch from Bayse API" },
      { status: 502 }
    );
  }
}
