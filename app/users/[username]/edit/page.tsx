'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { ArrowLeft, Save, User, Mail, FileText, Calendar, Package } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  fullname?: string;
  about?: string;
  created: string;
  sysadmin: boolean;
  state: string;
  number_created_packages: number;
  last_active?: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const username = params?.username as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    about: '',
  });

  useEffect(() => {
    if (username) {
      fetchUser();
    }
  }, [username]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/show?username=${username}`);
      const data = await response.json();

      if (data.success) {
        setUserData(data.user);
        setFormData({
          fullname: data.user.fullname || '',
          email: data.user.email || '',
          about: data.user.about || '',
        });
      } else {
        setError(data.error || 'Failed to fetch user');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setSaving(true);

      const response = await fetch('/api/users/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('User updated successfully!');
        router.push('/users');
      } else {
        setError(data.error || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f1729]">
        <Sidebar />
        <div className="lg:pl-72">
          <main className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-400">Loading user data...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f1729]">
        <Sidebar />
        <div className="lg:pl-72">
          <main className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
              <Link
                href="/users"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 mt-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Users
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1729]">
      <Sidebar />

      <div className="lg:pl-72">
        <main className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/users"
                className="inline-flex items-center text-gray-400 hover:text-white mb-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Users
              </Link>
              <h1 className="text-3xl font-bold">Edit User</h1>
              <p className="text-gray-400 mt-2">
                Update user information and settings
              </p>
            </div>

            {/* User Info Card */}
            {userData && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">User Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Username</p>
                    <p className="text-white font-medium">@{userData.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Role</p>
                    <p className="text-white font-medium">
                      {userData.sysadmin ? (
                        <span className="text-yellow-400">Administrator</span>
                      ) : (
                        <span className="text-blue-400">Member</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-400">Account Created</p>
                      <p className="text-white">
                        {new Date(userData.created).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-400">Datasets Created</p>
                      <p className="text-white">{userData.number_created_packages}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400">Status</p>
                    <p className="text-white">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          userData.state === 'active'
                            ? 'bg-green-900/30 text-green-300 border border-green-800'
                            : 'bg-red-900/30 text-red-300 border border-red-800'
                        }`}
                      >
                        {userData.state}
                      </span>
                    </p>
                  </div>
                  {userData.last_active && (
                    <div>
                      <p className="text-gray-400">Last Active</p>
                      <p className="text-white">
                        {new Date(userData.last_active).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* Edit Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Card */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </h2>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information Card */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Additional Information
                </h2>

                <div className="space-y-4">
                  {/* About */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      About
                    </label>
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Brief description about the user..."
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
                <Link
                  href="/users"
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
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
