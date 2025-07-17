'use client';

import React from 'react';
import Image from 'next/image';
import { FaMusic, FaEllipsisV } from 'react-icons/fa';

type Song = {
  id?: string;
  coverUrl?: string;
  cover_path?: string;
  audio_path?: string;
  title?: string;
  artist?: string | { name: string };
  language?: string;
};

type Props = {
  song?: Song;
  onPress?: () => void;
  type?: 'default' | 'search';
  onDelete?: (song: Song) => void;
};

const SongCardList: React.FC<Props> = ({
  song: item,
  type = 'default',
  onPress,
  onDelete = () => {},
}) => {
  const handleEllipsisClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent onClick
    const confirmed = confirm(`Are you sure you want to delete "${item?.title}"?`);
    if (confirmed) {
      onDelete(item!);
    }
  };

  return (
    <div
      className="w-full h-[60px] flex items-center bg-gray-600 rounded-md mb-2 transition-colors cursor-pointer hover:bg-gray-500"
      onClick={onPress}
    >
      {type === 'default' ? (
        <div className="relative w-[60px] h-[60px] flex-shrink-0">
          {item?.coverUrl ? (
            <Image
              src={item.coverUrl}
              alt={item.title || 'Song Cover'}
              className="object-cover rounded-sm w-full h-full"
              width={60}
              height={60}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-sm" />
          )}
        </div>
      ) : (
        <div className="w-10 h-10 flex items-center justify-center ml-2">
          <FaMusic size={24} color="#999" />
        </div>
      )}

      <div className="flex flex-1 justify-between ml-4">
        <div className="w-[215px] flex flex-col overflow-hidden">
          <span className="font-bold text-sm truncate">{item?.title}</span>
          <span className="text-gray-400 text-sm -mt-1 truncate">
            {typeof item?.artist === 'object' ? item?.artist?.name : item?.artist}
          </span>
        </div>

        {type === 'default' && (
          <div
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-full"
            onClick={handleEllipsisClick}
          >
            <FaEllipsisV size={20} color="#333" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SongCardList;
