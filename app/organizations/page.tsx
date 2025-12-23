'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { Building2, Plus, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Organization {
  id: string;
  name: string;
  title: string;
  description?: string;
  image_url?: string;
  package_count: number;
  created: string;
}

export default function OrganizationsPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.action-menu-container')) {
        setOpenActionMenu(null);
      }
    };

    if (openActionMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openActionMenu]);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/ckan/organization_list?all_fields=true');
      const data = await response.json();
      
      if (data.success) {
        setOrganizations(data.result);
      } else {
        toast.error('Failed to load organizations');
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast.error('Error loading organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orgName: string) => {
    if (!confirm(`Are you sure you want to delete this organization? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch('/api/ckan/organization_delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orgName }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Organization deleted successfully');
        fetchOrganizations(); // Refresh list
      } else {
        toast.error(data.error?.message || 'Failed to delete organization');
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
      toast.error('Error deleting organization');
    }
  };

  const filteredOrganizations = organizations.filter(org =>
    org.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1729]">
      <Sidebar />
      <Toaster position="top-right" />
      
      <div className="lg:pl-72">
        <main className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Organizations</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage organizations and their datasets
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search organizations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Create Button */}
              <Link
                href="/organizations/create"
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
              >
                <Plus className="w-5 h-5" />
                Create Organization
              </Link>
            </div>

            {/* Organizations Table */}
            {loading ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                Loading organizations...
              </div>
            ) : filteredOrganizations.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery ? 'No organizations found' : 'No organizations yet'}
                </p>
                {!searchQuery && (
                  <Link
                    href="/organizations/create"
                    className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
                  >
                    <Plus className="w-5 h-5" />
                    Create your first organization
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 pb-32">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Organization
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Name (ID)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Datasets
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredOrganizations.map((org) => (
                      <tr key={org.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {org.image_url ? (
                              <img
                                src={`${process.env.NEXT_PUBLIC_CKAN_URL}/uploads/group/${org.image_url}`}
                                alt={org.title}
                                className="w-10 h-10 rounded object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{org.title}</p>
                              {org.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-md">
                                  {org.description.substring(0, 60)}...
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-mono text-sm">
                          {org.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            {org.package_count || 0} datasets
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                          {new Date(org.created).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right relative">
                          <div className="relative inline-block action-menu-container">
                            <button
                              onClick={() => setOpenActionMenu(openActionMenu === org.id ? null : org.id)}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-white"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>

                            {openActionMenu === org.id && (
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                                <a
                                  href={`${process.env.NEXT_PUBLIC_PORTALJS_URL}/@${org.name}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-white"
                                >
                                  <Eye className="w-4 h-4" />
                                  View in Portal
                                </a>
                                <Link
                                  href={`/organizations/${org.name}/edit`}
                                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-white"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </Link>
                                <button
                                  onClick={() => handleDelete(org.name)}
                                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-red-600 dark:text-red-400 w-full text-left"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}