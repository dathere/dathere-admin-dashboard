import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const ckanUrl = process.env.CKAN_API_URL || process.env.NEXT_PUBLIC_CKAN_URL;
    const apiKey = process.env.CKAN_API_KEY;

    if (!ckanUrl || !apiKey) {
      return NextResponse.json(
        { success: false, error: 'CKAN configuration missing' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, password, fullname, about, sysadmin } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Create user in CKAN
    const userData: any = {
      name,
      email,
      password,
    };

    // Add optional fields if provided
    if (fullname) userData.fullname = fullname;
    if (about) userData.about = about;
    if (sysadmin !== undefined) userData.sysadmin = sysadmin;

    const response = await fetch(`${ckanUrl}/api/3/action/user_create`, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { success: false, error: data.error?.message || 'Failed to create user' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: data.result,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Error in user create API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
