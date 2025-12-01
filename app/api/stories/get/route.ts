import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const PORTALJS_STORIES_PATH = process.env.PORTALJS_STORIES_PATH || '/home/mus/projects/portaljs-fresh-test/content/stories';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ 
        success: false, 
        error: 'Story slug is required' 
      }, { status: 400 });
    }

    const mdxPath = path.join(PORTALJS_STORIES_PATH, slug, 'index.mdx');

    if (!fs.existsSync(mdxPath)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Story not found' 
      }, { status: 404 });
    }

    const fileContent = fs.readFileSync(mdxPath, 'utf-8');
    const { data: metadata, content } = matter(fileContent);

    return NextResponse.json({ 
      success: true, 
      result: {
        slug,
        metadata,
        content
      }
    });

  } catch (error) {
    console.error('Error reading story:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to read story' 
    }, { status: 500 });
  }
}
