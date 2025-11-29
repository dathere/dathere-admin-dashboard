'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Plus, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Group {
  id: string;
  name: string;
  title: string;
  description?: string;
  image_url?: string;
  package_count: number;
  created: string;
}

export default function GroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups();
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

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/ckan/group_list?all_fields=true');
      const data = await response.json();
      
      if (data.success) {
        setGroups(data.result);
      } else {
        toast.error('Failed to load groups');
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Error loading groups');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (groupName: string) => {
    if (!confirm(`Are you sure you want to delete this group? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch('/api/ckan/group_delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: groupName }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Group deleted successfully');
        fetchGroups();
      } else {
        toast.error(data.error?.message || 'Failed to delete group');
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Error deleting group');
    }
  };

  const filteredGroups = groups.filter(group =>
    group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pb-40">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Groups</h1>
          <p className="text-gray-400">
            Manage groups and their datasets
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Create Button */}
          <Link
            href="/groups/create"
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Group
          </Link>
        </div>

        {/* Groups Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            Loading groups...
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 mb-4">
              {searchQuery ? 'No groups found' : 'No groups yet'}
            </p>
            {!searchQuery && (
              <Link
                href="/groups/create"
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create your first group
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden pb-32">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Name (ID)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Datasets
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredGroups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {group.image_url ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_CKAN_URL}/uploads/group/${group.image_url}`}
                            alt={group.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-600 flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{group.title}</p>
                          {group.description && (
                            <p className="text-sm text-gray-400 truncate max-w-md">
                              {group.description.substring(0, 60)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-sm">
                      {group.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-blue-400">
                        {group.package_count || 0} datasets
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(group.created).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <div className="relative inline-block action-menu-container">
                        <button
                          onClick={() => setOpenActionMenu(openActionMenu === group.id ? null : group.id)}
                          className="p-2 hover:bg-gray-600 rounded"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {openActionMenu === group.id && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                            <a
                              href={`${process.env.NEXT_PUBLIC_PORTALJS_URL}/groups/${group.name}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              View in Portal
                            </a>
                            <Link
                              href={`/groups/${group.name}/edit`}
                              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 text-sm"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(group.name)}
                              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 text-sm text-red-400 w-full text-left"
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
    </div>
  );
}
