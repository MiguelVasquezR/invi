import { NextResponse } from "next/server";

export default async function middleware(request) {
  console.log("Middleware ejecutado");
  const response = NextResponse.next();

  const lang = request.nextUrl.searchParams.get("id");
  if (lang) {
    response.cookies.set("lang", lang, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
    });
    console.log("✅ Cookie lang establecida:", lang);
  }

  return response;
}
