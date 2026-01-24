//
//  route.ts
//
//
//  Created by Şükrü Uyanık on 24.01.26.
//


import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('session');
  return response;
}
