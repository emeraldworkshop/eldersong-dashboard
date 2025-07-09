'use client';

import React from 'react';
import Image from 'next/image';
import { FaMusic, FaLanguage, FaEllipsisV } from 'react-icons/fa';
import styles from '@/styles/songCardList.module.css';

type Song = {
  coverUrl?: string;
  title?: string;
  artist?: string | { name: string };
  language?: string;
};

type Props = {
  song?: Song;
  onPress?: () => void;
  type?: 'default' | 'search';
};

const SongCardList: React.FC<Props> = ({
  song: item,
  type = 'default',
  onPress,
}) => {
  return (
    <div className={styles.card} onClick={onPress}>
      {type === 'default' ? (
        <div className={styles.imgContainer}>
          {item?.coverUrl ? (
            <Image
              src={item.coverUrl}
              alt={item.title || 'Song Cover'}
              style={{
                objectFit: 'cover',
                borderRadius: '2px',
                height: '100%',
                width: '100%',
              }}
              width={120}
              height={120}
            />
          ) : (
            <div className={styles.placeholderImage}></div>
          )}
        </div>
      ) : (
        <div className={styles.iconBox}>
          <FaMusic size={24} color="#999" />
        </div>
      )}

      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <span className={styles.title}>{item?.title}</span>
          <span className={styles.artist}>
            {typeof item?.artist === 'object'
              ? item?.artist?.name
              : item?.artist}
          </span>
        </div>

        {type === 'default' && (
          <div className={styles.iconRight}>
            <audio controls>
              <source style={{width:'10px'}} src={item?.musicUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <FaEllipsisV size={22} color="#333" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SongCardList;
