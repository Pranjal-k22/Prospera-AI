'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from './Icon';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <span>P</span> Prospera AI
      </div>
      <nav>
        <Link href="/admin">
          <button className={pathname === '/admin' ? 'active' : ''}>
            <Icon name="dashboard" /> <span>Pipeline</span>
          </button>
        </Link>
        <Link href="/admin/leads/new">
          <button className={pathname === '/admin/leads/new' ? 'active' : ''}>
            <Icon name="plus" /> <span>New lead</span>
          </button>
        </Link>
        <Link href="/admin/inventory">
          <button className={pathname === '/admin/inventory' ? 'active' : ''}>
            <Icon name="sparkle" /> <span>Inventory</span>
          </button>
        </Link>
        <Link href="/admin/analytics">
          <button className={pathname === '/admin/analytics' ? 'active' : ''}>
            <Icon name="dashboard" /> <span>Analytics</span>
          </button>
        </Link>
      </nav>
      <div className="sidebar-foot">
        <div className="user-avatar">P</div>
        <div>
          <b>Pranjal</b>
          <small>Advisory Partner</small>
        </div>
      </div>
      <button 
        onClick={handleLogout} 
        className="flex items-center gap-2 text-[#e8a33b] hover:text-[#f3bd65] transition-colors justify-start px-2 py-1 w-full text-left font-medium text-xs mt-3 cursor-pointer border-none bg-transparent"
      >
        Sign Out
      </button>
    </aside>
  );
}
