"use client";

import { createContext, useContext, useState } from "react";
import { notifications } from "../data/notifications";

interface NotificationContextProps {
  notifications: { id: number; title: string; date: string }[];
}

const NotificationContext = createContext<NotificationContextProps>({ notifications: [] });

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notificationList] = useState(notifications);

  return (
    <NotificationContext.Provider value={{ notifications: notificationList }}>
      {children}
    </NotificationContext.Provider>
  );
};
