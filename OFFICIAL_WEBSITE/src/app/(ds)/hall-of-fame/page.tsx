'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react';

import {
  getHallOfFame,
  createHallOfFame,
  updateHallOfFame,
  deleteHallOfFame
} from './action';

interface FameEntry {
  id: number;
  name: string;
  role: string;
  image?: string;
}

const CLOUDINARY_CLOUD_NAME = 'dnbyb192d';
const CLOUDINARY_UPLOAD_PRESET = 'mindora-images';

export default function HallOfFamePage() {
  const [fame, setFame] = useState<FameEntry[]>([]);
  const [form, setForm] = useState<FameEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFameEntries();
  }, []);

  const fetchFameEntries = async () => {
    try {
      setLoading(true);
      const data = await getHallOfFame();
      setFame(
        data.map((entry) => ({
          ...entry,
          name: entry.name ?? '',
          role: entry.role ?? '',
          image: entry.image ?? '',
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error('Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select an image file');
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

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Image upload failed');
    const data = await response.json();
    return data.secure_url;
  };

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    try {
      let image = form.image;
      if (imageFile) {
        image = await uploadImage(imageFile);
      }

      const payload = { ...form, image };

      if (form.id) {
        await updateHallOfFame(form.id, payload);
        toast.success('Entry updated');
      } else {
        await createHallOfFame(payload);
        toast.success('Entry added');
      }

      setForm(null);
      setImageFile(null);
      setImagePreview(null);
      fetchFameEntries();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    setLoading(true);
    try {
      await deleteHallOfFame(id);
      toast.success('Entry deleted');
      fetchFameEntries();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-600">Hall of Fame</h1>
        <button
          className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2 rounded-md hover:bg-brand-700"
          onClick={() =>
            setForm({ id: 0, name: '', role: '', image: '' })
          }
        >
          <Plus className="w-5 h-5" />
          Add Entry
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fame.map((entry) => (
          <div key={entry.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg text-center">
            <img
              src={entry.image || 'https://via.placeholder.com/100'}
              alt={entry.name}
              className="w-24 h-24 rounded-full mx-auto object-cover"
            />
            <h2 className="mt-4 text-xl font-semibold text-stone-800">{entry.name}</h2>
            <p className="text-stone-600">{entry.role}</p>
            <div className="mt-4 space-x-4">
              <button onClick={() => setForm(entry)}>
                <Pencil className="inline w-5 h-5 text-brand-600 hover:scale-110 transition-transform" />
              </button>
              <button onClick={() => handleDelete(entry.id)}>
                <Trash2 className="inline w-5 h-5 text-red-500 hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {form && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4 relative">
            <button
              onClick={() => setForm(null)}
              className="absolute top-3 right-3 text-stone-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-brand-600 mb-2">
              {form.id ? 'Edit Entry' : 'Add Entry'}
            </h2>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div>
                <label className="block text-stone-700 font-medium">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-brand-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-medium">Role</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-brand-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-medium">Image</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-brand-600 text-white px-3 py-1 rounded-md hover:bg-brand-700"
                  >
                    <Upload className="w-4 h-4 inline mr-1" />
                    Upload
                  </button>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700"
                  disabled={loading}
                >
                  {form.id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
