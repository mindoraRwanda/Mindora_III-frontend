'use client';

import { useEffect, useState } from 'react';
import {
  getStories,
  addStory,
  updateStory,
  deleteStory,
} from './action';

interface SuccessStory {
  id: number;
  text: string;
  author: string;
  role: string;
  createdAt: string;
}

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [form, setForm] = useState<Partial<SuccessStory> | null>(null);

  const fetchStories = async () => {
    const data = await getStories();
    setStories(
      data.map((story) => ({
        ...story,
        text: story.text || '',
        author: story.author || '',
        role: story.role || '',
        createdAt: story.createdAt 
          ? (typeof story.createdAt === 'string' ? story.createdAt : story.createdAt.toISOString()) 
          : '',
      }))
    );
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form) return;

    if (form.id) {
      await updateStory(form.id, {
        text: form.text || '',
        author: form.author || '',
        role: form.role || '',
      });
    } else {
      await addStory({
        text: form.text || '',
        author: form.author || '',
        role: form.role || '',
      });
    }

    setForm(null);
    await fetchStories();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      await deleteStory(id);
      await fetchStories();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-brand-700">Success Stories</h1>
        <button
          onClick={() => setForm({})}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg shadow hover:bg-brand-700 transition"
        >
          + Add Story
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {stories.map((story) => (
          <div
            key={story.id}
            className="bg-white border border-stone-200 rounded-lg shadow-md p-5 space-y-2"
          >
            <p className=" text-lg text-stone-900 italic">“{story.text}”</p>
            <p className="text-sm text-stone-500">
              — {story.author}, <span className="font-medium">{story.role}</span>
            </p>
            <div className="flex space-x-3 mt-2">
              <button
                onClick={() => setForm(story)}
                className="text-brand-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(story.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {form && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg space-y-5">
            <h2 className="text-2xl font-bold text-brand-700">
              {form.id ? 'Edit Story' : 'Add New Story'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-stone-700">Text</label>
                <textarea
                  value={form.text || ''}
                  onChange={(e) =>
                    setForm({ ...form, text: e.target.value })
                  }
                  rows={3}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-brand-600"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-700">Author</label>
                <input
                  type="text"
                  value={form.author || ''}
                  onChange={(e) =>
                    setForm({ ...form, author: e.target.value })
                  }
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-brand-600"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-700">Role</label>
                <input
                  type="text"
                  value={form.role || ''}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-brand-600"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setForm(null)}
                  className="text-stone-600 hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700"
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
