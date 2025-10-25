import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto text-gray-600/90">
      <div className="border-t border-gray-200/80 bg-gray-50/80">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Advertising</a>
            <a href="#" className="hover:underline">Business</a>
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">How Search works</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
