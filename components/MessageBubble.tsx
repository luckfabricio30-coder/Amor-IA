import React from 'react';
import { Message, MessageRole, Character } from '../types';
import { Sparkles } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  character: Character;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, character }) => {
  const isUser = message.role === MessageRole.User;

  // Função para processar o texto e separar falas de ações/pensamentos
  const renderStyledText = (text: string) => {
    // Regex atualizada para capturar:
    // 1. Texto entre parênteses: \(.*?\)
    // 2. Texto entre asteriscos: \*[^*]+\*
    const parts = text.split(/(\(.*?\)|(?:\*[^*]+\*))/g);

    return parts.map((part, index) => {
      if (!part) return null;

      const isParenthesis = part.startsWith('(') && part.endsWith(')');
      const isAsterisk = part.startsWith('*') && part.endsWith('*');
      const isThought = isParenthesis || isAsterisk;
      
      // Remove asteriscos para estética limpa, mas mantém parênteses pois fazem parte da frase
      let displayText = part;
      if (isAsterisk) displayText = part.replace(/\*/g, '');

      if (isThought) {
        return (
          <span 
            key={index} 
            className="inline-block text-cyan-300/90 italic text-[14px] font-light my-0.5 leading-relaxed tracking-wide drop-shadow-[0_0_2px_rgba(34,211,238,0.3)]"
          >
            {displayText}
          </span>
        );
      }
      
      // Se for fala normal
      if (part.trim()) {
        return (
          <span 
            key={index} 
            className="inline text-white text-[16px] font-semibold leading-snug drop-shadow-sm"
          >
            {part}
          </span>
        );
      }
      
      // Mantém espaços e pontuação entre os blocos se necessário, 
      // mas o split geralmente captura tudo. Se for apenas quebra de linha ou espaço:
      if (part.match(/^\s+$/)) {
          return <span key={index}>{part}</span>;
      }

      return null;
    });
  };

  if (isUser) {
    return (
      <div className="flex w-full mb-6 justify-end">
        <div className="max-w-[80%] flex flex-col items-end">
          <div className="px-5 py-3 rounded-2xl rounded-tr-sm bg-brand-600 text-white shadow-lg shadow-brand-900/20 border border-brand-500/50">
            <span className="text-[15px]">{message.text}</span>
          </div>
          <span className="text-[10px] text-gray-500 mt-1 mr-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    );
  }

  // Estilo "Visual Novel" para a IA
  return (
    <div className="flex w-full mb-8 justify-start group">
      <div className="flex flex-col items-center mr-3 self-end">
         <img 
          src={character.avatar} 
          alt={character.name} 
          className="w-10 h-10 rounded-full object-cover border-2 border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.3)]"
        />
      </div>
      
      <div className="max-w-[90%] md:max-w-[85%] relative">
        {/* Efeito de Borda Neon (Fundo com gradiente) */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-70 blur-[1px]"></div>
        
        {/* Bolha Principal */}
        <div className="relative bg-[#0b0d14] rounded-2xl p-5 shadow-2xl">
            
            {/* Decorações dos cantos (Asinhas/Brilhos) */}
            <div className="absolute -top-3 -left-2 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                <Sparkles size={20} fill="currentColor" />
            </div>
            <div className="absolute -top-3 -right-2 text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]">
                 <Sparkles size={20} fill="currentColor" />
            </div>

            {/* Nome do personagem pequeno acima do texto, estilo RPG */}
            <div className="absolute -top-3 left-6 bg-[#0b0d14] px-2 rounded-full border border-purple-500/30">
                <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 uppercase tracking-widest">
                    {character.name}
                </span>
            </div>

            {message.image && (
                <div className="mb-4 rounded-lg overflow-hidden border border-slate-700/50">
                    <img src={message.image} alt="Conteúdo gerado" className="w-full h-auto object-cover max-h-72" />
                </div>
            )}
            
            {/* Texto Renderizado */}
            <div className="leading-relaxed">
                {renderStyledText(message.text)}
            </div>
        </div>
        
        <span className="text-[10px] text-gray-500 mt-2 px-1 block">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};