import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
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
    const { username, fullname, email, about } = body;

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    // Build update data - only include fields that are provided
    const updateData: any = {
      id: username,
    };

    if (fullname !== undefined) updateData.fullname = fullname;
    if (email !== undefined) updateData.email = email;
    if (about !== undefined) updateData.about = about;

    // Update user in CKAN using user_patch
    const response = await fetch(`${ckanUrl}/api/3/action/user_patch`, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { success: false, error: data.error?.message || 'Failed to update user' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: data.result,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error in user update API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
