'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

export default function CreateOrganizationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, name: slug }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Create organization
      const createResponse = await fetch('/api/ckan/organization_create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const createData = await createResponse.json();

      if (!createData.success) {
        throw new Error(createData.error?.message || 'Failed to create organization');
      }

      // 2. Upload image if provided
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('id', formData.name);
        imageFormData.append('image_upload', imageFile);

        const imageResponse = await fetch('/api/ckan/organization_patch', {
          method: 'POST',
          body: imageFormData,
        });

        const imageData = await imageResponse.json();
        console.log('Image upload response:', imageData);
      }

      toast.success('Organization created successfully!');
      setTimeout(() => {
        router.push('/organizations');
      }, 1500);

    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast.error(error.message || 'Failed to create organization');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1729]">
      <Sidebar />
      <Toaster position="top-right" />
      
      <div className="lg:pl-72">
        <main className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/organizations"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Organizations
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Organization</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  placeholder="My Organization"
                />
              </div>

              {/* Name (slug) */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  URL Name (slug) <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-gray-900 dark:text-white"
                  placeholder="my-organization"
                  pattern="[a-z0-9-]+"
                />
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Auto-generated from title. Only lowercase letters, numbers, and hyphens.
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  placeholder="Describe your organization..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Organization Image
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Recommended: Square image, at least 200x200px
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Organization'}
                </button>
                <Link
                  href="/organizations"
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}