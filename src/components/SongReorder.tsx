'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import SongCardList from '@/components/SongCardList';
import { useRouter } from 'next/navigation';

interface Song {
    id: string;
    title: string;
    artist?: string | { name: string };
    coverUrl?: string | null;
    // Add other fields your SongCardList needs
}

interface Props {
    songs: Song[];
    onOrderChange?: (newOrder: Song[]) => void;
}

export default function SongReorder({ songs: initialSongs, onOrderChange }: Props) {
    const [songs, setSongs] = useState<Song[]>(initialSongs);
    const router = useRouter();

    // Sync local state if initialSongs changes (optional)
    useEffect(() => {
        setSongs(initialSongs);
    }, [initialSongs]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const reordered = Array.from(songs);
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);

        setSongs(reordered);

        if (onOrderChange) {
            onOrderChange(reordered);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="songs-droppable">
                {(provided) => (
                    <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="grid gap-4"
                    >
                        {songs.map((song, index) => (
                            <div className='h-21'>
                                <Draggable key={song.id} draggableId={song.id} index={index}>
                                    {(provided, snapshot) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                userSelect: 'none',
                                                background: snapshot.isDragging ? '#e0f2fe' : 'white',
                                                ...provided.draggableProps.style,
                                            }}
                                        >
                                            <SongCardList
                                                song={song}
                                                onPress={() =>
                                                    router.push(`/songs/${song.title.replace(/\s+/g, '-')}-${song.id}`)
                                                }
                                                type="default"
                                            />
                                        </li>
                                    )}
                                </Draggable>
                            </div>
                        ))}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    );
}
