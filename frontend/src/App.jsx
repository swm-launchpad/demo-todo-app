import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import OceanHeader from './components/OceanHeader';
import QuestInput from './components/QuestInput';
import QuestCard from './components/QuestCard';
import DemoButton from './components/DemoButton';
import Bubbles from './components/Bubbles';
import SeaCreatures from './components/SeaCreatures';
import SunlightEffect from './components/SunlightEffect';
import RippleEffect from './components/RippleEffect';
import TreasureChest from './components/TreasureChest';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [user, setUser] = useState(null);
  const [quests, setQuests] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTreasure, setShowTreasure] = useState(false);
  const [treasureRewards, setTreasureRewards] = useState([]);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    // 레벨에 따른 배경 깊이 설정
    if (user?.stats?.level) {
      const level = user.stats.level;
      let depth = 'shallow';
      if (level > 20) depth = 'abyss';
      else if (level > 10) depth = 'deep';
      else if (level > 5) depth = 'coastal';
      document.body.setAttribute('data-depth', depth);
    }
  }, [user?.stats?.level]);

  const initializeApp = async () => {
    try {
      const { data: userData } = await axios.get(`${API_URL}/api/users/demo`);
      setUser(userData);
      await fetchQuests();
    } catch (error) {
      toast.error('앱 초기화 실패');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuests = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/quests`);
      setQuests(data);
    } catch (error) {
      toast.error('퀘스트 불러오기 실패');
    }
  };

  const createQuest = async (title, difficulty) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/quests`, {
        title,
        difficulty,
        description: ''
      });
      setQuests([data, ...quests]);
      toast.success('🌊 새로운 퀘스트 생성!');
    } catch (error) {
      toast.error('퀘스트 생성 실패');
    }
  };

  const completeQuest = async (questId) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/quests/${questId}/complete`);
      
      setQuests(quests.map(q => 
        q.id === questId ? { ...q, status: 'COMPLETED' } : q
      ));

      if (user) {
        const newUser = { ...user };
        newUser.stats.level = data.new_level;
        newUser.stats.total_exp = data.total_exp;
        newUser.stats.exp = data.total_exp;
        newUser.stats.quests_completed += 1;
        setUser(newUser);

        if (data.new_level > user.stats.level) {
          setShowConfetti(true);
          setShowTreasure(true);
          setTreasureRewards([
            `🎊 레벨 ${data.new_level} 달성!`,
            `💎 ${quest.exp_reward * 2} 보너스 경험치`,
            `🏆 새로운 칭호 획득`
          ]);
          toast.success(`🎊 레벨 ${data.new_level} 달성! 더 깊은 바다로!`, {
            duration: 4000,
            style: {
              background: 'linear-gradient(45deg, #0891b2, #0e7490)',
              color: 'white',
            }
          });
          setTimeout(() => setShowConfetti(false), 5000);
        }
      }

      toast.success('🐟 퀘스트 완료! +경험치');
    } catch (error) {
      toast.error('퀘스트 완료 실패');
    }
  };

  const deleteQuest = async (questId) => {
    try {
      await axios.delete(`${API_URL}/api/quests/${questId}`);
      setQuests(quests.filter(q => q.id !== questId));
      toast.success('퀘스트 삭제됨');
    } catch (error) {
      toast.error('퀘스트 삭제 실패');
    }
  };

  const generateDemoQuests = async () => {
    try {
      await axios.post(`${API_URL}/api/quests/demo/generate`);
      await fetchQuests();
      toast.success('🌊 데모 퀘스트 10개 생성!');
    } catch (error) {
      toast.error('데모 퀘스트 생성 실패');
    }
  };

  const completeAllQuests = async () => {
    const pendingQuests = quests.filter(q => q.status !== 'COMPLETED');
    
    for (let quest of pendingQuests) {
      await new Promise(resolve => setTimeout(resolve, 600));
      await completeQuest(quest.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4 swim-animation">🐠</div>
          <p className="text-xl">바다를 탐험하는 중...</p>
        </div>
      </div>
    );
  }

  const activeQuests = quests.filter(q => q.status !== 'COMPLETED');
  const completedQuests = quests.filter(q => q.status === 'COMPLETED');

  return (
    <div className="min-h-screen relative">
      <SunlightEffect />
      <SeaCreatures />
      <Bubbles />
      <RippleEffect />
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      
      <Toaster position="top-center" />
      {showConfetti && <Confetti />}
      <TreasureChest 
        isOpen={showTreasure}
        onClose={() => setShowTreasure(false)}
        rewards={treasureRewards}
      />

      <div className="relative z-10 p-4 max-w-4xl mx-auto">
        <OceanHeader user={user} />
        
        <DemoButton 
          onGenerate={generateDemoQuests}
          onCompleteAll={completeAllQuests}
          questCount={activeQuests.length}
        />

        <QuestInput onCreateQuest={createQuest} />

        <div className="mt-8">
          <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-3xl">🏝️</span> 
            활성 퀘스트 ({activeQuests.length})
          </h2>
          
          {activeQuests.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center text-white">
              <div className="text-6xl mb-4">🌊</div>
              <p className="text-lg">바다가 고요합니다...</p>
              <p className="text-sm opacity-80 mt-2">새로운 퀘스트를 만들어 모험을 시작하세요!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {activeQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onComplete={() => completeQuest(quest.id)}
                    onDelete={() => deleteQuest(quest.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {completedQuests.length > 0 && (
          <div className="mt-8">
            <h2 className="text-white/60 text-xl font-bold mb-4">
              ✅ 완료된 퀘스트 ({completedQuests.length})
            </h2>
            <div className="grid gap-3 opacity-50">
              {completedQuests.slice(0, 3).map((quest) => (
                <QuestCard key={quest.id} quest={quest} completed />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;