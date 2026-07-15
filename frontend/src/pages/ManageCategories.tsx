import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Plus, Edit2, Trash2, ArrowLeft, Check, X, AlertCircle } from 'lucide-react';
import api from '../utils/api';

interface CategoryItem {
  id: number;
  name: string;
  description: string;
}

const ManageCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for creating
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // States for inline editing
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      setError('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return;

    setCreateLoading(true);
    try {
      await api.post('/api/categories', { name, description });
      setName('');
      setDescription('');
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create category.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleStartEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDescription(cat.description);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = async (id: number) => {
    setError(null);
    if (!editName.trim()) return;
    try {
      await api.put(`/api/categories/${id}`, { name: editName, description: editDescription });
      setEditingId(null);
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update category.');
    }
  };

  const handleDelete = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Category',
      message: 'Are you sure you want to delete this category? Events associated with it will lose their category.',
      onConfirm: async () => {
        try {
          await api.delete(`/api/categories/${id}`);
          fetchCategories();
        } catch (err: any) {
          setError(err.response?.data?.error || 'Failed to delete category.');
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-8">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Create Form */}
        <div className="md:col-span-1">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="font-bold text-lg text-white font-outfit">Add Category</h2>
            
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Technology"
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-900 focus:border-indigo-500/50 outline-none text-slate-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Description</label>
                <textarea
                  rows={4}
                  placeholder="e.g. Code meets, hackathons, and web dev summits"
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-900 focus:border-indigo-500/50 outline-none text-slate-200"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={createLoading}
                className="w-full flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: List & Inline edit */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="font-bold text-lg text-white font-outfit">Category Management</h2>
            
            {error && (
              <div className="p-3.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    <th className="py-2.5">Name</th>
                    <th className="py-2.5">Description</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-300">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-500 italic">No categories created.</td>
                    </tr>
                  ) : (
                    categories.map(c => (
                      <tr key={c.id} className="align-middle">
                        <td className="py-3">
                          {editingId === c.id ? (
                            <input
                              type="text"
                              className="p-1.5 rounded-lg border border-indigo-500 bg-slate-900 text-slate-200 w-32 focus:outline-none"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                          ) : (
                            <span className="font-bold text-slate-200 flex items-center gap-1.5">
                              <Tag className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              {c.name}
                            </span>
                          )}
                        </td>
                        <td className="py-3 pr-2">
                          {editingId === c.id ? (
                            <input
                              type="text"
                              className="p-1.5 rounded-lg border border-indigo-500 bg-slate-900 text-slate-200 w-full focus:outline-none"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                            />
                          ) : (
                            <p className="line-clamp-1 text-slate-400">{c.description || 'N/A'}</p>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          {editingId === c.id ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleUpdate(c.id)}
                                className="p-1.5 hover:bg-emerald-950/20 text-emerald-400 rounded-lg"
                                title="Save"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1.5 hover:bg-slate-800 text-slate-400 rounded-lg"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleStartEdit(c)}
                                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg transition-all"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(c.id)}
                                className="p-1.5 hover:bg-red-950/20 text-slate-400 hover:text-red-400 rounded-lg transition-all"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 max-w-sm w-full text-center space-y-5 shadow-2xl animate-scale-up">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-amber-500/5">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1 text-center">
              <h3 className="text-base font-extrabold text-white font-outfit">{confirmModal.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium mt-1">{confirmModal.message}</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 text-xs font-bold text-slate-400 hover:text-white transition-all active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                  confirmModal.onConfirm();
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/15 active:scale-95 cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
