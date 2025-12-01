import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const PORTALJS_STORIES_PATH = process.env.PORTALJS_STORIES_PATH || '/home/mus/projects/portaljs-fresh-test/content/stories';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { slug, metadata, content } = body;

    if (!slug || !metadata || !content) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    const storyDir = path.join(PORTALJS_STORIES_PATH, slug);
    const mdxPath = path.join(storyDir, 'index.mdx');

    // Check if story exists
    if (!fs.existsSync(mdxPath)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Story not found' 
      }, { status: 404 });
    }

    // Generate MDX content with frontmatter
    const mdxContent = matter.stringify(content, metadata);

    // Write the file
    fs.writeFileSync(mdxPath, mdxContent, 'utf-8');

    return NextResponse.json({ 
      success: true, 
      slug,
      message: 'Story updated successfully' 
    });

  } catch (error) {
    console.error('Error updating story:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update story' 
    }, { status: 500 });
  }
}
