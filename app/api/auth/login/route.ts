import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const ckanUrl = process.env.CKAN_API_URL || process.env.NEXT_PUBLIC_CKAN_URL;

    if (!ckanUrl) {
      return NextResponse.json(
        { success: false, error: 'CKAN URL not configured' },
        { status: 500 }
      );
    }

    // Verify credentials by trying to get user info with basic auth
    const authString = Buffer.from(`${username}:${password}`).toString('base64');
    
    const response = await fetch(`${ckanUrl}/api/3/action/user_show?id=${username}`, {
      headers: {
        'Authorization': `Basic ${authString}`,
      },
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const user = data.result;

    // Create session data
    const sessionData = {
      id: user.id,
      name: user.name,
      fullname: user.fullname || user.name,
      email: user.email,
      sysadmin: user.sysadmin,
    };

    // Set secure cookie with session data
    const cookieStore = await cookies();
    cookieStore.set('user_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: sessionData,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
