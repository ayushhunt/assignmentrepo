import  connectMongo  from '@/app/lib/mongodb';
import { verifyToken } from '@/app/lib/jwt';
import User from '@/app/models/User';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function DELETE(request: Request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedToken = verifyToken(token); // Decode the token
    const { userId } = decodedToken as { userId: string }; // Extract userId

    // Ensure userId is a valid ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    await connectMongo(); // Ensure DB connection

    const user = await User.findByIdAndDelete(objectId); // Delete user by ID

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting user', error: error.message }, { status: 400 });
  }
}
