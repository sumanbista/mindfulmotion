// components/Leaderboard.jsx
export default function Leaderboard({ board }) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
        <ol className="space-y-2">
          {board.map((u, i) => (
            <li key={u.name + i} className="flex justify-between">
              <span>{i+1}. {u.name}</span>
              <span className="font-semibold text-pink-600">{u.score} pts</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }
  