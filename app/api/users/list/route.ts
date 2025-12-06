import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const ckanUrl = process.env.CKAN_API_URL || process.env.NEXT_PUBLIC_CKAN_URL;
    const apiKey = process.env.CKAN_API_KEY;

    if (!ckanUrl) {
      return NextResponse.json(
        { success: false, error: 'CKAN URL not configured' },
        { status: 500 }
      );
    }

    // Fetch all users from CKAN
    const response = await fetch(`${ckanUrl}/api/3/action/user_list`, {
      headers: {
        'Authorization': apiKey || '',
      },
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { success: false, error: data.error?.message || 'Failed to fetch users' },
        { status: 400 }
      );
    }

    // Fetch detailed info for each user
    const usersWithDetails = await Promise.all(
      data.result.map(async (user: any) => {
        try {
          const userResponse = await fetch(
            `${ckanUrl}/api/3/action/user_show?id=${user.name}`,
            {
              headers: {
                'Authorization': apiKey || '',
              },
            }
          );
          const userData = await userResponse.json();
          return userData.success ? userData.result : user;
        } catch (err) {
          console.error(`Error fetching details for user ${user.name}:`, err);
          return user;
        }
      })
    );

    return NextResponse.json({
      success: true,
      users: usersWithDetails,
    });
  } catch (error) {
    console.error('Error in user list API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
