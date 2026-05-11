import { NextRequest, NextResponse } from "next/server";
import { isAdmin, UsuarioCorrecto } from "./lib/spi/administradores";

export const proxy = async (request: NextRequest) => {
    const path = request.nextUrl.pathname;

    const token = request.cookies.get("token")?.value;
    if (path.startsWith("/admin")) {
        if (!token) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        try {
            const admin = await isAdmin({ token });
            if (!admin) {
                return NextResponse.redirect(new URL("/", request.url));
            }
            return NextResponse.next();
        } catch {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }
    if(path.startsWith("/profesores") || path.startsWith("/alumnos")){
        const id = path.split('/')[-1]
        if (!token) {
            return NextResponse.redirect(new URL("/", request.url));
        }
            return NextResponse.next();
    }
};

export const config = {
    matcher: [
        "/admin/:path*",
        "/profesores/:path*",
        "/alumnos/:path*",
    ],
};