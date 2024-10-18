import  connectMongo  from '@/app/lib/mongodb';
import bcrypt from 'bcryptjs';
import User from '@/app/models/User';
import { NextResponse } from 'next/server';
import { createToken,verifyToken } from '@/app/lib/jwt';
import { setTokenCookie } from '@/app/lib/auth';

export async function POST(request: Request) {
  const { name, email, password } = await request.json();
  
  await connectMongo();
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });
  
  const token = createToken(newUser._id.toString());
  const response = NextResponse.json({ message: 'User registered successfully' });
  
  setTokenCookie(response, token);
  return response;
}
