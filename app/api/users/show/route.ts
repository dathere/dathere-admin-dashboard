import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    const ckanUrl = process.env.CKAN_API_URL || process.env.NEXT_PUBLIC_CKAN_URL;
    const apiKey = process.env.CKAN_API_KEY;

    if (!ckanUrl) {
      return NextResponse.json(
        { success: false, error: 'CKAN URL not configured' },
        { status: 500 }
      );
    }

    // Fetch user details from CKAN
    const response = await fetch(
      `${ckanUrl}/api/3/action/user_show?id=${username}`,
      {
        headers: {
          'Authorization': apiKey || '',
        },
      }
    );

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { success: false, error: data.error?.message || 'Failed to fetch user' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: data.result,
    });
  } catch (error) {
    console.error('Error in user show API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
