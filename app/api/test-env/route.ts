import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    stripeKeyExists: !!process.env.STRIPE_SECRET_KEY,
    publicKeyExists: !!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
  });
}