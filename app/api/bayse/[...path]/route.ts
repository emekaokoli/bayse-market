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
    const data = res.headers.get("content-type")?.includes("application/json")
      ? await res.json()
      : { error: `Bayse API returned ${res.status}`, detail: await res.text() };
    return NextResponse.json({ _data: data, _httpStatus: res.status }, { status: 200 });
  } catch (err) {
    console.error("[Bayse API] Fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch from Bayse API" },
      { status: 502 }
    );
  }
}
