// components/BadgesPanel.jsx
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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Earned Badges</h2>
        <div className="flex flex-wrap gap-4">
          {earned.length > 0
            ? earned.map(label => (
                <div key={label} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-2xl">
                    ★
                  </div>
                  <span className="text-sm mt-1">{label}</span>
                </div>
              ))
            : <p className="text-gray-500">No badges yet</p>
          }
        </div>
      </div>
    );
  }
  