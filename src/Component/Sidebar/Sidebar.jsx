import React from 'react';
import { useAuth } from '../../config/AuthContext';
import SidebarAdmin from './Sidebar - Admin';
import SidebarCNS from './Sidebar - CNS';
import SidebarManager from './Sidebar - Manager';
import SidebarSupport from './Sidebar - Sup';
import SidebarSupervisor from './Sidebar - Supervisor';
import SidebarViewer from './Sidebar - Viewer';

export default function Sidebar({ onToggle }) {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const email = currentUser.email.toLowerCase();
  switch (email) {
    case 'admin@airnav.com':
      return <SidebarAdmin onToggle={onToggle} />;
    case 'cns@airnav.com':
      return <SidebarCNS onToggle={onToggle} />;
    case 'manager@airnav.com':
      return <SidebarManager onToggle={onToggle} />;
    case 'support@airnav.com':
      return <SidebarSupport onToggle={onToggle} />;
    case 'supervisor@airnav.com':
      return <SidebarSupervisor onToggle={onToggle} />;
    case 'viewer@airnav.com':
      return <SidebarViewer onToggle={onToggle} />;
    default:
      return <SidebarViewer onToggle={onToggle} />;
  }
}
