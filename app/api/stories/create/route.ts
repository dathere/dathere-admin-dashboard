import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const PORTALJS_STORIES_PATH = process.env.PORTALJS_STORIES_PATH || '/home/mus/projects/portaljs-fresh-test/content/stories';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, metadata, content } = body;

    if (!slug || !metadata || !content) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.' 
      }, { status: 400 });
    }

    const storyDir = path.join(PORTALJS_STORIES_PATH, slug);

    // Check if story already exists
    if (fs.existsSync(storyDir)) {
      return NextResponse.json({ 
        success: false, 
        error: 'A story with this slug already exists' 
      }, { status: 409 });
    }

    // Create story directory
    fs.mkdirSync(storyDir, { recursive: true });

    // Generate MDX content with frontmatter
    const mdxContent = matter.stringify(content, metadata);

    // Write the index.mdx file
    const mdxPath = path.join(storyDir, 'index.mdx');
    fs.writeFileSync(mdxPath, mdxContent, 'utf-8');

    return NextResponse.json({ 
      success: true, 
      slug,
      message: 'Story created successfully' 
    });

  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create story' 
    }, { status: 500 });
  }
}
