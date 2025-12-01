'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

interface ChartTemplate {
  name: string;
  code: string;
  description: string;
}

const chartTemplates: ChartTemplate[] = [
  {
    name: 'Bar Chart',
    description: 'Compare categories side by side',
    code: `
<GenericBarChart
  data={[
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 500 }
  ]}
  xKey="name"
  series={[{ key: 'value', name: 'Sales', color: '#0288D1' }]}
/>
`
  },
  {
    name: 'Line Chart',
    description: 'Show trends over time',
    code: `
<GenericLineChart
  data={[
    { month: 'Jan', sales: 400 },
    { month: 'Feb', sales: 300 },
    { month: 'Mar', sales: 500 }
  ]}
  xKey="month"
  yKey="sales"
  name="Revenue"
  color="#0288D1"
/>
`
  },
  {
    name: 'Pie Chart',
    description: 'Show proportions and percentages',
    code: `
<GenericPie
  data={[
    { name: 'Category A', value: 400 },
    { name: 'Category B', value: 300 },
    { name: 'Category C', value: 200 }
  ]}
  nameKey="name"
  valueKey="value"
  colors={["#4CAF50", "#2196F3", "#FF9800"]}
/>
`
  },
  {
    name: 'Area Chart',
    description: 'Filled line chart for trends',
    code: `
<GenericAreaChart
  data={[
    { month: 'Jan', value: 400 },
    { month: 'Feb', value: 300 },
    { month: 'Mar', value: 500 }
  ]}
  xKey="month"
  series={[{ key: 'value', name: 'Growth', color: '#4CAF50' }]}
/>
`
  },
  {
    name: 'Multi-Line Chart',
    description: 'Compare multiple trends',
    code: `
<MultiLineChart
  data={[
    { month: 'Jan', sales: 400, costs: 240 },
    { month: 'Feb', sales: 300, costs: 220 },
    { month: 'Mar', sales: 500, costs: 280 }
  ]}
  xKey="month"
  lines={[
    { key: 'sales', name: 'Sales', color: '#4CAF50' },
    { key: 'costs', name: 'Costs', color: '#FF5722' }
  ]}
/>
`
  },
  {
    name: 'Stacked Bar Chart',
    description: 'Show composition over categories',
    code: `
<StackedBarChart
  data={[
    { category: 'Q1', product_a: 400, product_b: 240 },
    { category: 'Q2', product_a: 300, product_b: 220 },
    { category: 'Q3', product_a: 500, product_b: 280 }
  ]}
  xKey="category"
  series={[
    { key: 'product_a', name: 'Product A', color: '#0288D1' },
    { key: 'product_b', name: 'Product B', color: '#FF9800' }
  ]}
/>
`
  },
  {
    name: 'Combo Chart',
    description: 'Combine bars and lines',
    code: `
<ComboChart
  data={[
    { month: 'Jan', revenue: 400, growth: 20 },
    { month: 'Feb', revenue: 300, growth: 15 },
    { month: 'Mar', revenue: 500, growth: 25 }
  ]}
  xKey="month"
  bars={[{ key: 'revenue', name: 'Revenue', color: '#0288D1' }]}
  lines={[{ key: 'growth', name: 'Growth %', color: '#FF5722' }]}
/>
`
  },
  {
    name: 'Scatter Plot',
    description: 'Show correlation between variables',
    code: `
<ScatterPlot
  data={[
    { x: 100, y: 200 },
    { x: 120, y: 180 },
    { x: 170, y: 240 }
  ]}
  xKey="x"
  yKey="y"
  name="Data Points"
  color="#9C27B0"
/>
`
  },
  {
    name: 'Radar Chart',
    description: 'Compare multiple variables',
    code: `
<RadarChartComponent
  data={[
    { metric: 'Speed', value: 120, benchmark: 110 },
    { metric: 'Quality', value: 98, benchmark: 95 },
    { metric: 'Cost', value: 86, benchmark: 90 }
  ]}
  categories="metric"
  series={[
    { key: 'value', name: 'Actual', color: '#0288D1' },
    { key: 'benchmark', name: 'Benchmark', color: '#FF9800' }
  ]}
/>
`
  },
  {
    name: 'Horizontal Bar',
    description: 'Bars displayed horizontally',
    code: `
<HorizontalBarChart
  data={[
    { name: 'Product A', sales: 400 },
    { name: 'Product B', sales: 300 },
    { name: 'Product C', sales: 500 }
  ]}
  yKey="name"
  series={[{ key: 'sales', name: 'Sales', color: '#4CAF50' }]}
/>
`
  },
  {
    name: 'Funnel Chart',
    description: 'Show conversion stages',
    code: `
<FunnelChartComponent
  data={[
    { stage: 'Visits', value: 1000 },
    { stage: 'Signups', value: 500 },
    { stage: 'Purchases', value: 200 }
  ]}
  nameKey="stage"
  valueKey="value"
/>
`
  },
  {
    name: 'Treemap',
    description: 'Show hierarchical data',
    code: `
<TreemapChart
  data={[
    { name: 'Category A', size: 400 },
    { name: 'Category B', size: 300 },
    { name: 'Category C', size: 200 }
  ]}
  nameKey="name"
  sizeKey="size"
  colors={["#8889DD", "#9597E4", "#8DC77B"]}
/>
`
  }
];

export default function EditStory() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStory();
  }, [slug]);

  const fetchStory = async () => {
    try {
      const response = await fetch(`/api/stories/get?slug=${slug}`);
      const data = await response.json();

      if (data.success) {
        const { metadata, content: storyContent } = data.result;
        setTitle(metadata.title || '');
        setAuthor(metadata.author || '');
        setDescription(metadata.description || '');
        setDate(metadata.date || '');
        setTags(Array.isArray(metadata.tags) ? metadata.tags.join(', ') : '');
        setContent(storyContent || '');
      } else {
        setError(data.error || 'Story not found');
      }
    } catch (err) {
      setError('Failed to load story');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const insertTemplate = (template: ChartTemplate) => {
    setContent(content + '\n\n' + template.code.trim() + '\n\n');
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!author.trim()) {
      setError('Author is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/stories/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          metadata: {
            title,
            author,
            description,
            date: date || new Date().toISOString().split('T')[0],
            tags: tags.split(',').map(t => t.trim()).filter(t => t),
          },
          content
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update story');
        return;
      }

      alert('Story updated successfully!');
      router.push('/stories');
    } catch (err) {
      setError('Failed to connect to server');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f1729]">
        <Sidebar />
        <div className="lg:pl-72 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f1729]">
        <Sidebar />
        <div className="lg:pl-72">
          <main className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">Error</h2>
                <p className="text-red-700 dark:text-red-300">{error}</p>
                <Link
                  href="/stories"
                  className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ← Back to Stories
                </Link>
              </div>
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
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Edit Story</h1>
                <p className="text-gray-400">
                  Update your data story content and visualizations
                </p>
              </div>
              <Link
                href="/stories"
                className="text-gray-400 hover:text-gray-100 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Stories
              </Link>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Story Details */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h2 className="text-xl font-bold mb-4">Story Details</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Author *
                      </label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Date
                      </label>
                      <input
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="03 Nov 2025"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="data, analysis, visualization"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Story Content */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h2 className="text-xl font-bold mb-4">Story Content *</h2>
                  
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={20}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white font-mono text-sm"
                    placeholder="Write your story content using Markdown..."
                  />
                  
                  <p className="text-xs text-gray-400 mt-2">
                    Use Markdown syntax: # for headings, **bold**, *italic*, - for lists, etc.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
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
                    href="/stories"
                    className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Cancel
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 sticky top-4">
                  <h2 className="text-lg font-bold mb-4"> Insert Chart</h2>
                  <p className="text-sm text-gray-400 mb-4">
                    Click to insert chart templates
                  </p>
                  
                  <div className="space-y-3">
                    {chartTemplates.map((template, idx) => (
                      <button
                        key={idx}
                        onClick={() => insertTemplate(template)}
                        className="w-full text-left p-3 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <div className="font-medium mb-1">
                          {template.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {template.description}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-900/20 rounded-lg">
                    <h3 className="font-medium text-blue-200 text-sm mb-2">
                       Markdown Tips
                    </h3>
                    <ul className="text-xs text-blue-300 space-y-1">
                      <li>• # Heading 1</li>
                      <li>• ## Heading 2</li>
                      <li>• **bold text**</li>
                      <li>• *italic text*</li>
                      <li>• - List item</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
