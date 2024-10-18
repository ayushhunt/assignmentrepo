import  connectMongo  from '@/app/lib/mongodb';
import { createToken } from '@/app/lib/jwt';
import bcrypt from 'bcryptjs';
import User from '@/app/models/User';
import { NextResponse } from 'next/server';
import { setTokenCookie } from '@/app/lib/auth';


export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  await connectMongo();
  
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
  }

  const token = createToken(user._id.toString());
  const response = NextResponse.json({ message: 'Login successful' });
  
  setTokenCookie(response, token);
  return response;
}
