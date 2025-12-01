import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Path to PortalJS stories directory
const PORTALJS_STORIES_PATH = process.env.PORTALJS_STORIES_PATH || '/home/mus/projects/portaljs-fresh-test/content/stories';

export async function GET() {
  try {
    // Check if directory exists
    if (!fs.existsSync(PORTALJS_STORIES_PATH)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Stories directory not found' 
      }, { status: 404 });
    }

    // Read all directories in stories folder
    const storyDirs = fs.readdirSync(PORTALJS_STORIES_PATH)
      .filter(item => {
        const fullPath = path.join(PORTALJS_STORIES_PATH, item);
        return fs.statSync(fullPath).isDirectory();
      });

    // Read metadata from each story's index.mdx
    const stories = storyDirs.map(slug => {
      try {
        const mdxPath = path.join(PORTALJS_STORIES_PATH, slug, 'index.mdx');
        
        if (!fs.existsSync(mdxPath)) {
          return null;
        }

        const fileContent = fs.readFileSync(mdxPath, 'utf-8');
        const { data: metadata } = matter(fileContent);

        return {
          slug,
          title: metadata.title || slug,
          description: metadata.description || '',
          author: metadata.author || 'Unknown',
          date: metadata.date || '',
          tags: metadata.tags || [],
        };
      } catch (error) {
        console.error(`Error reading story ${slug}:`, error);
        return null;
      }
    }).filter(Boolean);

    // Sort by date (newest first)
    stories.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json({ 
      success: true, 
      result: stories 
    });

  } catch (error) {
    console.error('Error listing stories:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to list stories' 
    }, { status: 500 });
  }
}
