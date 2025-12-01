import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PORTALJS_STORIES_PATH = process.env.PORTALJS_STORIES_PATH || '/home/mus/projects/portaljs-fresh-test/content/stories';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ 
        success: false, 
        error: 'Story slug is required' 
      }, { status: 400 });
    }

    const storyPath = path.join(PORTALJS_STORIES_PATH, slug);

    // Check if story exists
    if (!fs.existsSync(storyPath)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Story not found' 
      }, { status: 404 });
    }

    // Delete the entire story directory
    fs.rmSync(storyPath, { recursive: true, force: true });

    return NextResponse.json({ 
      success: true, 
      message: 'Story deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete story' 
    }, { status: 500 });
  }
}
