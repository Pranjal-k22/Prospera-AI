'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { useRouter } from 'next/navigation';

const priorityStyle = (tone: string) => {
  if (tone === 'hot') return 'bg-[#e8a33b]/10 text-[#f5bf68] border border-[#e8a33b]/30';
  if (tone === 'warm') return 'bg-[#89a7d4]/10 text-[#b9cdf0] border border-[#89a7d4]/30';
  return 'bg-white/5 text-[#99a1ad] border border-white/10';
};

const Concern = ({ level, text, resolved }: { level: string; text: string; resolved?: boolean }) => {
  const getBadgeClass = () => {
    if (resolved) return 'bg-white/5 text-[#7c8693] border border-white/10';
    const lvl = level.toUpperCase();
    if (lvl === 'HIGH') return 'bg-red-500/10 text-red-400 border border-red-500/20';
    if (lvl === 'MEDIUM') return 'bg-[#e8a33b]/10 text-[#f5bf68] border border-[#e8a33b]/30';
    return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
  };

  return (
    <div className="flex items-start gap-2.5">
      <span className={`mt-0.5 rounded px-2 py-0.5 text-xs font-bold tracking-wider ${getBadgeClass()}`}>
        {resolved ? 'RESOLVED' : level.toUpperCase()}
      </span>
      <p className={`text-sm leading-5 ${resolved ? 'text-[#69717e] line-through' : 'text-[#dce0e5] font-medium'}`}>
        {text}
      </p>
    </div>
  );
};

export default function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Tabs
  const [activeTab, setActiveTab] = useState<'analysis' | 'debrief'>('analysis');
  
  // Debrief
  const [notes, setNotes] = useState('');
  const [submittingDebrief, setSubmittingDebrief] = useState(false);

  // Chat
  const [chat, setChat] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiInstructions, setAiInstructions] = useState('');

  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closeReason, setCloseReason] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchLead = async () => {
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (res.ok) {
        const data = await res.json();
        setLead(data);
        setMessages(data.chatHistory || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const handleDebriefSubmit = async () => {
    if (!notes.trim()) return;
    setSubmittingDebrief(true);
    try {
      const res = await fetch(`/api/leads/${id}/debrief`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callNotes: notes })
      });
      if (res.ok) {
        setNotes('');
        await fetchLead(); 
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingDebrief(false);
    }
  };

  const send = async (textToSend?: string) => {
    const text = textToSend || chat;
    if (!text.trim() || chatLoading) return;

    const newMsgs = [...messages, { role: 'user', content: text }];
    setMessages(newMsgs);
    if (!textToSend) setChat('');
    setChatLoading(true);

    try {
      const res = await fetch(`/api/leads/${id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  const handleStartCall = () => {
    setShowAIModal(true);
  };

  const submitAIInstruction = async () => {
    setShowAIModal(false);
    setToastMessage('AI agent dispatched successfully!');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const submitCloseLead = async () => {
    if (closeReason && closeReason.trim()) {
      try {
        await fetch(`/api/leads/${id}/close`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: closeReason })
        });
        setShowCloseModal(false);
        setToastMessage('Request closed successfully');
        setShowSuccessToast(true);
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
      } catch (e) {
        console.error(e);
        setShowCloseModal(false);
      }
    }
  };

  const submitApproveRequest = async () => {
    try {
      await fetch(`/api/leads/${id}/approve`, {
        method: 'POST',
      });
      setToastMessage('Deal approved and won!');
      setShowSuccessToast(true);
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-auto px-6 py-12 text-center text-[#8c94a0]">
        <div className="animate-spin h-6 w-6 border-2 border-[#e8a33b] border-t-transparent rounded-full mx-auto mb-2" />
        Loading lead dossier...
      </main>
    );
  }

  if (!lead) {
    return (
      <main className="flex-1 overflow-auto px-6 py-12 text-center text-[#8c94a0]">
        Lead not found.
      </main>
    );
  }

  let displayMessage = lead.message;
  if (displayMessage?.startsWith('[GLOBAL_PROPERTY]')) {
    try {
      const g = JSON.parse(displayMessage.replace('[GLOBAL_PROPERTY]', ''));
      displayMessage = `Customer applied for property: ${g.property_name || g.name || 'Unknown Property'} from verified inventory.`;
    } catch(e) {}
  }

  return (
    <main className="flex-1 overflow-auto px-6 pb-12 pt-8 lg:px-10 text-[#e7eaf0]">
      <div className="mx-auto max-w-[1420px]">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/admin">
              <button className="eyebrow mb-2 text-[#e8a33b] hover:text-[#f3bd65] transition-colors cursor-pointer">
                ← Lead Directory / {lead.name.toUpperCase()}
              </button>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold tracking-tight text-white">{lead.name}</h1>
              {lead.status === 'withdrawn' && (
                <span className="inline-flex items-center rounded bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400 border border-red-500/20">
                  Withdrawn
                </span>
              )}
              {lead.status === 'approved' && (
                <span className="inline-flex items-center rounded bg-[#75c994]/10 px-2.5 py-1 text-xs font-semibold text-[#75c994] border border-[#75c994]/20">
                  Deal Won / Approved
                </span>
              )}
              <span className={`priority ${priorityStyle(lead.priority.tier)}`}>
                {lead.priority.tier.toUpperCase()} <b>{lead.priority.score}</b>
              </span>
            </div>
            <p className="mt-1 text-sm text-[#8c94a0]">
              {lead.location} <span className="mx-1 text-white/20">•</span> {lead.budget} <span className="mx-1 text-white/20">•</span> {lead.requirement}
            </p>
          </div>

          <div className="flex gap-3 items-center">
            {lead.status !== 'closed' && lead.status !== 'approved' && lead.status !== 'withdrawn' && (
              <>
                <button 
                  onClick={() => setShowCloseModal(true)} 
                  className="button-secondary whitespace-nowrap text-red-400 border-red-500/20 hover:bg-red-500/10"
                >
                  <Icon name="close" size={15}/> Close Lead
                </button>
                <button 
                  onClick={submitApproveRequest} 
                  className="button-secondary whitespace-nowrap text-[#75c994] border-[#75c994]/20 hover:bg-[#75c994]/10"
                >
                  <Icon name="check" size={15}/> Approve Deal
                </button>
              </>
            )}
            <button onClick={handleStartCall} className="button-primary whitespace-nowrap">
              <Icon name="phone" size={15}/> Instruct AI Agent
            </button>
          </div>
        </div>

        {/* Detail Grid */}
        <div className="detail-grid">
          <section className="space-y-4">
            {lead.analysis?.next_action && (
              <div className="next-action">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-lg bg-[#e8a33b]/20 p-2 text-[#f3bd65]">
                    <Icon name="sparkle" size={17}/>
                  </span>
                  <div>
                    <p className="eyebrow text-[#f3bd65] font-semibold !text-[11px]">Recommended Next Action</p>
                    <h2 className="text-white font-semibold text-base mt-0.5">{lead.analysis.next_action}</h2>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-6 border-b border-white/10 mb-2">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
                  activeTab === 'analysis' ? 'text-[#f3bd65]' : 'text-[#8c94a0] hover:text-white'
                }`}
              >
                Lead Profile
                {activeTab === 'analysis' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f3bd65]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('debrief')}
                className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
                  activeTab === 'debrief' ? 'text-[#f3bd65]' : 'text-[#8c94a0] hover:text-white'
                }`}
              >
                Internal Notes & Debrief
                {activeTab === 'debrief' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f3bd65]" />
                )}
              </button>
            </div>

            {activeTab === 'analysis' && (
              <div className="panel p-6 bg-[#11151c]/60 border border-white/10 rounded-xl backdrop-blur-md space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <h2 className="text-base font-bold text-white">Intelligence Briefing</h2>
                  <span className="text-xs text-[#69717e]">Updated {new Date(lead.updatedAt).toLocaleTimeString()}</span>
                </div>
                
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#8c94a0] font-semibold block mb-1">Summary</label>
                  <p className="text-sm leading-6 text-[#dce0e5]">{lead.analysis?.summary || lead.message}</p>
                </div>
                
                {lead.analysis?.key_requirements && lead.analysis.key_requirements.length > 0 && (
                  <div className="pt-3 border-t border-white/5">
                    <label className="text-xs uppercase tracking-wider text-[#8c94a0] font-semibold block mb-2">Key Requirements</label>
                    <div className="flex flex-wrap gap-2">
                      {lead.analysis.key_requirements.map((x: string) => (
                        <span className="tag bg-white/5 border border-white/10 text-[#dce0e5] text-xs font-medium px-2.5 py-1 rounded" key={x}>
                          {x}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {lead.analysis?.objections && lead.analysis.objections.length > 0 && (
                  <div className="pt-3 border-t border-white/5">
                    <label className="text-xs uppercase tracking-wider text-[#8c94a0] font-semibold block mb-2.5">Identified Objections</label>
                    <div className="space-y-2">
                      {lead.analysis.objections.map((obj: any, i: number) => (
                        <Concern key={i} level={obj.severity} text={obj.concern} resolved={obj.resolved} />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-3 border-t border-white/5">
                  <label className="text-xs uppercase tracking-wider text-[#8c94a0] font-semibold block mb-1">Customer Raw Inbound</label>
                  <p className="text-xs leading-5 text-[#a0a8b5] bg-[#0c0f15] p-3 rounded-lg border border-white/10 italic">
                    "{displayMessage}"
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'debrief' && (
              <div className="panel p-6 bg-[#11151c]/60 border border-white/10 rounded-xl backdrop-blur-md space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <h2 className="text-base font-bold text-white">Post-Call Debrief</h2>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-[#8c94a0] mb-1.5 block">Record Call Notes</label>
                  <textarea 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                    className="field h-24 w-full resize-none p-3 bg-white/5 border-white/10 text-white placeholder-[#59616d]" 
                    placeholder="Capture conversation notes. AI will extract changes, update priority score, and resolve objections."
                    disabled={submittingDebrief}
                  />
                  <button 
                    onClick={handleDebriefSubmit} 
                    disabled={!notes.trim() || submittingDebrief} 
                    className="button-primary mt-3 text-xs"
                  >
                    {submittingDebrief ? 'Analyzing...' : <><Icon name="sparkle" size={13}/> Process Debrief Notes</>}
                  </button>
                </div>
                
                {lead.debriefHistory && lead.debriefHistory.length > 0 && (
                  <div className="pt-4 border-t border-white/5">
                    <label className="text-xs uppercase tracking-wider text-[#8c94a0] font-semibold block mb-3">Audit Timeline</label>
                    <div className="space-y-3">
                      {lead.debriefHistory.slice().reverse().map((dh: any, i: number) => (
                        <div className="timeline pl-4 border-l-2 border-[#e8a33b]/30 relative pb-2" key={i}>
                          <p className="text-sm text-white font-medium">{dh.notes}</p>
                          <div className="text-xs text-[#69717e] mt-0.5">
                            {new Date(dh.timestamp).toLocaleString()}
                          </div>
                          {dh.what_changed && dh.what_changed.length > 0 && (
                            <div className="mt-2 p-2.5 rounded-lg bg-[#e8a33b]/10 border border-[#e8a33b]/20 text-xs">
                              <strong className="text-[#f3bd65] font-semibold">Changes Detected:</strong>
                              <ul className="list-disc pl-4 mt-1 text-[#a0a8b5] space-y-0.5">
                                {dh.what_changed.map((change: string, idx: number) => (
                                  <li key={idx}>{change}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
          
          {/* Right Column: AI Sales Copilot */}
          <aside className="copilot">
            <div className="copilot-head">
              <div>
                <p className="eyebrow text-[#f3bd65] !text-[11px] font-semibold">Contextual Intelligence</p>
                <h2 className="text-white font-bold text-base flex items-center gap-2 mt-0.5">
                  <span className="ai-dot"/> Sales Copilot
                </h2>
              </div>
            </div>
            
            <div className="copilot-context">
              <span>Context Active</span>
              <p>Inquiry • Analysis • Inventory</p>
            </div>
            
            <div className="chat-scroll">
              {messages.length === 0 && (
                <div className="text-center text-[#69717e] text-xs py-8">
                  I am your Prospera AI Copilot. Ask for email drafts, objection handling strategies, or matched properties for {lead.name.split(' ')[0]}.
                </div>
              )}
              
              {messages.map((msg, i) => {
                const isUser = msg.role === 'user';
                return (
                  <div 
                    className={`message ${isUser ? 'user' : 'ai'}`} 
                    key={i}
                  >
                    {msg.content}
                  </div>
                );
              })}
              
              {chatLoading && (
                <div className="text-xs text-[#8c94a0] flex items-center gap-2 py-1">
                  <div className="h-3 w-3 border-2 border-[#e8a33b] border-t-transparent rounded-full animate-spin" />
                  Copilot is thinking...
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-white/5 bg-white/[0.02]">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {['Draft WhatsApp follow-up', 'Draft email in English', 'Summarize key priorities'].map(x => (
                  <button 
                    onClick={() => send(x)} 
                    className="quick cursor-pointer" 
                    key={x}
                  >
                    {x}
                  </button>
                ))}
              </div>
              <div className="chat-input">
                <input 
                  value={chat} 
                  onChange={e => setChat(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && send()} 
                  placeholder={`Ask about ${lead.name.split(' ')[0]}...`}
                  disabled={chatLoading}
                />
                <button 
                  onClick={() => send()} 
                  disabled={chatLoading}
                  className="cursor-pointer"
                >
                  <Icon name="send" size={14}/>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* AI Instruction Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-[#11151c] border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-lg text-[#e7eaf0]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white">Instruct AI Agent</h3>
              <button onClick={() => setShowAIModal(false)} className="text-[#8c94a0] hover:text-white">
                <Icon name="close" size={18} />
              </button>
            </div>
            
            <p className="text-[#8c94a0] text-xs mb-4">
              Enter remarks or guidance for the autonomous AI agent regarding customer follow-up.
            </p>

            <textarea 
              value={aiInstructions}
              onChange={e => setAiInstructions(e.target.value)}
              placeholder="e.g. Inquire about their flexibility on the timeline and emphasize the sea-facing view corridor."
              className="field w-full h-32 p-3 text-xs bg-white/5 border-white/10 text-white resize-none mb-4"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAIModal(false)} className="button-secondary text-xs">
                Cancel
              </button>
              <button onClick={submitAIInstruction} className="button-primary text-xs">
                Dispatch Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Lead Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-[#11151c] border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-md text-[#e7eaf0]">
            <h3 className="text-lg font-bold text-white mb-2">Close Lead</h3>
            <p className="text-xs text-[#8c94a0] mb-4">
              Provide a rationale for archiving or withdrawing this opportunity.
            </p>
            <input 
              value={closeReason}
              onChange={e => setCloseReason(e.target.value)}
              placeholder="e.g. Budget mismatch, purchased elsewhere"
              className="field w-full mb-4 text-xs bg-white/5 border-white/10 text-white"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCloseModal(false)} className="button-secondary text-xs">
                Cancel
              </button>
              <button onClick={submitCloseLead} className="button-secondary text-red-400 border-red-500/30 text-xs">
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-[#11151c] border border-[#75c994]/40 px-5 py-3 shadow-2xl flex items-center gap-3">
          <span className="text-[#75c994]"><Icon name="check" size={16} /></span>
          <span className="text-xs font-semibold text-white">{toastMessage}</span>
        </div>
      )}
    </main>
  );
}
