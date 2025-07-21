'use client';

import React, { useState } from 'react';
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
  onEdit?: (song: Song) => void;
};

const SongCardList: React.FC<Props> = ({
  song: item,
  type = 'default',
  onPress,
  onDelete = () => { },
  onEdit = () => { },
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit(item!);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    const confirmDelete = confirm(`Delete "${item?.title}"?`);
    if (confirmDelete) {
      onDelete(item!);
    }
  };

  return (
    <div
      className="relative flex items-center justify-between bg-white rounded-lg shadow-sm hover:shadow-md transition p-3 cursor-pointer"
      onClick={onPress}
    >
      {/* Left: Cover / Info */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-100 border">
          {item?.coverUrl ? (
            <Image
              src={item.coverUrl}
              alt={item.title || 'Cover'}
              width={56}
              height={56}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <FaMusic size={24} />
            </div>
          )}
        </div>

        <div className="flex flex-col max-w-[260px]">
          <h3 className="font-semibold text-gray-800 text-sm truncate">{item?.title}</h3>
          <p className="text-sm text-gray-500 truncate -mt-1">
            {typeof item?.artist === 'object' ? item.artist?.name : item?.artist}
          </p>
        </div>
      </div>

      {/* Right: Menu */}
      {type === 'default' && (
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition"
          >
            <FaEllipsisV size={18} />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded shadow-lg z-10 w-36"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleEdit}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleDelete}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SongCardList;
