'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { ArrowLeft, Save, User, Mail, Lock, FileText } from 'lucide-react';

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    fullname: '',
    about: '',
    sysadmin: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Username, email, and password are required');
      return;
    }

    // Username validation (alphanumeric, lowercase, hyphens, underscores)
    const usernameRegex = /^[a-z0-9_-]+$/;
    if (!usernameRegex.test(formData.name)) {
      setError('Username can only contain lowercase letters, numbers, hyphens, and underscores');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('User created successfully!');
        router.push('/users');
      } else {
        setError(data.error || 'Failed to create user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1729]">
      <Sidebar />

      <div className="lg:pl-72">
        <main className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/users"
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Users
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New User</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Add a new user account to your data portal
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                  <User className="w-5 h-5" />
                  Basic Information
                </h2>

                <div className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="johndoe"
                      className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Lowercase letters, numbers, hyphens, and underscores only
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Minimum 8 characters
                    </p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                  <FileText className="w-5 h-5" />
                  Additional Information
                </h2>

                <div className="space-y-4">
                  {/* About */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                      About
                    </label>
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Brief description about the user..."
                      className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Permissions Card - Commented out until authentication is implemented */}
              {/* 
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                  <Shield className="w-5 h-5" />
                  Permissions
                </h2>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="sysadmin"
                    id="sysadmin"
                    checked={formData.sysadmin}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="sysadmin" className="text-sm font-medium text-gray-900 dark:text-gray-300">
                    System Administrator
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 ml-7">
                  Admins have full access to all datasets, organizations, and settings
                </p>
              </div>
              */}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Create User
                    </>
                  )}
                </button>
                <Link
                  href="/users"
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
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