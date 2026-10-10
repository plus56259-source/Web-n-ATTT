/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/home/HomeView';
import { DiscoverView } from './components/discover/DiscoverView';
import { MethodsView } from './components/methods/MethodsView';
import { SkillsView } from './components/skills/SkillsView';
import { ToolsView } from './components/tools/ToolsView';
import { GameZoneView } from './components/games/GameZoneView';
import { StudyRoomView } from './components/studyroom/StudyRoomView';
import { ForumView } from './components/forum/ForumView';
import { AcademicLibraryView } from './components/library/AcademicLibraryView';
import { SearchModal } from './components/search/SearchModal';
import { HabitQuizModal } from './components/quiz/HabitQuizModal';
import { ProfileModal } from './components/profile/ProfileModal';
import { ToastContainer } from './components/common/ToastContainer';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="min-h-screen">
      {activeTab === 'home' && <HomeView />}
      {activeTab === 'studyroom' && <StudyRoomView />}
      {activeTab === 'library' && <AcademicLibraryView />}
      {activeTab === 'forum' && <ForumView />}
      {activeTab === 'discover' && <DiscoverView />}
      {activeTab === 'methods' && <MethodsView />}
      {activeTab === 'skills' && <SkillsView />}
      {activeTab === 'tools' && <ToolsView />}
      {activeTab === 'games' && <GameZoneView />}
    </main>
  );
};

const MainAppLayout: React.FC = () => {
  const { theme } = useApp();

  return (
    <div
      className={`min-h-screen selection:bg-[#FF4D8D]/30 selection:text-white flex flex-col font-sans transition-colors duration-300 ${
        theme === 'light' ? 'bg-[#F4F6FC] text-[#1E293B]' : 'bg-[#14112E] text-[#F5F3FF]'
      }`}
    >
      <Navbar />
      <div className="flex-1">
        <MainContent />
      </div>
      <Footer />
      <SearchModal />
      <HabitQuizModal />
      <ProfileModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
