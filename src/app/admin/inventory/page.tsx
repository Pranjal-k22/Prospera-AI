'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Icon } from '@/components/Icon';

interface InventoryPropertyItem {
  _id?: string;
  name: string;
  location: string;
  price: string;
  bhk: string;
  description?: string;
  images?: string[];
  features?: string[];
}

export default function InventoryManagement() {
  const [properties, setProperties] = useState<InventoryPropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', location: '', price: '', bhk: '', description: '', images: '' });

  const loadProperties = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (data.properties) setProperties(data.properties);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/inventory');
        const data = await res.json();
        if (mounted && data.properties) setProperties(data.properties);
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/cron/sync', { method: 'POST' });
      if (res.ok) {
        await loadProperties();
      } else {
        alert("Failed to sync MLS data.");
      }
    } catch {
      alert("Error syncing data.");
    }
    setIsSyncing(false);
  };

  const handleEdit = (prop: InventoryPropertyItem) => {
    setEditingId(prop._id || null);
    setForm({
      name: prop.name,
      location: prop.location,
      price: prop.price,
      bhk: prop.bhk,
      description: prop.description || '',
      images: (prop.images || []).join(', ')
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    await fetch(`/api/inventory/${deleteConfirmId}`, { method: 'DELETE' });
    setDeleteConfirmId(null);
    loadProperties();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      images: form.images.split(',').map(i => i.trim()).filter(i => i)
    };
    
    if (editingId === 'new') {
      await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch(`/api/inventory/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    setEditingId(null);
    loadProperties();
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#8c94a0]">
        <div className="animate-spin h-6 w-6 border-2 border-[#e8a33b] border-t-transparent rounded-full mx-auto mb-2" />
        Loading property inventory...
      </div>
    );
  }

  return (
    <main className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="eyebrow text-[#f3bd65] mb-1">Database</p>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Inventory Management</h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 rounded-lg bg-[#e8a33b]/10 border border-[#e8a33b]/30 px-4 py-2 text-xs font-semibold text-[#f5bf68] hover:bg-indigo-100 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Icon name="sparkle" size={14} /> {isSyncing ? 'Scraping Market...' : 'Sync MLS Data'}
          </button>
          <button 
            onClick={() => {
              setEditingId('new');
              setForm({ name: '', location: '', price: '', bhk: '', description: '', images: '' });
            }}
            className="button-primary text-xs"
          >
            <Icon name="plus" size={14} /> Add Property
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {editingId === 'new' && (
          <div className="panel p-6 bg-[#11151c]/80 border border-[#e8a33b]/30 rounded-xl shadow-md">
            <h2 className="text-lg font-bold text-white mb-4">Add New Property</h2>
            <form onSubmit={handleSave} className="grid gap-4">
              <input className="field" placeholder="Property Title (e.g. Sea-Facing Penthouse)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <input className="field" placeholder="Location (e.g. Worli Sea Face)" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
                <input className="field" placeholder="Price (e.g. ₹ 18.5 Cr)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
              </div>
              <input className="field" placeholder="Layout / BHK (e.g. 4 BHK)" value={form.bhk} onChange={e => setForm({...form, bhk: e.target.value})} required />
              <textarea className="field h-24 p-3 resize-none" placeholder="Property Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
              <input className="field" placeholder="Image URLs (comma separated)" value={form.images} onChange={e => setForm({...form, images: e.target.value})} required />
              <div className="flex gap-3 justify-end mt-2">
                <button type="button" onClick={() => setEditingId(null)} className="button-secondary text-xs">Cancel</button>
                <button type="submit" className="button-primary text-xs">Save Property</button>
              </div>
            </form>
          </div>
        )}

        {properties.map(p => (
          editingId === p._id ? (
            <div key={p._id} className="panel p-6 bg-[#11151c]/80 border border-[#e8a33b]/30 rounded-xl shadow-md">
              <h2 className="text-lg font-bold text-white mb-4">Edit {p.name}</h2>
              <form onSubmit={handleSave} className="grid gap-4">
                <input className="field" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                <div className="grid grid-cols-2 gap-4">
                  <input className="field" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
                  <input className="field" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                </div>
                <input className="field" placeholder="BHK" value={form.bhk} onChange={e => setForm({...form, bhk: e.target.value})} required />
                <textarea className="field h-24 p-3 resize-none" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
                <input className="field" placeholder="Image URLs (comma separated)" value={form.images} onChange={e => setForm({...form, images: e.target.value})} required />
                <div className="flex gap-3 justify-end mt-2">
                  <button type="button" onClick={() => setEditingId(null)} className="button-secondary text-xs">Cancel</button>
                  <button type="submit" className="button-primary text-xs">Save Changes</button>
                </div>
              </form>
            </div>
          ) : (
            <div key={p._id} className="panel p-6 bg-[#11151c]/80 border border-white/10 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start">
              <div className="relative w-48 h-32 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-[#11151c]/80/5">
                <Image 
                  src={p.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'} 
                  className="object-cover" 
                  alt={p.name}
                  fill
                  sizes="192px"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <p className="text-[#8c94a0] text-xs mt-1 font-medium">{p.location} • {p.bhk} • <span className="text-[#f3bd65] font-semibold">{p.price}</span></p>
                <p className="text-[#a0a8b5] text-xs mt-2.5 leading-relaxed line-clamp-2">{p.description}</p>
              </div>
              <div className="flex md:flex-col gap-2 shrink-0">
                <button onClick={() => handleEdit(p)} className="button-secondary text-xs px-3 py-1.5">Edit</button>
                <button onClick={() => setDeleteConfirmId(p._id || null)} className="button-secondary text-xs px-3 py-1.5 text-red-600 border-red-200 hover:bg-red-50">Delete</button>
              </div>
            </div>
          )
        ))}
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="panel max-w-sm w-full p-6 bg-[#11151c]/80 border border-white/10 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-red-600 mb-2">Delete Property?</h3>
            <p className="text-[#8c94a0] text-xs mb-5 leading-relaxed">Are you sure you want to delete this property listing? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="button-secondary text-xs px-4 py-2">Cancel</button>
              <button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition-colors cursor-pointer">Delete Listing</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
