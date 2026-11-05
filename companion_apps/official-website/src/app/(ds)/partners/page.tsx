'use client';

import { useState, useRef, useEffect } from 'react';
import { Pencil, Trash2, Plus, X, Upload, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner,
} from './action'; // Make sure these are implemented

interface Partner {
  id: number;
  name: string;
  image?: string | null;
}

const CLOUDINARY_CLOUD_NAME = 'dnbyb192d';
const CLOUDINARY_UPLOAD_PRESET = 'mindora-images';

export default function PartnerPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [form, setForm] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const data = await getPartners();
      setPartners(data.map(partner => ({
        ...partner,
        name: partner.name || '', // Ensure name is a non-null string
      })));
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch partners');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Image upload failed');
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);

    try {
      let image = form.image;
      if (imageFile) image = await uploadImage(imageFile);
      const partnerData = { ...form, image };

      if (form.id) {
        await updatePartner(form.id, { ...partnerData, image: partnerData.image || undefined });
        toast.success('Partner updated');
      } else {
        await createPartner({ ...partnerData, image: partnerData.image || undefined });
        toast.success('Partner added');
      }

      fetchPartners();
      setForm(null);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this partner?')) return;
    setLoading(true);
    try {
      await deletePartner(id);
      toast.success('Partner deleted');
      fetchPartners();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const copyImageLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Image URL copied to clipboard');
  };

  return (
    <div className="p-8 space-y-8 bg-stone-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-600">Partners Management</h1>
        <button
          onClick={() => setForm({ id: 0, name: '', image: '' })}
          className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-brand-700 disabled:opacity-50 transition-colors"
          disabled={loading}
        >
          <Plus className="w-5 h-5" />
          <span>Add Partner</span>
        </button>
      </div>

      {/* Loading state */}
      {loading && partners.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      )}

      {/* Empty state */}
      {!loading && partners.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <ImageIcon className="mx-auto h-16 w-16 text-stone-300" />
          <h3 className="mt-4 text-lg font-medium text-stone-900">No partners yet</h3>
          <p className="mt-2 text-stone-500">Get started by adding your first partner.</p>
          <button
            onClick={() => setForm({ id: 0, name: '', image: '' })}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Partner
          </button>
        </div>
      )}

      {/* List */}
      {partners.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
              <div className="relative h-56 bg-stone-100">
                {partner.image ? (
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-stone-300" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-stone-800">{partner.name}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setForm(partner);
                        setImagePreview(partner.image || null);
                      }}
                      className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors"
                      title="Edit partner"
                    >
                      <Pencil className="w-4 h-4 text-brand-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(partner.id)}
                      className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors"
                      title="Delete partner"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                
                {partner.image && (
                  <div className="mt-4 flex items-center">
                    <span className="text-xs text-stone-500 truncate flex-1 mr-2" title={partner.image}>
                      {partner.image}
                    </span>
                    <button
                      onClick={() => copyImageLink(partner.image!)}
                      className="p-1.5 bg-stone-100 rounded hover:bg-stone-200 transition-colors"
                      title="Copy image URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-brand-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {form && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative space-y-6">
            <button
              onClick={() => {
                setForm(null);
                setImageFile(null);
                setImagePreview(null);
              }}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-brand-600">
              {form.id ? 'Edit Partner' : 'Add Partner'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter partner name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Image</label>
                <div className="mt-2 flex flex-col space-y-4">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </button>

                  </div>
                  
                  {imagePreview && (
                    <div className="relative w-full h-40 bg-stone-100 rounded-lg overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                          if (!form.id) setForm({ ...form, image: '' });
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setForm(null);
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="flex-1 py-3 border border-stone-300 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : form.id ? 'Update Partner' : 'Create Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}