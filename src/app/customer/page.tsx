'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Icon } from '@/components/Icon';
import { BRAND_NAME } from '@/lib/brand';

interface CustomerProperty {
  id?: string;
  property_id?: string;
  name?: string;
  property_name?: string;
  [key: string]: unknown;
}

interface LeadPropertyDetails {
  location?: string;
  bhk?: string;
  price?: string;
  description?: string;
  images?: string[];
  features?: string[];
  [key: string]: unknown;
}

function ImageGallery({ images, name, compact = false }: { images: string[], name: string, compact?: boolean }) {
  const [activeIdx, setActiveIdx] = useState(0);
  if (!images || images.length === 0) return null;
  
  return (
    <div className={`flex flex-col gap-2 ${compact ? 'w-full md:w-64 shrink-0' : 'w-full mb-5'}`}>
      <div className={`relative w-full rounded-xl overflow-hidden border border-white/10 bg-[#11151c]/80/5 ${compact ? 'h-44' : 'h-48 md:h-60'}`}>
        <Image src={images[activeIdx]} alt={name} fill unoptimized className="object-cover transition-opacity duration-300" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {images.map((img, idx) => (
          <button 
            key={idx} 
            onClick={() => setActiveIdx(idx)}
            className={`relative h-11 flex-1 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
              activeIdx === idx ? 'border-[#e8a33b] shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Image src={img} alt={`${name} ${idx}`} fill unoptimized className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'explore' | 'applied' | 'matches' | 'list'>('explore');
  const [applying, setApplying] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [showUrgentModal, setShowUrgentModal] = useState<string | null>(null);
  
  const [listForm, setListForm] = useState({
    propertyName: '',
    location: '',
    configuration: '',
    expectedPrice: '',
    additionalDetails: ''
  });
  const [isListing, setIsListing] = useState(false);
  
  interface CustomerPropertyItem {
    _id?: string;
    id?: string;
    property_id?: string;
    name?: string;
    property_name?: string;
    location?: string;
    bhk?: string;
    price?: string;
    features?: string[];
    images?: string[];
    description?: string;
    sales_pitch?: string;
    [key: string]: unknown;
  }

  interface CustomerAppItem {
    _id: string;
    status: string;
    requirement: string;
    message?: string;
    closeReason?: string;
    createdAt?: string;
    priority?: {
      tier?: string;
      score?: number;
      atRisk?: boolean;
    };
  }

  interface CustomerMatchResult {
    location?: string;
    summary?: string;
    matches: Array<{
      property_id?: string;
      property_name?: string;
      location?: string;
      bhk?: string;
      price?: string;
      sales_pitch?: string;
      match_score?: number;
      pros?: string[];
      cons?: string[];
      images?: string[];
      [key: string]: unknown;
    }>;
  }

  const [applications, setApplications] = useState<CustomerAppItem[]>([]);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const [matchForm, setMatchForm] = useState({
    location: '',
    configuration: '',
    budget: '',
    additionalDetails: ''
  });
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState<CustomerMatchResult | null>(null);

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const [inventory, setInventory] = useState<CustomerPropertyItem[]>([]);
  const prevApps = useRef<CustomerAppItem[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchApplications = useCallback(async () => {
    const res = await fetch('/api/customer/applications');
    if (res.ok) {
      const data = await res.json();
      const newApps: CustomerAppItem[] = data.leads;
      
      const oldClosed = new Set(prevApps.current.filter((a) => a.status === 'closed').map((a) => a._id));
      const oldApproved = new Set(prevApps.current.filter((a) => a.status === 'approved').map((a) => a._id));
      
      newApps.forEach((app) => {
        if (app.status === 'closed' && !oldClosed.has(app._id) && prevApps.current.length > 0) {
           showToast(`Broker updated your request: ${app.closeReason || 'Closed'}`, 'error');
           setActiveTab('applied');
        } else if (app.status === 'approved' && !oldApproved.has(app._id) && prevApps.current.length > 0) {
           showToast(`Congratulations! Your deal for ${app.requirement.replace('Buying: ', '')} has been Approved!`, 'success');
           setActiveTab('applied');
        }
      });
      
      prevApps.current = newApps;
      setApplications(newApps);
    }
  }, [showToast]);

  const fetchInventory = useCallback(async () => {
    const res = await fetch('/api/inventory');
    if (res.ok) {
      const data = await res.json();
      setInventory(data.properties || []);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (mounted) {
        await fetchApplications();
        await fetchInventory();
      }
    })();
    const interval = setInterval(fetchApplications, 3000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fetchApplications, fetchInventory]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const handleApply = async (property: CustomerProperty) => {
    const pId = property.id || property.property_id;
    const pName = property.name || property.property_name;
    setApplying(typeof pId === 'string' ? pId : null);
    
    const res = await fetch('/api/customer/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        propertyId: pId, 
        propertyName: pName, 
        type: 'buy',
        fullDetails: {
          ...property,
          name: pName,
          id: pId
        }
      })
    });
    setApplying(null);
    if (res.ok) {
      showToast(`Successfully submitted inquiry for ${pName}!`);
      fetchApplications();
    } else {
      showToast('Failed to submit application. Please try again.', 'error');
    }
  };

  const handleRemove = async (leadId: string) => {
    setRemoving(leadId);
    const res = await fetch(`/api/customer/apply?id=${leadId}`, { method: 'DELETE' });
    setRemoving(null);
    if (res.ok) {
      showToast('Application withdrawn successfully.');
      fetchApplications();
    } else {
      showToast('Failed to withdraw application.', 'error');
    }
  };

  const handleUrgentConfirm = async () => {
    if (showUrgentModal) {
      try {
        await fetch('/api/customer/urgent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId: showUrgentModal })
        });
        setShowUrgentModal(null);
        showToast('Urgent priority beacon dispatched. An advisory partner has been notified.', 'success');
        fetchApplications();
      } catch (e) {
        console.error(e);
        showToast('Failed to send urgent request.', 'error');
      }
    }
  };

  const handleListProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsListing(true);
    
    const formattedDescription = `
Property Name: ${listForm.propertyName}
Location: ${listForm.location}
Configuration: ${listForm.configuration}
Expected Price: ${listForm.expectedPrice}
Details: ${listForm.additionalDetails}
    `.trim();

    const res = await fetch('/api/customer/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'sell', description: formattedDescription })
    });
    setIsListing(false);
    if (res.ok) {
      setListForm({
        propertyName: '',
        location: '',
        configuration: '',
        expectedPrice: '',
        additionalDetails: ''
      });
      showToast('Your property details have been submitted! Our advisory team will schedule an appraisal.');
      fetchApplications();
      setActiveTab('applied');
    } else {
      showToast('Failed to submit property details. Please try again.', 'error');
    }
  };

  const handleFindMatches = async () => {
    const query = `
Location: ${matchForm.location}
Configuration: ${matchForm.configuration}
Budget: ${matchForm.budget}
Details: ${matchForm.additionalDetails}
    `.trim();

    if (!matchForm.location && !matchForm.configuration && !matchForm.budget && !matchForm.additionalDetails) return;

    setIsMatching(true);
    const res = await fetch('/api/customer/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    setIsMatching(false);
    if (res.ok) {
      setMatches(data);
    } else {
      showToast('Failed to find matches.', 'error');
    }
  };

  const appliedPropertyNames = applications
    .filter(lead => lead.requirement.startsWith('Buying: '))
    .map(lead => lead.requirement.replace('Buying: ', ''));

  const availableInventory = inventory.filter(prop => !appliedPropertyNames.includes(prop.name || ''));
  const appliedBuyingLeads = applications.filter(lead => lead.requirement.startsWith('Buying: ') && lead.status !== 'withdrawn');

  return (
    <div className="flex min-h-screen w-full bg-[#0a0d12] text-[#e7eaf0] relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 border transition-all duration-300 animate-in slide-in-from-bottom-4 ${
          toast.type === 'success' ? 'bg-[#11151c]/80 border-emerald-200 text-emerald-800' : 'bg-[#11151c]/80 border-red-200 text-red-800'
        }`}>
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
            toast.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            <Icon name={toast.type === 'success' ? 'sparkle' : 'close'} size={14} />
          </span>
          <p className="font-semibold text-xs">{toast.message}</p>
        </div>
      )}

      {/* Customer Sidebar */}
      <aside className="sidebar h-screen sticky top-0 border-r border-white/10 w-[250px] p-6 flex flex-col bg-[#11151c]/80">
        <div className="brand flex items-center gap-2.5 mb-10">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-[#e8a33b] text-white font-bold text-sm shadow-xs">P</span>
          <span className="text-xl font-bold tracking-tight text-white">Prospera</span>
        </div>
        
        <nav className="flex flex-col gap-1.5">
          <button 
            className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
              activeTab === 'explore' 
                ? 'bg-[#e8a33b]/10 text-[#f5bf68] border border-[#e8a33b]/30 shadow-xs' 
                : 'text-[#a0a8b5] hover:bg-[#11151c]/80/5 hover:text-white border border-transparent'
            }`}
            onClick={() => setActiveTab('explore')}
          >
            <Icon name="dashboard" size={17} /> 
            <span>Explore Inventory</span>
          </button>
          
          <button 
            className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
              activeTab === 'applied' 
                ? 'bg-[#e8a33b]/10 text-[#f5bf68] border border-[#e8a33b]/30 shadow-xs' 
                : 'text-[#a0a8b5] hover:bg-[#11151c]/80/5 hover:text-white border border-transparent'
            }`}
            onClick={() => setActiveTab('applied')}
          >
            <Icon name="check" size={17} /> 
            <span className="flex-1">Applications</span>
            {appliedBuyingLeads.length > 0 && (
              <span className="bg-[#e8a33b] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {appliedBuyingLeads.length}
              </span>
            )}
          </button>
          
          <button 
            className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
              activeTab === 'list' 
                ? 'bg-[#e8a33b]/10 text-[#f5bf68] border border-[#e8a33b]/30 shadow-xs' 
                : 'text-[#a0a8b5] hover:bg-[#11151c]/80/5 hover:text-white border border-transparent'
            }`}
            onClick={() => setActiveTab('list')}
          >
            <Icon name="plus" size={17} /> 
            <span>List Property</span>
          </button>
          
          <button 
            className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
              activeTab === 'matches' 
                ? 'bg-[#e8a33b]/10 text-[#f5bf68] border border-[#e8a33b]/30 shadow-xs' 
                : 'text-[#a0a8b5] hover:bg-[#11151c]/80/5 hover:text-white border border-transparent'
            }`}
            onClick={() => setActiveTab('matches')}
          >
            <Icon name="sparkle" size={17} /> 
            <span>AI Matchmaker</span>
          </button>
        </nav>
        
        <div className="mt-auto pt-4 border-t border-white/10">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-[#f3bd65] hover:text-indigo-800 transition-colors w-full p-2 font-medium text-xs cursor-pointer"
          >
            <Icon name="close" size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="content flex-1 p-8 lg:p-10 overflow-y-auto bg-[#11151c]/80/5">
        <header className="mb-8">
          <p className="eyebrow mb-1 text-[#f3bd65]">Client Portal</p>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            {activeTab === 'explore' && 'Verified Luxury Inventory'}
            {activeTab === 'applied' && 'Your Applications & Deals'}
            {activeTab === 'list' && 'List Your Property with Prospera'}
            {activeTab === 'matches' && 'AI Property Matchmaker'}
          </h1>
        </header>

        {activeTab === 'explore' && (
          <section>
            <div className="grid gap-6 lg:grid-cols-2">
              {availableInventory.map((property, idx) => (
                <div key={property._id || property.id || idx} className="panel p-6 bg-[#11151c]/80 border border-white/10 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    {property.images && (
                      <ImageGallery images={property.images} name={property.name || 'Property'} />
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">{property.name}</h3>
                        <p className="text-xs text-[#8c94a0] font-medium">{property.location} • {property.bhk}</p>
                      </div>
                      <span className="text-[#f3bd65] font-bold text-base">{property.price}</span>
                    </div>
                    
                    <p className="text-[#a0a8b5] text-xs mt-2 mb-4 leading-relaxed line-clamp-3">{property.description}</p>
                    
                    {property.features && property.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {property.features.map((f: string) => (
                          <span key={f} className="text-[11px] text-[#a0a8b5] bg-[#11151c]/80/5 px-2 py-0.5 rounded-md font-medium">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => handleApply(property)}
                    disabled={applying === (property._id || property.id)}
                    className="button-primary w-full text-xs"
                  >
                    {applying === (property._id || property.id) ? 'Submitting Application...' : 'Apply for Property'}
                  </button>
                </div>
              ))}
              
              {availableInventory.length === 0 && (
                <div className="col-span-2 panel p-12 text-center text-[#8c94a0] border-dashed border-2 border-white/10 rounded-2xl bg-[#11151c]/80">
                  <p className="text-sm font-medium">You have applied for all currently available inventory listings.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'applied' && (
          <section>
            {appliedBuyingLeads.length === 0 ? (
              <div className="panel p-16 text-center text-[#8c94a0] border-dashed border-2 border-white/10 rounded-2xl bg-[#11151c]/80">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full mb-4 mx-auto w-max">
                  <Icon name="check" size={24} />
                </div>
                <h3 className="text-lg text-white font-bold mb-1">No Active Applications</h3>
                <p className="text-xs text-[#8c94a0]">Explore inventory listings or use the AI Matchmaker to discover luxury properties.</p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {appliedBuyingLeads.map(lead => {
                  let propName = lead.requirement.replace('Buying: ', '');
                  let propDetails = inventory.find(p => p.name === propName);
                  let isGlobal = false;
                  
                  if (lead.message && lead.message.startsWith('[GLOBAL_PROPERTY]')) {
                    const isFromInventory = inventory.some(p => p.name === propName);
                    if (!isFromInventory) isGlobal = true;
                    try {
                      const g = JSON.parse(lead.message.replace('[GLOBAL_PROPERTY]', ''));
                      propName = g.property_name || propName;
                      propDetails = {
                        id: g.property_id || g.id,
                        name: g.property_name || g.name,
                        location: g.location,
                        bhk: g.bhk,
                        price: g.price,
                        description: g.sales_pitch || g.description,
                        images: g.images,
                        features: []
                      } as LeadPropertyDetails;
                    } catch {
                      // ignore parse error
                    }
                  }
                  
                  return (
                    <div key={lead._id} className="panel p-6 bg-[#11151c]/80 border border-white/10 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div>
                        {propDetails?.images && (
                          <ImageGallery images={propDetails.images} name={propName} />
                        )}
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-white">{propName}</h3>
                            <p className="text-xs text-[#8c94a0]">{propDetails?.location || 'Location Pending'} • {propDetails?.bhk || 'TBD'}</p>
                          </div>
                          
                          {lead.status === 'closed' ? (
                            <span className="text-red-700 text-xs font-bold px-2.5 py-1 bg-red-50 rounded-md border border-red-200">Closed</span>
                          ) : lead.status === 'withdrawn' ? (
                            <span className="text-[#a0a8b5] text-xs font-bold px-2.5 py-1 bg-[#11151c]/80/5 rounded-md border border-white/10">Withdrawn</span>
                          ) : lead.status === 'approved' ? (
                            <span className="text-emerald-700 text-xs font-bold px-2.5 py-1 bg-emerald-50 rounded-md border border-emerald-200">Deal Approved</span>
                          ) : (
                            <span className="text-[#f5bf68] text-xs font-bold px-2.5 py-1 bg-[#e8a33b]/10 rounded-md border border-[#e8a33b]/30">Under Review</span>
                          )}
                        </div>
                        
                        {isGlobal && (
                          <div className="mb-3 inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-200 uppercase tracking-wider">
                            Global AI Recommendation
                          </div>
                        )}
                        
                        <p className="text-[#a0a8b5] text-xs leading-relaxed mb-4">{propDetails?.description || 'Application active in broker deal room.'}</p>
                        
                        {/* Timeline */}
                        <div className="mb-6 p-4 rounded-xl bg-[#11151c]/80/5 border border-white/10">
                          <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                            <Icon name="sparkles" size={13} className="text-[#f3bd65]" /> Milestone Status
                          </h4>
                          
                          <div className="flex flex-col gap-3 relative pl-2 border-l-2 border-[#e8a33b]/30">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase tracking-wider text-[#69717e] font-semibold">
                                {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Initial'}
                              </span>
                              <p className="text-xs text-[#dce0e5] mt-0.5">Application submitted and dispatched to advisory deal room.</p>
                            </div>

                            {lead.priority?.tier === 'hot' && (
                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider text-amber-600 font-bold">Priority Elevated</span>
                                <p className="text-xs text-[#dce0e5] mt-0.5">Urgent callback requested. Deal room flagged.</p>
                              </div>
                            )}

                            {lead.status === 'closed' && (
                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider text-red-600 font-bold">Request Closed</span>
                                <p className="text-xs text-[#dce0e5] mt-0.5">{lead.closeReason || 'Closed by broker'}</p>
                              </div>
                            )}

                            {lead.status === 'approved' && (
                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">Deal Approved</span>
                                <p className="text-xs text-emerald-800 font-medium mt-0.5">Congratulations! The brokerage has approved your purchase request.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {lead.status !== 'closed' && lead.status !== 'withdrawn' && lead.status !== 'approved' && (
                          <>
                            <button 
                              onClick={() => setShowUrgentModal(lead._id)}
                              className="button-primary flex-1 text-xs"
                            >
                              <Icon name="sparkle" size={13} /> Request Urgent Attention
                            </button>
                            <button 
                              onClick={() => handleRemove(lead._id)}
                              disabled={removing === lead._id}
                              className="button-secondary flex-1 border-red-200 text-red-600 hover:bg-red-50 text-xs"
                            >
                              {removing === lead._id ? 'Withdrawing...' : 'Withdraw'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === 'list' && (
          <section className="max-w-xl mx-auto mt-4">
            <div className="panel p-8 bg-[#11151c]/80 border border-white/10 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-white mb-1 text-center">List with Prospera</h2>
              <p className="text-[#8c94a0] text-xs mb-6 text-center leading-relaxed">
                Provide specifications for your luxury residential property. A designated advisory partner will contact you for a private appraisal.
              </p>
              
              <form onSubmit={handleListProperty} className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#dce0e5]">Property Name / Building</label>
                  <input 
                    type="text" 
                    className="field w-full border-white/15 text-white shadow-sm" 
                    placeholder="e.g. Solaria Altamount Penthouse"
                    value={listForm.propertyName}
                    onChange={e => setListForm({...listForm, propertyName: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#dce0e5]">Location</label>
                    <input 
                      type="text" 
                      className="field w-full border-white/15 text-white shadow-sm" 
                      placeholder="e.g. Altamount Road, Mumbai"
                      value={listForm.location}
                      onChange={e => setListForm({...listForm, location: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#dce0e5]">Configuration</label>
                    <input 
                      type="text" 
                      className="field w-full border-white/15 text-white shadow-sm" 
                      placeholder="e.g. 4 BHK Duplex"
                      value={listForm.configuration}
                      onChange={e => setListForm({...listForm, configuration: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#dce0e5]">Expected Valuation / Price</label>
                  <input 
                    type="text" 
                    className="field w-full border-white/15 text-white shadow-sm" 
                    placeholder="e.g. ₹ 22 Cr"
                    value={listForm.expectedPrice}
                    onChange={e => setListForm({...listForm, expectedPrice: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#dce0e5]">Amenities & Highlights</label>
                  <textarea
                    className="field w-full h-28 resize-none p-3 border-white/15 text-white text-xs leading-relaxed shadow-sm"
                    placeholder="Highlight features like private plunge pool, sea views, high floor, dedicated parking..."
                    value={listForm.additionalDetails}
                    onChange={e => setListForm({...listForm, additionalDetails: e.target.value})}
                  />
                </div>

                <button 
                  type="submit" 
                  className="button-primary w-full py-2.5 mt-2 text-xs"
                  disabled={isListing}
                >
                  {isListing ? 'Submitting Property...' : 'Submit Listing Application'}
                </button>
              </form>
            </div>
          </section>
        )}

        {activeTab === 'matches' && (
          <>
            <section className="max-w-xl mx-auto mt-4">
              <div className="panel p-8 bg-[#11151c]/80 border border-[#e8a33b]/30 rounded-2xl shadow-sm mb-8">
                <h2 className="text-xl font-bold text-white mb-1 text-center">AI Global Property Matchmaker</h2>
                <p className="text-[#8c94a0] text-xs mb-6 text-center leading-relaxed">
                  Describe your ideal residence, budget, and global city preference. Prospera AI will locate or synthesize matching opportunities.
                </p>
                
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[#dce0e5]">Target City / Area</label>
                      <input 
                        type="text" 
                        className="field w-full border-white/15 text-white shadow-sm" 
                        placeholder="e.g. Dubai Marina or Bandra West"
                        value={matchForm.location}
                        onChange={e => setMatchForm({...matchForm, location: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[#dce0e5]">Configuration</label>
                      <input 
                        type="text" 
                        className="field w-full border-white/15 text-white shadow-sm" 
                        placeholder="e.g. 4 BHK Penthouse"
                        value={matchForm.configuration}
                        onChange={e => setMatchForm({...matchForm, configuration: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#dce0e5]">Maximum Budget</label>
                    <input 
                      type="text" 
                      className="field w-full border-white/15 text-white shadow-sm" 
                      placeholder="e.g. ₹ 15 Cr or $4.5M"
                      value={matchForm.budget}
                      onChange={e => setMatchForm({...matchForm, budget: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#dce0e5]">Specific Requirements</label>
                    <textarea
                      className="field w-full h-24 resize-none p-3 border-white/15 text-white text-xs leading-relaxed shadow-sm"
                      placeholder="e.g. Floor-to-ceiling glass, private elevator, sea view, concierge service..."
                      value={matchForm.additionalDetails}
                      onChange={e => setMatchForm({...matchForm, additionalDetails: e.target.value})}
                    />
                  </div>

                  <button 
                    onClick={handleFindMatches}
                    disabled={isMatching || (!matchForm.location && !matchForm.configuration && !matchForm.budget && !matchForm.additionalDetails)}
                    className="button-primary w-full py-2.5 mt-2 text-xs"
                  >
                    {isMatching ? 'Synthesizing Matches...' : 'Find Matches with AI'}
                  </button>
                </div>
              </div>
            </section>

            {matches && (
              <section className="mt-8 w-full">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-lg font-bold text-white">Recommended Luxury Matches</h3>
                  <div className="text-xs text-[#8c94a0]">
                    Analyzed by <strong className="text-[#f3bd65]">{BRAND_NAME} AI</strong>
                  </div>
                </div>

                <div className="grid gap-6 2xl:grid-cols-2">
                  {matches.matches.map((m, idx) => {
                    const localProperty = inventory.find(p => p.id === m.property_id);
                    const images = m.images || localProperty?.images;
                    const name = (m.property_name || localProperty?.name || 'Property') as string;
                    const location = (m.location || localProperty?.location || '') as string;
                    const bhk = (m.bhk || localProperty?.bhk || '') as string;
                    const price = (m.price || localProperty?.price || '') as string;
                    const salesPitch = typeof m.sales_pitch === 'string' ? m.sales_pitch : '';
                    const prosList = Array.isArray(m.pros) ? m.pros : [];
                    const consList = Array.isArray(m.cons) ? m.cons : [];

                    return (
                      <div key={m.property_id || idx} className="panel p-6 bg-[#11151c]/80 border border-white/10 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col xl:flex-row gap-6 items-start">
                        {images && (
                          <ImageGallery images={images} name={name} compact={true} />
                        )}
                        <div className="flex-1 flex flex-col w-full justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2 gap-4">
                              <h4 className="text-base font-bold text-white">{name}</h4>
                              <span className="px-2.5 py-0.5 rounded-md border text-xs font-bold bg-emerald-50 text-emerald-700 border-emerald-200">
                                {m.match_score}% Match
                              </span>
                            </div>
                            <p className="text-xs text-[#8c94a0] font-medium mb-3">{location} • {bhk} • <strong className="text-[#f3bd65]">{price}</strong></p>
                            {salesPitch && (
                              <p className="text-[#dce0e5] text-xs italic mb-4 bg-[#11151c]/80/5 p-3 rounded-lg border border-white/10 leading-relaxed">
                                &quot;{salesPitch}&quot;
                              </p>
                            )}
                            
                            <div className="space-y-1.5 text-xs">
                              {prosList.length > 0 && (
                                <div className="flex gap-2">
                                  <Icon name="check" size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                                  <span className="text-[#dce0e5]"><strong>Pros:</strong> {prosList.join(', ')}</span>
                                </div>
                              )}
                              {consList.length > 0 && (
                                <div className="flex gap-2">
                                  <Icon name="close" size={14} className="text-red-500 shrink-0 mt-0.5" />
                                  <span className="text-[#dce0e5]"><strong>Cons:</strong> {consList.join(', ')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => handleApply(m)}
                            disabled={applying === m.property_id}
                            className="button-primary w-full text-xs mt-5"
                          >
                            {applying === m.property_id ? 'Applying...' : 'Apply for Property'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Prospera Assistant Copilot */}
      <aside className="copilot hidden lg:flex flex-col sticky top-0 h-screen w-[360px] shrink-0 border-l border-white/10 bg-[#11151c]/80">
        <div className="copilot-head bg-[#11151c]/80/5 p-4 border-b border-white/10">
          <div>
            <p className="eyebrow text-[#f3bd65] !text-[11px] font-semibold">Prospera Assistant</p>
            <h2 className="text-white font-bold text-sm flex items-center gap-2 mt-0.5">
              <span className="ai-dot bg-[#e8a33b]"/> Prospera Copilot
            </h2>
          </div>
        </div>
        
        <div className="copilot-context bg-[#11151c]/80/5/60 px-4 py-2 border-b border-white/10 flex justify-between text-xs text-[#8c94a0]">
          <span className="text-emerald-600 font-semibold">Online</span>
          <p>Advisory & Discovery</p>
        </div>
        
        <div className="chat-scroll flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {chatMessages.length === 0 && (
            <div className="text-center text-[#69717e] text-xs py-8 leading-relaxed">
              Welcome! I am your Prospera Assistant. Ask about available luxury inventory, neighborhood insights, or investment yields.
            </div>
          )}
          
          {chatMessages.map((msg, i) => (
            <div 
              key={i} 
              className={`message text-xs leading-relaxed p-3 rounded-xl ${
                msg.role === 'user' 
                  ? 'bg-[#e8a33b] text-white ml-auto max-w-[85%]' 
                  : 'bg-[#11151c]/80/5 border border-white/10 text-[#e7eaf0] mr-auto max-w-[90%]'
              }`}
            >
              {msg.content}
            </div>
          ))}
          {isTyping && (
            <div className="text-xs text-[#69717e] flex items-center gap-2 py-1">
              <div className="h-3 w-3 border-2 border-[#e8a33b] border-t-transparent rounded-full animate-spin" />
              Prospera Assistant is responding...
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-white/10 bg-[#11151c]/80/5/50">
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              if (!chatInput.trim() || isTyping) return;
              
              const newMessages = [...chatMessages, { role: 'user', content: chatInput }];
              setChatMessages(newMessages);
              setChatInput('');
              setIsTyping(true);
              
              try {
                const res = await fetch('/api/customer/chat', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ messages: newMessages })
                });
                const data = await res.json();
                if (data.reply) {
                  setChatMessages([...newMessages, { role: 'assistant', content: data.reply }]);
                }
              } catch(err) {
                console.error(err);
              } finally {
                setIsTyping(false);
              }
            }} 
            className="chat-input bg-[#11151c]/80 border border-white/15 rounded-lg flex items-center p-1.5 focus-within:border-indigo-500 shadow-sm"
          >
            <input 
              type="text" 
              placeholder="Ask Prospera Assistant..." 
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-xs text-white px-2"
            />
            <button 
              type="submit" 
              disabled={isTyping}
              className="bg-[#e8a33b] text-white p-1.5 rounded-md hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <Icon name="send" size={14} />
            </button>
          </form>
        </div>
      </aside>

      {/* Urgent Modal */}
      {showUrgentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="panel max-w-sm w-full p-6 bg-[#11151c]/80 border border-white/10 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-white mb-1">Request Urgent Attention</h3>
            <p className="text-[#8c94a0] text-xs mb-5 leading-relaxed">
              This will escalate your application to HOT priority in the broker&apos;s deal room, triggering an urgent callback alert.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowUrgentModal(null)} className="button-secondary text-xs px-4 py-2">
                Cancel
              </button>
              <button onClick={handleUrgentConfirm} className="button-primary text-xs px-4 py-2">
                Confirm Escalation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
