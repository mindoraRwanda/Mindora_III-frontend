// app/dashboard/jobs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'; // Install: npm install react-hot-toast
import { getJobs, createJob, updateJob, deleteJob } from './action';

interface Job {
  id: number;
  title: string;
  description: string | null;
  requirements: string | null;
  location: string | null;
  type: string | null;
  salary: string | null;
  postedAt: Date;
  isActive: boolean;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<Partial<Job> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const fetchedJobs = await getJobs();
      setJobs(
        fetchedJobs.map((job) => ({
          ...job,
          title: job.title || '',
          description: job.description || null,
          requirements: job.requirements || null,
          location: job.location || null,
          type: job.type || null,
          salary: job.salary || null,
          postedAt: job.postedAt ? new Date(job.postedAt) : new Date(),
          isActive: job.isActive ?? true,
        }))
      );
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    try {
      if (form.id) {
        await updateJob(form.id, {
          title: form.title,
          description: form.description,
          requirements: form.requirements,
          location: form.location,
          type: form.type,
          salary: form.salary,
          isActive: form.isActive,
        });
        toast.success('Job updated successfully');
      } else {
        await createJob({
          title: form.title!,
          description: form.description || null,
          requirements: form.requirements || null,
          location: form.location || null,
          type: form.type || null,
          salary: form.salary || null,
        });
        toast.success('Job created successfully');
      }
      fetchJobs();
      setForm(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    setLoading(true);
    try {
      await deleteJob(id);
      toast.success('Job deleted successfully');
      fetchJobs();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to delete job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-8 bg-stone-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-600">Job Management</h1>
        <button
          onClick={() =>
            setForm({
              id: 0,
              title: '',
              description: '',
              requirements: '',
              location: '',
              type: '',
              salary: '',
              isActive: true,
            })
          }
          className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-md disabled:opacity-50"
          disabled={loading}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Job
        </button>
      </div>

      {/* Jobs List */}
      {loading && !jobs.length ? (
        <div className="flex justify-center items-center h-64">
          <svg className="animate-spin h-8 w-8 text-brand-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-stone-500 text-lg">No jobs found. Start by adding a new job!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-stone-800">{job.title}</h2>
              <p className="text-stone-600 mt-1">
                {job.type || 'N/A'} • {job.location || 'N/A'}
              </p>
              <p className="text-stone-500 text-sm mt-2 line-clamp-2">{job.description || 'No description'}</p>
              <p className="text-stone-500 text-sm mt-1">Salary: {job.salary || 'Not specified'}</p>
              <div className="mt-4 flex items-center gap-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    job.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {job.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => setForm(job)}
                    className="text-brand-600 hover:text-brand-800 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create/Update */}
      {form && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 relative transform transition-all duration-300 scale-100 max-h-screen overflow-y-auto">
            <button
              onClick={() => setForm(null)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-700 transition-colors"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-brand-600 mb-6">
              {form.id ? 'Edit Job' : 'Add Job'}
            </h2>
            <form onSubmit={handleCreateOrUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title || ''}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                <textarea
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent h-24 resize-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Requirements</label>
                <textarea
                  value={form.requirements || ''}
                  onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent h-24 resize-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Location</label>
                <input
                  type="text"
                  value={form.location || ''}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Type</label>
                <input
                  type="text"
                  value={form.type || ''}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Salary</label>
                <input
                  type="text"
                  value={form.salary || ''}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Status</label>
                <select
                  value={form.isActive ? 'true' : 'false'}
                  onChange={(e) => setForm({ ...form, isActive: e.target.value === 'true' })}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setForm(null)}
                  className="px-5 py-2 text-stone-600 hover:text-stone-800 rounded-lg transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>{form.id ? 'Updating...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <span>{form.id ? 'Update' : 'Create'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}