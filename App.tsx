import React, { useState } from 'react';
import { CHARACTERS } from './constants';
import { Character } from './types';
import { CharacterCard } from './components/CharacterCard';
import { ChatInterface } from './components/ChatInterface';
import { Sparkles, Flame } from 'lucide-react';

const App: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  if (selectedCharacter) {
    return (
      <ChatInterface 
        character={selectedCharacter} 
        onBack={() => setSelectedCharacter(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0f172a]/80 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="bg-gradient-to-tr from-brand-600 to-purple-600 p-2 rounded-lg">
                <Flame size={24} className="text-white" />
             </div>
             <h1 className="text-2xl font-bold tracking-tight">Amor.<span className="text-brand-500">AI</span> <span className="text-xs font-normal text-brand-300 ml-1 opacity-80">GAY</span></h1>
          </div>
          <div className="flex items-center gap-4">
             <span className="hidden md:block text-sm text-gray-400 font-medium">Beta v1.0</span>
             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs">
                    Eu
                </div>
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 text-brand-400 text-sm font-medium mb-4 border border-brand-500/20">
                <Sparkles size={14} />
                <span>O app de namoro #1 para homens</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                Quem fará seu coração acelerar hoje?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
                Conecte-se com perfis masculinos de IA. Do executivo dominante ao gamer fofo, encontre o cara perfeito para o seu momento.
            </p>
        </section>

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CHARACTERS.map((char) => (
            <CharacterCard 
              key={char.id} 
              character={char} 
              onClick={setSelectedCharacter} 
            />
          ))}
        </div>

        {/* Features / Footer teaser */}
        <div className="mt-20 border-t border-slate-800 pt-10 text-center">
            <h3 className="text-lg font-semibold mb-6">A Experiência Amor.AI</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/30 transition-colors">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 text-brand-400 text-2xl">🍆</div>
                    <h4 className="font-bold mb-2">Sem Tabus</h4>
                    <p className="text-sm text-gray-500">Conversas livres e sem julgamentos. Seja você mesmo.</p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/30 transition-colors">
                     <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 text-brand-400 text-2xl">🔥</div>
                    <h4 className="font-bold mb-2">Roleplay Intenso</h4>
                    <p className="text-sm text-gray-500">Narrativas envolventes criadas para o público gay.</p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/30 transition-colors">
                     <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 text-brand-400 text-2xl">📸</div>
                    <h4 className="font-bold mb-2">Troca de Nudes (Safe)</h4>
                    <p className="text-sm text-gray-500">Peça "selfies" apimentadas geradas na hora pela IA.</p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;