import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, Search, MessageCircle, Settings, Users, AlertTriangle, Edit3, Save, X, CheckCircle, Eye, EyeOff, User, Clock, Filter, Shield, Database, RefreshCw, Download } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import AdvancedSearchFilter from './AdvancedSearchFilter';
import CounselorManagement from './CounselorManagement';
import CounselorChat from './CounselorChat';
import MaintenanceController from './MaintenanceController';
import ConsentHistoryManagement from './ConsentHistoryManagement';
import DeviceAuthManagement from './DeviceAuthManagement';
import SecurityDashboard from './SecurityDashboard';
import DataCleanup from './DataCleanup';
import { supabase } from '../lib/supabase';

interface JournalEntry {
  id: string;
  date: string;
  emotion: string;
  event: string;
  realization: string;
  self_esteem_score?: number;
  worthlessness_score?: number;
  created_at: string;
  user?: {
    line_username: string;
  };
  assigned_counselor?: string;
  urgency_level?: 'high' | 'medium' | 'low';
  counselor_memo?: string;
  is_visible_to_user?: boolean;
  counselor_name?: string;
}

const AdminPanel: React.FC = () => {
  // ... [rest of the component code remains the same until the return statement]

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-jp-bold text-gray-900">管理画面</h1>
        </div>

        <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-7 gap-1 mb-6 overflow-x-auto">
            <TabsTrigger value="search" className="flex items-center justify-center px-2 py-1.5">
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">日記</span>
            </TabsTrigger>
            <TabsTrigger value="advanced-search" className="flex items-center justify-center px-2 py-1.5">
              <Filter className="w-4 h-4" />
              <span className="hidden md:inline">検索</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center justify-center px-2 py-1.5">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden md:inline">チャット</span>
            </TabsTrigger>
            <TabsTrigger value="counselors" className="flex items-center justify-center px-2 py-1.5">
              <Users className="w-4 h-4" />
              <span className="hidden md:inline">カウンセラー</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center justify-center px-2 py-1.5">
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">設定</span>
            </TabsTrigger>
            <TabsTrigger value="device-auth" className="flex items-center justify-center px-2 py-1.5">
              <Shield className="w-4 h-4" />
              <span className="hidden md:inline">認証</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center justify-center px-2 py-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden md:inline">安全</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            {/* Search content */}
          </TabsContent>

          <TabsContent value="advanced-search">
            <AdvancedSearchFilter 
              entries={entries} 
              onFilteredResults={setFilteredEntries} 
              onViewEntry={handleViewEntry} 
              onDeleteEntry={handleDeleteEntry}
            />
          </TabsContent>

          <TabsContent value="chat">
            <CounselorChat />
          </TabsContent>

          <TabsContent value="counselors">
            <div className="grid grid-cols-1 gap-6">
              <CounselorManagement />
              <ConsentHistoryManagement />
            </div>
          </TabsContent>

          <TabsContent value="maintenance">
            <div className="grid grid-cols-1 gap-6">
              <MaintenanceController />
              <DataCleanup />
            </div>
          </TabsContent>

          <TabsContent value="device-auth">
            <DeviceAuthManagement />
          </TabsContent>

          <TabsContent value="security">
            <SecurityDashboard />
          </TabsContent>
        </Tabs>
      </div>

      {renderEntryDetailsModal()}
    </div>
  );
};

export default AdminPanel;