import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { createToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const db = getDb();
    const user = db
      .prepare("SELECT * FROM admin_users WHERE username = ?")
      .get(username) as { id: number; username: string; password: string } | undefined;

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json({ error: "Geçersiz kullanıcı adı veya şifre" }, { status: 401 });
    }

    const token = await createToken(user.id, user.username);
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  return NextResponse.json({ success: true });
}
