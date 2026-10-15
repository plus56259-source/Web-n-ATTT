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
import { SurveyTeamView } from './components/survey/SurveyTeamView';
import { SearchModal } from './components/search/SearchModal';
import { HabitQuizModal } from './components/quiz/HabitQuizModal';
import { ProfileModal } from './components/profile/ProfileModal';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { GlobalMusicPlayer } from './components/audio/GlobalMusicPlayer';
import { ToastContainer } from './components/common/ToastContainer';
import { ChillStarryBackground } from './components/common/ChillStarryBackground';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="min-h-screen">
      {activeTab === 'home' && <HomeView />}
      {activeTab === 'survey' && <SurveyTeamView />}
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
  const { theme, isGameFullscreen } = useApp();

  return (
    <div
      className={`min-h-screen w-full overflow-x-auto selection:bg-sky-400/30 selection:text-white flex flex-col font-sans transition-colors duration-300 relative ${
        theme === 'light'
          ? 'bg-slate-50/80 text-slate-900'
          : 'bg-[#091124]/80 text-slate-100'
      }`}
    >
      <ChillStarryBackground />
      {!isGameFullscreen && <Navbar />}
      <div className={`flex-1 w-full relative ${isGameFullscreen ? 'z-[99999]' : 'z-10'}`}>
        <MainContent />
      </div>
      {!isGameFullscreen && <Footer />}
      <SearchModal />
      <HabitQuizModal />
      <ProfileModal />
      {!isGameFullscreen && <AIAssistantModal />}
      <GlobalMusicPlayer />
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
