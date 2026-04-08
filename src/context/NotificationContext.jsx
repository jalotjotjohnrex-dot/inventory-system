import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [shownToastIds] = useState(new Set()); 
  
  const userOffice = localStorage.getItem('userOffice');
  const userRole = localStorage.getItem('userRole'); // Capture Role

  const fetchNotifications = useCallback(async () => {
    // [FIX] Allow Administrators to fetch notifications even if office is null
    const isReady = userOffice || userRole === 'admin';
    if (!isReady) return;
    
    try {
      // If admin, fetch global feed; otherwise fetch office feed
      const endpoint = userRole === 'admin' 
        ? '/api/notifications/admin/all' 
        : `/api/notifications/${encodeURIComponent(userOffice)}`;

      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        
        // [REAL-TIME ENGINE] Automated pop-up logic
        if (!isInitialLoad) {
           const newItems = data.filter(n => !shownToastIds.has(n.notification_id));
           newItems.forEach(item => {
              showToast(item.message, 'info');
              shownToastIds.add(item.notification_id);
           });
        } else {
           // Prep the toasted set to avoid spamming existing items on start
           data.forEach(n => shownToastIds.add(n.notification_id));
           setIsInitialLoad(false);
        }
        
        setNotifications(data);
        setUnreadCount(data.length);
      }
    } catch (err) {
      console.error('Failed to fetch automated notifications:', err);
    }
  }, [userOffice, userRole, isInitialLoad, shownToastIds, showToast]);

  const markAllAsRead = async () => {
    const isReady = userOffice || userRole === 'admin';
    if (!isReady) return;
    
    try {
      const endpoint = userRole === 'admin'
        ? '/api/notifications/admin/all/read'
        : `/api/notifications/${encodeURIComponent(userOffice)}/read`;

      const res = await fetch(endpoint, { method: 'PUT' });
      if (res.ok) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 4000); // Accelerated to 4s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, refresh: fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
