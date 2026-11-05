'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Linkedin,
  Twitter,
  Mail,
  Pencil,
  Trash2,
  Plus,
  X,
  Upload,
} from 'lucide-react';
import { toast } from 'react-hot-toast'; // Ensure installed: npm install react-hot-toast

// Import server actions (assumed to exist in './action')
import { 
  getTeamMembers, 
  createTeamMember, 
  updateTeamMember, 
  deleteTeamMember 
} from './action';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  description: string;
  imageUrl?: string;
}

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dnbyb192d';
const CLOUDINARY_UPLOAD_PRESET = 'mindora-images'; 

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [form, setForm] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const data = await getTeamMembers();
      setTeam(
        data.map((member) => ({
          ...member,
          name: member.name || '',
          role: member.role || '',
          bio: member.bio || '',
          description: member.description || '',
          imageUrl: member.imageUrl || '',
        }))
      );
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
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
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      if (!response.ok) throw new Error('Image upload failed');
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) imageUrl = await uploadImage(imageFile);
      const memberData = { ...form, imageUrl };
      
      if (form.id) {
        await updateTeamMember(form.id, memberData);
        toast.success('Team member updated successfully');
      } else {
        await createTeamMember(memberData);
        toast.success('Team member added successfully');
      }
      fetchTeamMembers();
      setForm(null);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    setLoading(true);
    try {
      await deleteTeamMember(id);
      toast.success('Team member deleted successfully');
      fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-600">Team Management</h1>
        <button
          onClick={() => setForm({ id: 0, name: '', role: '', bio: '', description: '', imageUrl: '' })}
          className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-md disabled:opacity-50"
          disabled={loading}
        >
          <Plus className="w-5 h-5" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Team List */}
      {loading && !team.length ? (
        <div className="flex justify-center items-center h-64">
          <svg className="animate-spin h-8 w-8 text-brand-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : team.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-stone-500 text-lg">No team members found. Start by adding your first member!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={member.imageUrl || 'https://via.placeholder.com/150'}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => {
                      setForm(member);
                      setImagePreview(member.imageUrl || null);
                    }}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-stone-100 transition-colors"
                    title="Edit"
                    disabled={loading}
                  >
                    <Pencil className="w-5 h-5 text-brand-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-stone-100 transition-colors"
                    title="Delete"
                    disabled={loading}
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold text-stone-800">{member.name}</h2>
                <p className="text-brand-600 font-medium">{member.role}</p>
                <p className="mt-2 text-stone-600 text-sm italic">{member.bio}</p>
                <p className="mt-2 text-stone-700 text-sm line-clamp-3">{member.description}</p>
                <div className="mt-4 flex gap-4 text-stone-500">
                  <Linkedin className="w-5 h-5 hover:text-brand-600 cursor-pointer transition-colors" />
                  <Twitter className="w-5 h-5 hover:text-brand-600 cursor-pointer transition-colors" />
                  <Mail className="w-5 h-5 hover:text-brand-600 cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create/Update */}
      {form && (
        <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative transform transition-all duration-300 scale-100 max-h-screen overflow-y-auto">
            <button
              onClick={() => {
                setForm(null);
                setImageFile(null);
                setImagePreview(null);
              }}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-700 transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-brand-600 mb-6">
              {form.id ? 'Edit Team Member' : 'Add Team Member'}
            </h2>
            <form onSubmit={handleCreateOrUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Role</label>
                <input
                  type="text"
                  placeholder="Job Title"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Short Bio</label>
                <input
                  type="text"
                  placeholder="One-line bio"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                <textarea
                  placeholder="Full professional background"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent h-32 resize-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Profile Image</label>
                <div
                  className="border-2 border-dashed border-stone-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 transition-colors"
                  onClick={triggerFileInput}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-full"
                    />
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-stone-400" />
                      <p className="text-sm text-stone-500 mt-2">Upload or click to select an image</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                </div>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="mt-2 text-red-600 hover:underline text-sm"
                  >
                    Remove Image
                  </button>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setForm(null);
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="px-5 py-2 text-stone-600 hover:text-stone-800 rounded-lg transition-colors"
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