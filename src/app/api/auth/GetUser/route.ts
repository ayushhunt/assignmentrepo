import  connectMongo  from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';

export async function GET(request: Request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedToken = verifyToken(token); // Decode the token
    const { userId } = decodedToken as { userId: string }; // Extract userId

    await connectMongo(); // Ensure DB connection

    const user = await User.findById(userId).select('-password'); // Fetch user details, excluding password

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching user details', error: error.message }, { status: 400 });
  }
}
