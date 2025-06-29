import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, Search, MessageCircle, Settings, Users, AlertTriangle, Edit3, Trash2, Save, X, CheckCircle, Eye, EyeOff, User, Clock, Filter, Shield, Database, RefreshCw, Download } from 'lucide-react';
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
          <TabsList className="flex flex-wrap mb-6 overflow-x-auto">
            <TabsTrigger value="search">
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">日記</span>
            </TabsTrigger>
            <TabsTrigger value="advanced-search">
              <Filter className="w-4 h-4" />
              <span className="hidden md:inline">検索</span>
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden md:inline">チャット</span>
            </TabsTrigger>
            <TabsTrigger value="counselors">
              <Users className="w-4 h-4" />
              <span className="hidden md:inline">カウンセラー</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">設定</span>
            </TabsTrigger>
            <TabsTrigger value="device-auth">
              <Shield className="w-4 h-4" />
              <span className="hidden md:inline">認証</span>
            </TabsTrigger>
            <TabsTrigger value="security">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden md:inline">安全</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-jp-normal">読み込み中...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-jp-bold text-gray-900 mb-6">日記一覧</h2>
                  
                  {entries.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-jp-medium text-gray-500 mb-2">
                        日記がありません
                      </h3>
                      <p className="text-gray-400 font-jp-normal">
                        まだ日記が登録されていません
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {entries.map((entry) => (
                        <div key={entry.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3 flex-wrap">
                              <span className={`px-3 py-1 rounded-full text-sm font-jp-medium ${
                                entry.emotion === '恐怖' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                entry.emotion === '悲しみ' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                entry.emotion === '怒り' ? 'bg-red-100 text-red-800 border border-red-200' :
                                entry.emotion === '悔しい' ? 'bg-green-100 text-green-800 border border-green-200' :
                                entry.emotion === '無価値感' ? 'bg-gray-100 text-gray-800 border border-gray-300' :
                                entry.emotion === '罪悪感' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                entry.emotion === '寂しさ' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                                entry.emotion === '恥ずかしさ' ? 'bg-pink-100 text-pink-800 border border-pink-200' :
                                'bg-gray-100 text-gray-800 border border-gray-200'
                              }`}>
                                {entry.emotion}
                              </span>
                              <span className="text-gray-900 font-jp-medium">
                                {entry.user?.line_username || 'Unknown User'}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {formatDate(entry.date)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {entry.urgency_level && (
                                <span className={`text-sm font-jp-medium ${
                                  entry.urgency_level === 'high' ? 'text-red-600' :
                                  entry.urgency_level === 'medium' ? 'text-yellow-600' :
                                  'text-green-600'
                                }`}>
                                  緊急度: {
                                    entry.urgency_level === 'high' ? '高' :
                                    entry.urgency_level === 'medium' ? '中' : '低'
                                  }
                                </span>
                              )}
                              <button
                                onClick={() => handleViewEntry(entry)}
                                className="text-blue-600 hover:text-blue-700 p-1"
                                title="詳細"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteEntry(entry.id)}
                                disabled={deleting}
                                className="text-red-600 hover:text-red-700 p-1"
                                title="削除"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <h4 className="font-jp-semibold text-gray-700 mb-1 text-sm">出来事</h4>
                              <p className="text-gray-600 text-sm font-jp-normal leading-relaxed break-words whitespace-pre-wrap">
                                {entry.event}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-jp-semibold text-gray-700 mb-1 text-sm">気づき</h4>
                              <p className="text-gray-600 text-sm font-jp-normal leading-relaxed break-words whitespace-pre-wrap">
                                {entry.realization}
                              </p>
                            </div>
                          </div>

                          {entry.counselor_memo && (
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-jp-semibold text-blue-900 text-sm">カウンセラーメモ</h4>
                                {entry.is_visible_to_user ? (
                                  <div className="flex items-center space-x-1 text-green-600 text-xs">
                                    <Eye className="w-3 h-3" />
                                    <span>ユーザーに表示</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-1 text-gray-500 text-xs">
                                    <EyeOff className="w-3 h-3" />
                                    <span>非表示</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-blue-800 text-sm font-jp-normal leading-relaxed break-words whitespace-pre-wrap">
                                {entry.counselor_memo}
                              </p>
                            </div>
                          )}

                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center space-x-2 text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(entry.created_at).toLocaleString('ja-JP')}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {entry.assigned_counselor && (
                                <span className="text-gray-600 font-jp-medium">
                                  担当: {entry.assigned_counselor}
                                </span>
                              )}
                              <span className="text-xs text-gray-400">
                                {entry.source === 'supabase' ? 'Supabase' : 'ローカル'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
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