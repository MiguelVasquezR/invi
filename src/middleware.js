import { NextResponse } from "next/server";

export default function middleware(request) {
  const url = request.nextUrl.clone();
  const cookie = request.cookies.get("id")?.value;

  if (url.pathname === "/") {
    const response = NextResponse.redirect(
      new URL(`/bienvenida?id=${cookie || 0}`, request.url)
    );
    return response;
  }

  return NextResponse.next();
}
