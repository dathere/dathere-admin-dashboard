'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart3, Plus, Edit, Trash2, Eye, Calendar, User, Tag } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

interface Story {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories/list');
      const data = await response.json();

      if (data.success) {
        setStories(data.result);
      } else {
        setError(data.error || 'Failed to load stories');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingSlug(slug);

    try {
      const response = await fetch(`/api/stories/delete?slug=${slug}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setStories(stories.filter(s => s.slug !== slug));
        alert('Story deleted successfully!');
      } else {
        alert(data.error || 'Failed to delete story');
      }
    } catch (err) {
      alert('Failed to delete story');
      console.error(err);
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1729]">
      <Sidebar />
      
      <div className="lg:pl-72">
        <main className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Stories & Visualizations</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Create and manage interactive data stories for your portal
                </p>
              </div>
              <Link
                href="/stories/create"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Story
              </Link>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading stories...</p>
              </div>
            ) : stories.length === 0 ? (
              /* Empty State */
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                <BarChart3 className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No stories yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first data story to showcase insights and visualizations
                </p>
                <Link
                  href="/stories/create"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Story
                </Link>
              </div>
            ) : (
              /* Stories Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <div
                    key={story.slug}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                  >
                    <div className="p-6">
                      {/* Story Title */}
                      <h3 className="text-xl font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white">
                        {story.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {story.description || 'No description'}
                      </p>

                      {/* Metadata */}
                      <div className="space-y-2 mb-4 text-xs text-gray-500 dark:text-gray-500">
                        {story.author && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{story.author}</span>
                          </div>
                        )}
                        {story.date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{story.date}</span>
                          </div>
                        )}
                        {story.tags && story.tags.length > 0 && (
                          <div className="flex items-start gap-2">
                            <Tag className="w-4 h-4 mt-0.5" />
                            <div className="flex flex-wrap gap-1">
                              {story.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <a
                          href={`${process.env.NEXT_PUBLIC_PORTALJS_URL}/stories/${story.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </a>
                        <Link
                          href={`/stories/edit/${story.slug}`}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(story.slug, story.title)}
                          disabled={deletingSlug === story.slug}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                        >
                          {deletingSlug === story.slug ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Story Count */}
            {!loading && stories.length > 0 && (
              <div className="mt-8 text-center text-sm text-gray-500">
                Showing {stories.length} {stories.length === 1 ? 'story' : 'stories'}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}