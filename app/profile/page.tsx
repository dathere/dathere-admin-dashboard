'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { User, Mail, Calendar, Package, Shield, Edit, ArrowLeft } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  fullname?: string;
  email: string;
  created: string;
  sysadmin: boolean;
  state: string;
  number_created_packages: number;
  last_active?: string;
  about?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      // Get current logged-in user
      const sessionResponse = await fetch('/api/auth/me');
      const sessionData = await sessionResponse.json();

      if (!sessionData.success) {
        router.push('/login');
        return;
      }

      // Fetch detailed user info
      const userResponse = await fetch(`/api/users/show?username=${sessionData.user.name}`);
      const userData = await userResponse.json();

      if (userData.success) {
        setUserData(userData.user);
      } else {
        setError(userData.error || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1729]">
        <Sidebar />
        <div className="lg:pl-72">
          <main className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading profile...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1729]">
        <Sidebar />
        <div className="lg:pl-72">
          <main className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200">{error || 'Failed to load profile'}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1729]">
      <Sidebar />

      <div className="lg:pl-72">
        <main className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    View and manage your account information
                  </p>
                </div>
                <Link
                  href={`/users/${userData.name}/edit`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-6">
              <div className="flex items-center gap-6 mb-6">
                {/* Avatar */}
                <div className="flex-shrink-0 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  {userData.sysadmin ? (
                    <Shield className="w-12 h-12 text-white" />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {userData.fullname || userData.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">@{userData.name}</p>
                  <div className="flex items-center gap-2">
                    {userData.sysadmin ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-800">
                        <Shield className="w-4 h-4 mr-1" />
                        Administrator
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                        <User className="w-4 h-4 mr-1" />
                        Member
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        userData.state === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-800'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800'
                      }`}
                    >
                      {userData.state}
                    </span>
                  </div>
                </div>
              </div>

              {/* About */}
              {userData.about && (
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">About</h3>
                  <p className="text-gray-900 dark:text-white">{userData.about}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white font-medium">{userData.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {new Date(userData.created).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Datasets Created</p>
                    <p className="text-gray-900 dark:text-white font-medium">{userData.number_created_packages}</p>
                  </div>
                </div>

                {userData.last_active && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Last Active</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {new Date(userData.last_active).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Datasets</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{userData.number_created_packages}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Role</h3>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {userData.sysadmin ? 'Administrator' : 'Member'}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</h3>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white capitalize">{userData.state}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}