// app/api/link-preview/route.ts (用于 App Router)
import { NextResponse } from "next/server";
import ogs from "open-graph-scraper";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  console.log(url);

  if (!url) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  const { result } = await ogs({ url });

  return NextResponse.json({
    title: result.ogTitle || result.dcTitle,
    description: result.ogDescription || result.dcDescription,
    favicon: result.favicon || "/favicon.ico",
  });
}
