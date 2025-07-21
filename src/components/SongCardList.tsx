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
  onDelete = () => { },
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering onPress
    const confirmDelete = confirm(`Delete "${item?.title}"?`);
    if (confirmDelete) {
      onDelete(item!);
    }
  };

  return (
    <div
      className="flex items-center justify-between bg-white rounded-lg shadow-sm hover:shadow-md transition p-3 cursor-pointer"
      onClick={onPress}
    >
      {/* Left: Cover / Icon */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-100 border">
          {item?.coverUrl ? (
            <Image
              src={item.coverUrl}
              alt={item.title || 'Cover'}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <FaMusic size={24} />
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex flex-col max-w-[200px] sm:max-w-[300px]">
          <h3 className="font-semibold text-gray-800 text-sm truncate">{item?.title}</h3>
          <p className="text-sm text-gray-500 truncate -mt-1">
            {typeof item?.artist === 'object' ? item.artist?.name : item?.artist}
          </p>
        </div>
      </div>

      {/* Right: Ellipsis Button */}
      {type === 'default' && (
        <button
          onClick={handleDelete}
          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition"
          title="Delete Song"
        >
          <FaEllipsisV size={18} />
        </button>
      )}
    </div>
  );
};

export default SongCardList;
