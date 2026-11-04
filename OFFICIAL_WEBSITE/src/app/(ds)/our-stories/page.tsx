'use client';

import { useState, useRef, useEffect } from 'react';
import { Pencil, Trash2, Plus, X, Upload, Image as ImageIcon, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  ArticleData,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  EventData,
  getTags,
  TagData
} from './action';

const CLOUDINARY_CLOUD_NAME = 'dnbyb192d';
const CLOUDINARY_UPLOAD_PRESET = 'mindora-images';

const ARTICLE_CATEGORIES: ArticleData['category'][] = [
  'Innovation',
  'Industry Insights',
  'Impact',
  'Company News',
  'Research',
  'Events',
];

const EVENT_TYPES: EventData['eventType'][] = [
  'Webinar',
  'Conference',
  'Workshop',
  'Summit',
  'Meetup',
  'Virtual Event',
  'In-Person',
];

export default function ArticlesAndEventsDashboard() {
  const [activeTab, setActiveTab] = useState<'articles' | 'events'>('articles');
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [filteredItems, setFilteredItems] = useState<(ArticleData | EventData)[]>([]);
  const [form, setForm] = useState<Partial<ArticleData | EventData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [availableTags, setAvailableTags] = useState<TagData[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchArticles();
    fetchEvents();
    fetchTags();
  }, []);

  useEffect(() => {
    filterItems();
  }, [articles, events, activeTab, searchTerm, filterStatus]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles({ published: null });
      setArticles(data);
      if (activeTab === 'articles') setFilteredItems(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents({ published: null });
      setEvents(data);
      if (activeTab === 'events') setFilteredItems(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const tagsData = await getTags();
      setAvailableTags(tagsData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch tags');
    }
  };

  const filterItems = () => {
    const items = activeTab === 'articles' ? articles : events;
    let filtered = [...items];
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(term) || 
        item.description?.toLowerCase().includes(term) ||
        ('category' in item ? item.category : item.eventType)?.toLowerCase().includes(term)
      );
    }
    
    if (filterStatus === 'published') {
      filtered = filtered.filter(item => item.isPublished);
    } else if (filterStatus === 'draft') {
      filtered = filtered.filter(item => !item.isPublished);
    }
    
    setFilteredItems(filtered);
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

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Image upload failed');
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Image upload failed. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);

    try {
      let imageUrl = form.imageUrl;
      if (imageFile) imageUrl = await uploadImage(imageFile);
      const slug = form.slug || form.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '';

      if (activeTab === 'articles') {
        const articleData: ArticleData = {
          title: form.title || '',
          slug: slug,
          description: form.description || '',
          content: form.content || '',
          imageUrl: imageUrl || '',
          category: (form as ArticleData).category || ('' as ArticleData['category']),
          isFeatured: form.isFeatured || false,
          isPublished: form.isPublished || false,
          tags: selectedTagIds,
        };

        if (form.id) {
          await updateArticle(form.id, articleData);
          toast.success('Article updated successfully');
        } else {
          await createArticle(articleData);
          toast.success('Article created successfully');
        }
        fetchArticles();
      } else {
        const eventData: EventData = {
          title: form.title || '',
          slug: slug,
          description: form.description || '',
          content: (form as EventData).content || undefined,
          imageUrl: imageUrl || undefined,
          startDate: (form as EventData).startDate || new Date(),
          endDate: (form as EventData).endDate || undefined,
          eventType: (form as EventData).eventType || ('' as EventData['eventType']),
          location: (form as EventData).location || undefined,
          venue: (form as EventData).venue || undefined,
          isVirtual: (form as EventData).isVirtual || false,
          registrationUrl: (form as EventData).registrationUrl || undefined,
          speakers: (form as EventData).speakers || undefined,
          isFeatured: form.isFeatured || false,
          isPublished: form.isPublished || false,
        };

        if (form.id) {
          await updateEvent(form.id, eventData);
          toast.success('Event updated successfully');
        } else {
          await createEvent(eventData);
          toast.success('Event created successfully');
        }
        fetchEvents();
      }

      setForm(null);
      setImageFile(null);
      setImagePreview(null);
      setSelectedTagIds([]);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab === 'articles' ? 'article' : 'event'}? This action cannot be undone.`)) return;
    setLoading(true);
    try {
      if (activeTab === 'articles') {
        await deleteArticle(id);
        toast.success('Article deleted successfully');
        fetchArticles();
      } else {
        await deleteEvent(id);
        toast.success('Event deleted successfully');
        fetchEvents();
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to delete ${activeTab === 'articles' ? 'article' : 'event'}`);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const toggleTag = (tagId: number) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const initForm = (item?: ArticleData | EventData) => {
    if (item) {
      setForm(item);
      setImagePreview(item.imageUrl || null);
      if ('tags' in item) {
        setSelectedTagIds(
          item.tags?.map(tag => (typeof tag === 'number' ? tag : tag.id!)) || []
        );
      }
    } else if (activeTab === 'articles') {
      setForm({
        title: '',
        slug: '',
        description: '',
        content: '',
        imageUrl: '',
        category: '' as ArticleData['category'],
        isPublished: false,
        isFeatured: false,
        tags: []
      });
      setSelectedTagIds([]);
      setImagePreview(null);
    } else {
      setForm({
        title: '',
        slug: '',
        description: '',
        startDate: new Date(),
        eventType: '' as EventData['eventType'],
        isPublished: false,
        isFeatured: false,
      });
      setImagePreview(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if ((event.target as Element).closest('.Toastify')) return;
        setForm(null);
        setImageFile(null);
        setImagePreview(null);
        setSelectedTagIds([]);
      }
    };

    if (form) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [form]);

  return (
    <div className="p-6 lg:p-8 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with tabs and filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-brand-600">
                {activeTab === 'articles' ? 'Articles' : 'Events'} Management
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('articles')}
                  className={`px-4 py-2 rounded-lg ${activeTab === 'articles' ? 'bg-brand-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
                >
                  Articles
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`px-4 py-2 rounded-lg ${activeTab === 'events' ? 'bg-brand-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
                >
                  Events
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg w-full focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
                className="border border-stone-300 rounded-lg py-2 px-3 bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="all">All {activeTab === 'articles' ? 'Articles' : 'Events'}</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
              
              <button
                onClick={() => initForm()}
                className="flex items-center justify-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-brand-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                disabled={loading}
              >
                <Plus className="w-5 h-5" />
                <span>New {activeTab === 'articles' ? 'Article' : 'Event'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && filteredItems.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredItems.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md mx-auto">
            <div className="bg-brand-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-brand-500" />
            </div>
            <h3 className="text-xl font-semibold text-stone-900 mb-2">No {activeTab} found</h3>
            <p className="text-stone-500 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? "Try adjusting your search or filters to find what you're looking for."
                : `Get started by creating your first ${activeTab === 'articles' ? 'article' : 'event'} using the 'New ${activeTab === 'articles' ? 'Article' : 'Event'}' button.`}
            </p>
            {(searchTerm || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="text-brand-600 font-medium hover:text-brand-700"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Items grid */}
        {filteredItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
              >
                <div className="relative h-48 bg-stone-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-stone-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {item.isFeatured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-yellow-200">
                        Featured
                      </span>
                    )}
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      item.isPublished 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-stone-100 text-stone-800 border border-stone-200'
                    }`}>
                      {item.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-2">
                    {('category' in item ? item.category : item.eventType) && (
                      <span className="inline-block bg-brand-100 text-brand-800 text-xs px-2.5 py-0.5 rounded mb-2">
                        {'category' in item ? item.category : item.eventType}
                      </span>
                    )}
                    <h2 className="text-lg font-semibold text-stone-800 line-clamp-2">{item.title}</h2>
                  </div>
                  <p className="text-stone-600 text-sm line-clamp-3 mb-4 flex-grow">{item.description}</p>
                  {'startDate' in item && (
                    <p className="text-stone-500 text-xs mb-2">
                      {new Date(item.startDate).toLocaleDateString()}
                      {item.endDate && ` - ${new Date(item.endDate).toLocaleDateString()}`}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between">
                    {'tags' in item && item.tags && (
                      <div className="flex flex-wrap gap-1">
                        {(item.tags as TagData[]).slice(0, 2).map((tag) => (
                          <span key={tag.id} className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                            {tag.name}
                          </span>
                        ))}
                        {item.tags.length > 2 && (
                          <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                            +{item.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex gap-1 ml-auto">
                      <button
                        onClick={() => initForm(item)}
                        className="p-2 rounded-md hover:bg-stone-100 transition-colors"
                        title={`Edit ${activeTab === 'articles' ? 'article' : 'event'}`}
                      >
                        <Pencil className="w-4 h-4 text-stone-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id!)}
                        className="p-2 rounded-md hover:bg-stone-100 transition-colors"
                        title={`Delete ${activeTab === 'articles' ? 'article' : 'event'}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {form && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div 
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white z-10 p-6 pb-2 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-brand-600">
                  {form.id ? `Edit ${activeTab === 'articles' ? 'Article' : 'Event'}` : `Create New ${activeTab === 'articles' ? 'Article' : 'Event'}`}
                </h2>
                <button
                  onClick={() => {
                    setForm(null);
                    setImageFile(null);
                    setImagePreview(null);
                    setSelectedTagIds([]);
                  }}
                  className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                >
                  <X className="w-6 h-6 text-stone-500" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Title*</label>
                  <input
                    type="text"
                    value={form.title || ''}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Slug <span className="text-stone-500 text-xs">(auto-generated if empty)</span>
                  </label>
                  <input
                    type="text"
                    value={form.slug || ''}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description*</label>
                <textarea
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
              
              {activeTab === 'articles' ? (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Content*</label>
                  <textarea
                    value={(form as ArticleData).content || ''}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    rows={8}
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Content</label>
                  <textarea
                    value={(form as EventData).content || ''}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    rows={8}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    {activeTab === 'articles' ? 'Category*' : 'Event Type*'}
                  </label>
                  <select
                    value={activeTab === 'articles' ? (form as ArticleData).category || '' : (form as EventData).eventType || ''}
                    onChange={(e) => setForm({ ...form, [activeTab === 'articles' ? 'category' : 'eventType']: e.target.value })}
                    className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    required
                  >
                    <option value="" disabled>Select {activeTab === 'articles' ? 'a category' : 'an event type'}</option>
                    {(activeTab === 'articles' ? ARTICLE_CATEGORIES : EVENT_TYPES).map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                {activeTab === 'articles' && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Tags</label>
                    <div className="border border-stone-300 rounded-lg p-3">
                      {availableTags.length === 0 ? (
                        <p className="text-sm text-stone-500">No tags available</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {availableTags.map(tag => (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => toggleTag(tag.id!)}
                              className={`px-2 py-1 text-sm rounded ${
                                selectedTagIds.includes(tag.id!)
                                  ? 'bg-brand-100 text-brand-800'
                                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                              }`}
                            >
                              {tag.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'events' && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Start Date*</label>
                    <input
                      type="datetime-local"
                      value={(form as EventData).startDate ? new Date((form as EventData).startDate).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setForm({ ...form, startDate: new Date(e.target.value) })}
                      className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>
                )}
              </div>

              {activeTab === 'events' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">End Date</label>
                    <input
                      type="datetime-local"
                      value={(form as EventData).endDate ? new Date((form as EventData).endDate!).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value ? new Date(e.target.value) : undefined })}
                      className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={(form as EventData).location || ''}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Venue</label>
                    <input
                      type="text"
                      value={(form as EventData).venue || ''}
                      onChange={(e) => setForm({ ...form, venue: e.target.value })}
                      className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Registration URL</label>
                    <input
                      type="url"
                      value={(form as EventData).registrationUrl || ''}
                      onChange={(e) => setForm({ ...form, registrationUrl: e.target.value })}
                      className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Image{activeTab === 'articles' ? '*' : ''}</label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50"
                    >
                      <Upload className="w-5 h-5" />
                      {imageFile || form.imageUrl ? 'Change Image' : 'Upload Image'}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <div className="relative h-32 bg-stone-100 rounded-lg overflow-hidden">
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setImageFile(null);
                            setForm({ ...form, imageUrl: '' });
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <ImageIcon className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPublished || false}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="h-4 w-4 text-brand-600 rounded focus:ring-brand-500"
                  />
                  <span>Publish {activeTab === 'articles' ? 'article' : 'event'}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured || false}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="h-4 w-4 text-brand-600 rounded focus:ring-brand-500"
                  />
                  <span>Feature on homepage</span>
                </label>
                {activeTab === 'events' && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(form as EventData).isVirtual || false}
                      onChange={(e) => setForm({ ...form, isVirtual: e.target.checked })}
                      className="h-4 w-4 text-brand-600 rounded focus:ring-brand-500"
                    />
                    <span>Virtual Event</span>
                  </label>
                )}
              </div>
              
              <div className="flex justify-end gap-4 pt-2 border-t mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setForm(null);
                    setImageFile(null);
                    setImagePreview(null);
                    setSelectedTagIds([]);
                  }}
                  className="px-6 py-2.5 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>{form.id ? 'Updating...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <span>{form.id ? `Update ${activeTab === 'articles' ? 'Article' : 'Event'}` : `Create ${activeTab === 'articles' ? 'Article' : 'Event'}`}</span>
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