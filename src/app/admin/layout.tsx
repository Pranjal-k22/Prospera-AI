import Sidebar from '@/components/Sidebar';
import { Icon } from '@/components/Icon';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-[#0a0d12] text-white w-full">
      <Sidebar />
      <div className="content flex-1 min-w-0">
        <header className="topbar">
          <button className="mobile-menu">
            <Icon name="menu" />
          </button>
          <span className="eyebrow flex items-center gap-2 text-[#7c8693]">
            SOUTH MUMBAI RESIDENTIAL <span className="text-white/20 font-normal">|</span> <span className="text-white/80">DEAL ROOM</span>
          </span>
          <div className="text-xs font-semibold tracking-wider text-[#75c994] flex items-center">
            <span className="live-dot" /> SYSTEM LIVE
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
