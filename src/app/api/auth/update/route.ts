import  connectMongo  from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';

export async function POST(request: Request) {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  const decodedToken = verifyToken(token);
  const { userId } = decodedToken as { userId: string }; // Extract userId
  console.log(userId);
  const { username, email } = await request.json();
  
  await connectMongo();
  
  const user = await User.findByIdAndUpdate(userId, { username, email }, { new: true });
  console.log(user)
  return NextResponse.json({ message: 'User updated', user });
}
