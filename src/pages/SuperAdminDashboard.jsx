
import React from 'react';
import { Helmet } from 'react-helmet';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import SuperAdminOverview from '@/components/superadmin/SuperAdminOverview';
import UserManagement from '@/components/superadmin/UserManagement';
import SystemSettings from '@/components/superadmin/SystemSettings';
import PlanManagement from '@/components/superadmin/PlanManagement';
import Templates from '@/components/superadmin/Templates';

const SuperAdminDashboard = () => {
  const menuItems = [
    { id: 'overview', label: 'Visão Geral', path: '/super-admin' },
    { id: 'users', label: 'Usuários', path: '/super-admin/users' },
    { id: 'plans', label: 'Planos', path: '/super-admin/plans' },
    { id: 'templates', label: 'Templates', path: '/super-admin/templates' },
    { id: 'settings', label: 'Configurações', path: '/super-admin/settings' }
  ];

  return (
    <>
      <Helmet>
        <title>Super Admin - FlexiSaaS</title>
        <meta name="description" content="Painel de administração global do FlexiSaaS" />
      </Helmet>

      <DashboardLayout menuItems={menuItems} userRole="super_admin">
        <Routes>
          <Route index element={<SuperAdminOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="plans" element={<PlanManagement />} />
          <Route path="templates" element={<Templates />} />
          <Route path="settings" element={<SystemSettings />} />
        </Routes>
      </DashboardLayout>
    </>
  );
};

export default SuperAdminDashboard;
