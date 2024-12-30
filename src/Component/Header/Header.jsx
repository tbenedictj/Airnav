import React from 'react';
import { useAuth } from '../../config/AuthContext';
import HeaderAdmin from './Header - Admin';
import HeaderCNS from './Header - CNS';
import HeaderManager from './Header - Manager';
import HeaderSup from './Header - Sup';
import HeaderSupervisor from './Header - Supervisor';
import HeaderViewer from './Header - Viewer';

export default function Header({ expanded }) {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const email = currentUser.email.toLowerCase();
  switch (email) {
    case 'admin@airnav.com':
      return <HeaderAdmin expanded={expanded} />;
    case 'cns@airnav.com':
      return <HeaderCNS expanded={expanded} />;
    case 'manager@airnav.com':
      return <HeaderManager expanded={expanded} />;
    case 'support@airnav.com':
      return <HeaderSup expanded={expanded} />;
    case 'supervisor@airnav.com':
      return <HeaderSupervisor expanded={expanded} />;
    case 'viewer@airnav.com':
      return <HeaderViewer expanded={expanded} />;
    default:
      return <HeaderViewer expanded={expanded} />;
  }
}
