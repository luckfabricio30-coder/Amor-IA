import React from 'react';
import { Character } from '../types';
import { Heart, MessageCircle } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  onClick: (character: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
  return (
    <div 
      onClick={() => onClick(character)}
      className="group relative h-96 w-full overflow-hidden rounded-3xl cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-500/20"
    >
      {/* Background Image */}
      <img 
        src={character.coverImage} 
        alt={character.name} 
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold">{character.name}, {character.age}</h2>
          <div className="bg-brand-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <MessageCircle size={20} fill="white" />
          </div>
        </div>
        
        <p className="text-brand-200 font-medium mb-2 uppercase text-xs tracking-wider">{character.job}</p>
        
        <p className="text-gray-300 text-sm line-clamp-2 mb-4 group-hover:line-clamp-none transition-all">
          {character.bio}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
            {character.interests.slice(0, 3).map((interest, idx) => (
                <span key={idx} className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-lg text-xs font-light">
                    {interest}
                </span>
            ))}
        </div>
      </div>
    </div>
  );
};
