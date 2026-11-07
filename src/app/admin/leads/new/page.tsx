'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon';
import Link from 'next/link';

export default function NewLead() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    requirement: '',
    budget: '',
    message: ''
  });
  
  const timelines = ['Immediately', '1–3 months', '3–6 months', '6+ months'];
  const [timelineIndex, setTimelineIndex] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          timeline: timelines[timelineIndex]
        })
      });

      if (res.ok) {
        const lead = await res.json();
        router.push(`/admin/leads/${lead._id}`);
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to submit lead.');
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 overflow-auto px-6 pb-12 pt-8 lg:px-10">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/admin">
            <button type="button" className="eyebrow mb-2 text-[#f3bd65] hover:text-indigo-800 transition-colors cursor-pointer">
              ← Lead Directory
            </button>
          </Link>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">
            Intake New Opportunity
          </h1>
          <p className="mt-1 text-sm text-[#8c94a0]">
            Submit inquiry details. Prospera AI will analyze intent, structure requirements, and score priority.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_.75fr]">
          <section className="panel p-6 bg-[#11151c]/80 border border-white/10 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
              <span className="text-xs font-bold text-[#f3bd65] bg-[#e8a33b]/10 px-2 py-0.5 rounded">01</span>
              <h2 className="text-base font-bold text-white">Core Parameters</h2>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-[#dce0e5] block mb-1">Full Name</label>
                <input 
                  required 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="field w-full text-white border-white/15 shadow-sm" 
                  placeholder="e.g. Rhea Kapoor"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#dce0e5] block mb-1">Preferred Location</label>
                <input 
                  required 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  className="field w-full text-white border-white/15 shadow-sm" 
                  placeholder="e.g. Bandra West"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#dce0e5] block mb-1">Requirement</label>
                <input 
                  required 
                  name="requirement" 
                  value={formData.requirement} 
                  onChange={handleChange} 
                  className="field w-full text-white border-white/15 shadow-sm" 
                  placeholder="e.g. 3 BHK Sea View"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#dce0e5] block mb-1">Budget</label>
                <input 
                  required 
                  name="budget" 
                  value={formData.budget} 
                  onChange={handleChange} 
                  className="field w-full text-white border-white/15 shadow-sm" 
                  placeholder="e.g. ₹ 4.5 Cr"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#dce0e5] block mb-1.5">Buying Timeline</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timelines.map((x, i) => (
                    <button 
                      type="button" 
                      onClick={() => setTimelineIndex(i)} 
                      key={x} 
                      className={`text-xs py-2 px-3 rounded-lg border text-center transition-all cursor-pointer font-medium ${
                        timelineIndex === i 
                          ? 'border-[#e8a33b] bg-[#e8a33b]/10 text-[#f5bf68] font-semibold shadow-sm' 
                          : 'border-white/10 bg-[#11151c]/80 text-[#a0a8b5] hover:bg-[#11151c]/80/5'
                      }`}
                    >
                      {x}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="panel p-6 bg-[#11151c]/80 border border-white/10 rounded-xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                <span className="text-xs font-bold text-[#f3bd65] bg-[#e8a33b]/10 px-2 py-0.5 rounded">02</span>
                <h2 className="text-base font-bold text-white">Inbound Message</h2>
              </div>
              <p className="text-xs text-[#8c94a0] mb-3 leading-relaxed">
                Paste raw client inquiries, emails, or chat logs. Multilingual inputs (Hindi, Hinglish, Marathi) will be automatically translated.
              </p>
              <textarea 
                required
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="field h-44 w-full resize-none p-3 text-xs leading-relaxed border-white/15 shadow-sm text-white" 
                placeholder="Hi, I am looking for a 3 BHK in Bandra West for my family relocating from London..."
              />
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-xs text-[#8c94a0]">
              <Icon name="sparkle" size={14} className="text-[#f3bd65]" />
              <span>AI model will score intent upon submission</span>
            </div>
          </section>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Link href="/admin">
            <button type="button" className="button-secondary text-xs px-5 py-2.5">
              Cancel
            </button>
          </Link>
          <button type="submit" disabled={loading} className="button-primary text-xs px-5 py-2.5">
            {loading ? 'Creating & Analyzing...' : <><Icon name="sparkle" size={14}/> Create & Analyze Lead</>}
          </button>
        </div>
      </form>
    </main>
  );
}
