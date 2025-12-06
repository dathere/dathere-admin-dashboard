import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
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
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    // Delete user in CKAN
    const response = await fetch(`${ckanUrl}/api/3/action/user_delete`, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: username }),
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { success: false, error: data.error?.message || 'Failed to delete user' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error in user delete API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
