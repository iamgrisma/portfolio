import { NextResponse } from 'next/server';
import { adminAuth } from '../../../../src/lib/firebase-admin';
import { getOrCreateUser } from '../../../../src/db/users';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Create or update user in Cloud SQL
    const user = await getOrCreateUser(decodedToken.uid, decodedToken.email || '');

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
