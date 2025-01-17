'use client';

import { useState, useEffect } from 'react';
import { getChats, removeChat, shareChat } from '../../store/actions';
import { SidebarActions } from './sidebar-actions';
import { SidebarItem } from './sidebar-item';

export default function SidebarList({ userId }) {
  const [chats, setChats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getChats(userId);
        setChats(data);
      } catch (err) {
        console.error("Error fetching chats:", err); // Log the error
        setError(err); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [userId]); // Re-fetch if userId changes

  if (isLoading) {
    return <div className="p-8 text-center">Loading chats...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">Error loading chats</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {chats?.length ? (
        <div className="space-y-2 px-2">
          {chats.map(chat => ( 
            <SidebarItem key={chat?.id ?? 'default-key'} chat={chat}> 
              {chat.path && chat.title && ( // Check for required properties
                <SidebarActions
                  chat={chat}
                  removeChat={removeChat}
                  shareChat={shareChat}
                />
              )}
            </SidebarItem>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No chats found.</p> 
        </div>
      )}
    </div>
  );
}