// app/dashboard/service/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'; // Install: npm install react-hot-toast
import {
  Brain,
  Shield,
  Heart,
  Activity,
  Plus,
  X,
  Pencil,
  Trash2,
  LucideIcon,
} from 'lucide-react';
import { getServices, createService, updateService, deleteService } from './action';

interface Service {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  createdAt: Date;
  isActive: boolean;
}

// Map icon names to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  Brain,
  Shield,
  Heart,
  Activity,
};

const availableIcons = ['Brain', 'Shield', 'Heart', 'Activity'];

export default function ServicePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<Partial<Service> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const fetchedServices = await getServices();
      setServices(
        fetchedServices.map((service) => ({
          ...service,
          createdAt: service.createdAt ? new Date(service.createdAt) : new Date(),
          isActive: service.isActive ?? false,
        }))
      );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to load services');
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
        await updateService(form.id, {
          name: form.name,
          description: form.description,
          icon: form.icon,
          isActive: form.isActive,
        });
        toast.success('Service updated successfully');
      } else {
        await createService({
          name: form.name!,
          description: form.description!,
          icon: form.icon || null,
        });
        toast.success('Service created successfully');
      }
      fetchServices();
      setForm(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    setLoading(true);
    try {
      await deleteService(id);
      toast.success('Service deleted successfully');
      fetchServices();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = (iconName: string | null) => {
    if (!iconName || !iconMap[iconName]) return null;
    const IconComponent = iconMap[iconName];
    return <IconComponent className="w-10 h-10 text-white" />;
  };

  return (
    <div className="space-y-8 p-8 bg-stone-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-600">Service Management</h1>
        <button
          onClick={() =>
            setForm({
              id: 0,
              name: '',
              description: '',
              icon: '',
              isActive: true,
            })
          }
          className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-md disabled:opacity-50"
          disabled={loading}
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {/* Services List */}
      {loading && !services.length ? (
        <div className="flex justify-center items-center h-64">
          <svg className="animate-spin h-8 w-8 text-brand-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-stone-500 text-lg">No services found. Start by adding a new service!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="relative bg-gradient-to-b from-stone-800 to-stone-900 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-brand-600 to-calm-500 rounded-full mb-4">
                {renderIcon(service.icon)}
              </div>
              <h2 className="text-xl font-semibold">{service.name}</h2>
              <p className="text-stone-300 text-sm mt-2 line-clamp-3">{service.description}</p>
              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    service.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => setForm(service)}
                    className="p-2 hover:bg-stone-700 rounded-full transition-colors"
                  >
                    <Pencil className="w-5 h-5 text-brand-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 hover:bg-stone-700 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative transform transition-all duration-300 scale-100">
            <button
              onClick={() => setForm(null)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-700 transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-brand-600 mb-6">
              {form.id ? 'Edit Service' : 'Add Service'}
            </h2>
            <form onSubmit={handleCreateOrUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Icon</label>
                <select
                  value={form.icon || ''}
                  onChange={(e) => setForm({ ...form, icon: e.target.value || null })}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                >
                  <option value="">Select an icon</option>
                  {availableIcons.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
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