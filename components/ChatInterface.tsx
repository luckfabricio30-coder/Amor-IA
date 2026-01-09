import React, { useState, useEffect, useRef } from 'react';
import { Character, Message, MessageRole } from '../types';
import { generateTextResponse, generateSelfie } from '../services/geminiService';
import { MessageBubble } from './MessageBubble';
import { ArrowLeft, Send, Camera, MoreVertical, Phone } from 'lucide-react';

interface ChatInterfaceProps {
  character: Character;
  onBack: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ character, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`chat_${character.id}`);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
        // Initial greeting logic
        let greetingText = `Olá! Vi seu perfil e achei interessante. Sou o ${character.name}. Como você está?`;

        // Custom greeting for Ryan (Childhood friend context)
        if (character.id === 'ryan') {
            greetingText = "Ei, Tudo bem ? Esperei 20 minutos por você, você esta atrasado de novo.";
        }

        const initialMsg: Message = {
            id: 'init-1',
            role: MessageRole.Model,
            text: greetingText,
            timestamp: Date.now()
        };
        setMessages([initialMsg]);
        localStorage.setItem(`chat_${character.id}`, JSON.stringify([initialMsg]));
    }
  }, [character.id, character.name]);

  // Save to local storage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
        localStorage.setItem(`chat_${character.id}`, JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages, character.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: MessageRole.User,
      text: inputValue,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // AI Response logic
    try {
      const responseText = await generateTextResponse(character, messages.concat(userMsg), userMsg.text);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.Model,
        text: responseText,
        timestamp: Date.now(),
      };

      setIsTyping(false);
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      setIsTyping(false);
    }
  };

  const handleRequestSelfie = async () => {
     if (isTyping) return;
     
     // Add a system message simulating the user asking for a photo
     const userRequestMsg: Message = {
         id: Date.now().toString(),
         role: MessageRole.User,
         text: "(Envia uma foto sua agora?)",
         timestamp: Date.now()
     };
     setMessages(prev => [...prev, userRequestMsg]);
     setIsTyping(true);

     try {
         // Generate image
         const base64Image = await generateSelfie(character, "Selfie casual enviada durante conversa no chat");
         
         const aiResponseText = base64Image ? "Aqui está! O que achou? 😘" : "Minha câmera deu erro, acredita? Mas imagine que estou sorrindo pra você.";

         const aiMsg: Message = {
             id: (Date.now() + 1).toString(),
             role: MessageRole.Model,
             text: aiResponseText,
             image: base64Image || undefined,
             timestamp: Date.now()
         };
         
         setIsTyping(false);
         setMessages(prev => [...prev, aiMsg]);
     } catch(e) {
         console.error(e);
         setIsTyping(false);
     }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shadow-md z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="relative">
            <img 
              src={character.avatar} 
              alt={character.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-brand-500"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold text-white">{character.name}</h3>
            <p className="text-xs text-brand-400 flex items-center gap-1">
              Online agora
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
           <button className="p-2 rounded-full hover:bg-slate-800 hover:text-brand-500 transition-colors">
              <Phone size={20} />
           </button>
           <button className="p-2 rounded-full hover:bg-slate-800 transition-colors">
              <MoreVertical size={20} />
           </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
        <div className="text-center py-6 opacity-50">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Início da conversa</p>
        </div>
        
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} character={character} />
        ))}
        
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-gray-400 ml-10 animate-pulse">
            <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce delay-75"></span>
            <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce delay-150"></span>
            {character.name} está digitando...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <button 
            onClick={handleRequestSelfie}
            disabled={isTyping}
            className="p-3 text-brand-500 hover:bg-slate-800 rounded-full transition-colors disabled:opacity-50"
            title="Pedir uma foto"
          >
            <Camera size={24} />
          </button>
          
          <div className="flex-1 bg-slate-800 rounded-2xl flex items-center px-4 py-2 border border-slate-700 focus-within:border-brand-500 transition-colors">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 py-2"
              disabled={isTyping}
            />
          </div>

          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className={`
              p-3 rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30
              transition-all duration-200 hover:scale-105 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
            `}
          >
            <Send size={20} fill="currentColor" />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-600 mt-2">
            IA pode gerar informações imprecisas. Não leve a sério conselhos médicos ou legais.
        </p>
      </div>
    </div>
  );
};