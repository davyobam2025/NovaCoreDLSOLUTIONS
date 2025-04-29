"use client";

import { Menu } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../contexts/NotificationContext';

export default function NotificationMenu() {
  const { notifications } = useNotifications();

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="relative">
        <BellIcon className="h-8 w-8 text-indigo-700 hover:text-indigo-900" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-64 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div className="p-2">
          {notifications.map((notif) => (
            <Menu.Item key={notif.id}>
              {({ active }) => (
                <div className={`p-2 rounded-md ${active ? "bg-gray-100" : ""}`}>
                  {notif.title}
                </div>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
}
