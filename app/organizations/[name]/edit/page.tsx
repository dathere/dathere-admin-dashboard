// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import Link from 'next/link';
// import { ArrowLeft, X, Plus, Search } from 'lucide-react';
// import toast, { Toaster } from 'react-hot-toast';

// interface Dataset {
//   id: string;
//   name: string;
//   title: string;
//   owner_org?: string;
// }

// export default function EditOrganizationPage() {
//   const router = useRouter();
//   const params = useParams();
//   const orgName = params.name as string;

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     id: '',
//     name: '',
//     title: '',
//     description: '',
//   });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [currentImage, setCurrentImage] = useState<string | null>(null);
  
//   // Dataset management
//   const [orgDatasets, setOrgDatasets] = useState<Dataset[]>([]);
//   const [availableDatasets, setAvailableDatasets] = useState<Dataset[]>([]);
//   const [showAddDataset, setShowAddDataset] = useState(false);
//   const [datasetSearch, setDatasetSearch] = useState('');

//   useEffect(() => {
//     fetchOrganization();
//     fetchAvailableDatasets();
//   }, []);

//   const fetchOrganization = async () => {
//     try {
//       const response = await fetch(`/api/ckan/organization_show?id=${orgName}&include_datasets=true`);
//       const data = await response.json();

//       if (data.success) {
//         const org = data.result;
//         setFormData({
//           id: org.id,
//           name: org.name,
//           title: org.title,
//           description: org.description || '',
//         });
//         setCurrentImage(org.image_url || null);
//         setOrgDatasets(org.packages || []);
//       } else {
//         toast.error('Failed to load organization');
//       }
//     } catch (error) {
//       console.error('Error fetching organization:', error);
//       toast.error('Error loading organization');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAvailableDatasets = async () => {
//     try {
//       const response = await fetch('/api/ckan/package_search?rows=1000');
//       const data = await response.json();
      
//       if (data.success) {
//         setAvailableDatasets(data.result.results || []);
//       }
//     } catch (error) {
//       console.error('Error fetching datasets:', error);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImageFile(e.target.files[0]);
//     }
//   };

//   const handleAddDataset = async (datasetId: string) => {
//     try {
//       const response = await fetch('/api/ckan/package_patch', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           id: datasetId,
//           owner_org: formData.id,
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success('Dataset added to organization');
//         fetchOrganization();
//         setShowAddDataset(false);
//         setDatasetSearch('');
//       } else {
//         toast.error('Failed to add dataset');
//       }
//     } catch (error) {
//       console.error('Error adding dataset:', error);
//       toast.error('Error adding dataset');
//     }
//   };

//   const handleRemoveDataset = async (datasetId: string) => {
//     if (!confirm('Remove this dataset from the organization?')) return;

//     try {
//       const response = await fetch('/api/ckan/package_patch', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           id: datasetId,
//           owner_org: null,
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success('Dataset removed from organization');
//         fetchOrganization();
//       } else {
//         toast.error('Failed to remove dataset');
//       }
//     } catch (error) {
//       console.error('Error removing dataset:', error);
//       toast.error('Error removing dataset');
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // 1. Update organization details
//       const updateResponse = await fetch('/api/ckan/organization_patch', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const updateData = await updateResponse.json();

//       if (!updateData.success) {
//         throw new Error(updateData.error?.message || 'Failed to update organization');
//       }

//       // 2. Upload new image if provided
//       if (imageFile) {
//         const imageFormData = new FormData();
//         imageFormData.append('id', formData.name);
//         imageFormData.append('image_upload', imageFile);

//         await fetch('/api/ckan/organization_patch', {
//           method: 'POST',
//           body: imageFormData,
//         });
//       }

//       toast.success('Organization updated successfully!');
//       setTimeout(() => {
//         router.push('/organizations');
//       }, 1500);

//     } catch (error: any) {
//       console.error('Error updating organization:', error);
//       toast.error(error.message || 'Failed to update organization');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const filteredAvailableDatasets = availableDatasets.filter(dataset => 
//     dataset.owner_org !== formData.id &&
//     (dataset.title.toLowerCase().includes(datasetSearch.toLowerCase()) ||
//      dataset.name.toLowerCase().includes(datasetSearch.toLowerCase()))
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
//         <p className="text-gray-400">Loading organization...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8">
//       <Toaster position="top-right" />
      
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <Link
//             href="/organizations"
//             className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Organizations
//           </Link>
//           <h1 className="text-3xl font-bold">Edit Organization</h1>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Organization Info Section */}
//           <div className="bg-gray-800 rounded-lg p-6 space-y-6">
//             <h2 className="text-xl font-semibold mb-4">Organization Information</h2>

//             {/* Title */}
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium mb-2">
//                 Title <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="title"
//                 name="title"
//                 type="text"
//                 required
//                 value={formData.title}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Name (read-only) */}
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium mb-2">
//                 URL Name (slug)
//               </label>
//               <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 disabled
//                 value={formData.name}
//                 className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg font-mono text-sm text-gray-400 cursor-not-allowed"
//               />
//               <p className="mt-1 text-xs text-gray-400">
//                 URL name cannot be changed after creation
//               </p>
//             </div>

//             {/* Description */}
//             <div>
//               <label htmlFor="description" className="block text-sm font-medium mb-2">
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 rows={4}
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Current Image */}
//             {currentImage && (
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Current Image
//                 </label>
//                 <img
//                   src={`${process.env.NEXT_PUBLIC_CKAN_URL}/uploads/group/${currentImage}`}
//                   alt={formData.title}
//                   className="w-32 h-32 object-cover rounded-lg border border-gray-600"
//                 />
//               </div>
//             )}

//             {/* New Image Upload */}
//             <div>
//               <label htmlFor="image" className="block text-sm font-medium mb-2">
//                 {currentImage ? 'Replace Image' : 'Upload Image'}
//               </label>
//               <input
//                 id="image"
//                 name="image"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//               />
//               <p className="mt-1 text-xs text-gray-400">
//                 Leave empty to keep current image
//               </p>
//             </div>
//           </div>

//           {/* Datasets Section */}
//           <div className="bg-gray-800 rounded-lg p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold">Datasets in this Organization</h2>
//               <button
//                 type="button"
//                 onClick={() => setShowAddDataset(!showAddDataset)}
//                 className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add Dataset
//               </button>
//             </div>

//             {/* Add Dataset Panel */}
//             {showAddDataset && (
//               <div className="mb-4 p-4 bg-gray-700 rounded-lg">
//                 <div className="flex items-center gap-2 mb-3">
//                   <Search className="w-4 h-4 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search datasets..."
//                     value={datasetSearch}
//                     onChange={(e) => setDatasetSearch(e.target.value)}
//                     className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="max-h-60 overflow-y-auto space-y-2">
//                   {filteredAvailableDatasets.length === 0 ? (
//                     <p className="text-sm text-gray-400 text-center py-4">
//                       {datasetSearch ? 'No datasets found' : 'All datasets already assigned'}
//                     </p>
//                   ) : (
//                     filteredAvailableDatasets.slice(0, 10).map((dataset) => (
//                       <button
//                         key={dataset.id}
//                         type="button"
//                         onClick={() => handleAddDataset(dataset.id)}
//                         className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-600 rounded text-sm"
//                       >
//                         {dataset.title || dataset.name}
//                       </button>
//                     ))
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Current Datasets */}
//             {orgDatasets.length === 0 ? (
//               <p className="text-gray-400 text-center py-8">
//                 No datasets in this organization yet. Click "Add Dataset" to assign some.
//               </p>
//             ) : (
//               <div className="space-y-2">
//                 {orgDatasets.map((dataset) => (
//                   <div
//                     key={dataset.id}
//                     className="flex items-center justify-between px-4 py-3 bg-gray-700 rounded-lg"
//                   >
//                     <span className="font-medium">{dataset.title || dataset.name}</span>
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveDataset(dataset.id)}
//                       className="p-1 hover:bg-gray-600 rounded text-red-400"
//                       title="Remove from organization"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Submit Buttons */}
//           <div className="flex gap-4 pt-6 border-t border-gray-700">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? 'Saving...' : 'Save Changes'}
//             </button>
//             <Link
//               href="/organizations"
//               className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
//             >
//               Cancel
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, X, Plus, Search } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

interface Dataset {
  id: string;
  name: string;
  title: string;
  owner_org?: string;
}

export default function EditOrganizationPage() {
  const router = useRouter();
  const params = useParams();
  const orgName = params.name as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    title: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  // Dataset management
  const [orgDatasets, setOrgDatasets] = useState<Dataset[]>([]);
  const [availableDatasets, setAvailableDatasets] = useState<Dataset[]>([]);
  const [showAddDataset, setShowAddDataset] = useState(false);
  const [datasetSearch, setDatasetSearch] = useState('');

  useEffect(() => {
    fetchOrganization();
    fetchAvailableDatasets();
  }, []);

  const fetchOrganization = async () => {
    try {
      const response = await fetch(`/api/ckan/organization_show?id=${orgName}&include_datasets=true`);
      const data = await response.json();

      if (data.success) {
        const org = data.result;
        setFormData({
          id: org.id,
          name: org.name,
          title: org.title,
          description: org.description || '',
        });
        setCurrentImage(org.image_url || null);
        setOrgDatasets(org.packages || []);
      } else {
        toast.error('Failed to load organization');
      }
    } catch (error) {
      console.error('Error fetching organization:', error);
      toast.error('Error loading organization');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDatasets = async () => {
    try {
      const response = await fetch('/api/ckan/package_search?rows=1000');
      const data = await response.json();
      
      if (data.success) {
        setAvailableDatasets(data.result.results || []);
      }
    } catch (error) {
      console.error('Error fetching datasets:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddDataset = async (datasetId: string) => {
    try {
      const response = await fetch('/api/ckan/package_patch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: datasetId,
          owner_org: formData.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Dataset added to organization');
        fetchOrganization();
        setShowAddDataset(false);
        setDatasetSearch('');
      } else {
        toast.error('Failed to add dataset');
      }
    } catch (error) {
      console.error('Error adding dataset:', error);
      toast.error('Error adding dataset');
    }
  };

  const handleRemoveDataset = async (datasetId: string) => {
    if (!confirm('Remove this dataset from the organization?')) return;

    try {
      const response = await fetch('/api/ckan/package_patch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: datasetId,
          owner_org: null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Dataset removed from organization');
        fetchOrganization();
      } else {
        toast.error('Failed to remove dataset');
      }
    } catch (error) {
      console.error('Error removing dataset:', error);
      toast.error('Error removing dataset');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Update organization details
      const updateResponse = await fetch('/api/ckan/organization_patch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const updateData = await updateResponse.json();

      if (!updateData.success) {
        throw new Error(updateData.error?.message || 'Failed to update organization');
      }

      // 2. Upload new image if provided
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('id', formData.name);
        imageFormData.append('image_upload', imageFile);

        await fetch('/api/ckan/organization_patch', {
          method: 'POST',
          body: imageFormData,
        });
      }

      toast.success('Organization updated successfully!');
      setTimeout(() => {
        router.push('/organizations');
      }, 1500);

    } catch (error: any) {
      console.error('Error updating organization:', error);
      toast.error(error.message || 'Failed to update organization');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAvailableDatasets = availableDatasets.filter(dataset => 
    dataset.owner_org !== formData.id &&
    (dataset.title.toLowerCase().includes(datasetSearch.toLowerCase()) ||
     dataset.name.toLowerCase().includes(datasetSearch.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1729] flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading organization...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1729]">
      <Sidebar />
      <Toaster position="top-right" />
      
      <div className="lg:pl-72">
        <main className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/organizations"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Organizations
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Organization</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Organization Info Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Organization Information</h2>

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
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Name (read-only) */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    URL Name (slug)
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    disabled
                    value={formData.name}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    URL name cannot be changed after creation
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
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Current Image */}
                {currentImage && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Current Image
                    </label>
                    <img
                      src={`${process.env.NEXT_PUBLIC_CKAN_URL}/uploads/group/${currentImage}`}
                      alt={formData.title}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                )}

                {/* New Image Upload */}
                <div>
                  <label htmlFor="image" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    {currentImage ? 'Replace Image' : 'Upload Image'}
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Leave empty to keep current image
                  </p>
                </div>
              </div>

              {/* Datasets Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Datasets in this Organization</h2>
                  <button
                    type="button"
                    onClick={() => setShowAddDataset(!showAddDataset)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Dataset
                  </button>
                </div>

                {/* Add Dataset Panel */}
                {showAddDataset && (
                  <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search datasets..."
                        value={datasetSearch}
                        onChange={(e) => setDatasetSearch(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {filteredAvailableDatasets.length === 0 ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                          {datasetSearch ? 'No datasets found' : 'All datasets already assigned'}
                        </p>
                      ) : (
                        filteredAvailableDatasets.slice(0, 10).map((dataset) => (
                          <button
                            key={dataset.id}
                            type="button"
                            onClick={() => handleAddDataset(dataset.id)}
                            className="w-full text-left px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-white"
                          >
                            {dataset.title || dataset.name}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Current Datasets */}
                {orgDatasets.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    No datasets in this organization yet. Click "Add Dataset" to assign some.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {orgDatasets.map((dataset) => (
                      <div
                        key={dataset.id}
                        className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">{dataset.title || dataset.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDataset(dataset.id)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-red-600 dark:text-red-400"
                          title="Remove from organization"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
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