import React from 'react';
import { Search, Mic, Camera } from 'lucide-react';

export default function SearchBox() {
  return (
    <div className="w-full flex flex-col items-center gap-6 px-4" style={{ height: '28vh' }}>
      <div className="w-full max-w-[580px] flex items-center gap-3 rounded-full border border-gray-200/80 bg-white shadow-sm px-4 py-2 hover:shadow transition-shadow">
        <Search size={20} className="text-gray-400" />
        <input
          aria-label="Search"
          className="flex-1 outline-none text-[16px] placeholder:text-gray-400"
          placeholder="Search Google or type a URL"
        />
        <div className="flex items-center gap-3 text-gray-500">
          <Mic size={20} />
          <Camera size={20} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200 transition-colors">Google Search</button>
        <button className="px-4 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200 transition-colors">I'm Feeling Lucky</button>
      </div>
    </div>
  );
}
