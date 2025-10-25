import React from 'react';
import { User, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full flex items-center justify-end gap-4 text-sm text-gray-700 px-6 py-4">
      <a href="#" className="hover:underline">Gmail</a>
      <a href="#" className="hover:underline">Images</a>
      <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Settings"><Settings size={18} /></button>
      <button className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center" aria-label="User"><User size={18} /></button>
    </header>
  );
}
