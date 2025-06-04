//FollowersModal.jsx
import React from 'react';

export default function FollowersModal({ title, people, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* card */}
      <div className="relative bg-zinc-900 text-white rounded-xl p-6 max-w-xs w-full space-y-4">
        <h2 className="text-xl font-semibold">{title}</h2>

        {Array.isArray(people) && people.length > 0 ? (
            <ul className="space-y-2 max-h-64 overflow-auto pr-1">
                {people.map((p) => (
                <li key={p.id} className="flex items-center gap-3 border-b border-white/10 pb-2 last:border-none">
                    <img src={p.avatar} className="h-8 w-8 rounded-full object-cover" />
                    <span>{p.name}</span>
                </li>
                ))}
            </ul>
            ) : (
            <p className="text-sm text-white/50">None yet…</p>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-lg leading-none hover:text-red-400"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
