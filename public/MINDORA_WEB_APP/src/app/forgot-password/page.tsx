"use client";
import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { forgotPassword } from "@/lib/auth-api";
import { ApiError } from "@/lib/api";
import { MindoraLogo } from "@/components/brand/MindoraLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackLink } from "@/components/public/BackLink";
export default function ForgotPasswordPage() {
  const [email,setEmail]=useState(""); const [busy,setBusy]=useState(false); const [sent,setSent]=useState(false); const [error,setError]=useState<string|null>(null);
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setError(null);if(!z.string().email().safeParse(email).success){setError("Enter a valid email address.");return;}setBusy(true);try{await forgotPassword(email);setSent(true);}catch(err){setError(err instanceof ApiError?err.message:"We could not process that request. Please try again.");}finally{setBusy(false);}}
  return <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-5 py-12"><BackLink fallback="/login" className="mb-6"/><MindoraLogo/><h1 className="mt-8 text-3xl font-bold">Reset your password</h1><p className="mt-2 text-sm text-muted-foreground">Enter the email address associated with your account. We will send a secure, time-limited link if an account exists.</p>{sent?<div role="status" className="mt-6 rounded-xl border border-teal-200 bg-teal-50 p-5 text-sm text-teal-900">If that email exists, a password reset link has been sent. Please check your inbox and spam folder.</div>:<form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-medium" htmlFor="email">Email address</label><Input id="email" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required/>{error?<p role="alert" className="text-sm text-red-600">{error}</p>:null}<Button type="submit" disabled={busy} className="w-full">{busy?"Sending…":"Send reset link"}</Button></form>}<p className="mt-6 text-sm text-muted-foreground">Remembered your password? <Link href="/login" className="font-semibold text-mindora-purple">Sign in</Link></p></main>;
}
