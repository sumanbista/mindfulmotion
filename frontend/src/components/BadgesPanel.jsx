// components/BadgesPanel.jsx
import React from 'react';

export default function BadgesPanel({ stats }) {
    const badgeDefinitions = [
        { key: 'posts', label: 'First Post', threshold: 1 },
        { key: 'posts', label: 'Contributor', threshold: 5 },
        { key: 'comments', label: 'First Comment', threshold: 1 },
        { key: 'comments', label: 'Conversationalist', threshold: 10 },
        { key: 'lovesReceived', label: 'Loved Once', threshold: 1 },
        { key: 'lovesReceived', label: 'Popular', threshold: 10 },
    ];

    const earned = badgeDefinitions
      .filter(b => (stats[b.key] || 0) >= b.threshold)
      .map(b => b.label);

    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-teal-700">Earned Badges</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {earned.length > 0
            ? earned.map(label => (
                <div key={label} className="flex flex-col items-center text-center w-20">
                  <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-2xl shadow-inner">
                    ✨
                  </div>
                  <span className="text-sm mt-2 font-medium text-gray-700">{label}</span>
                </div>
              ))
            : <p className="text-gray-600 italic text-center w-full">No badges earned yet. Engage with the community to earn some!</p>
          }
        </div>
      </div>
    );
  }