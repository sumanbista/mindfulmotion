import React, { useState, useEffect } from 'react'
import SessionCard from '../components/SessionCard'

export default function Meditation() {
  const [sessions, setSessions]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null)

  // pagination + filter state
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage]           = useState(1)
  const sessionsPerPage                         = 6

  const categories = ['all','relax','focus','sleep','energy','mindfulness']

  // fetch once
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('http://localhost:5000/api/sessions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        if (!res.ok) throw new Error(res.statusText)
        setSessions(await res.json())
      } catch (e) {
        setError('Could not load sessions')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // when category changes, reset page
  useEffect(() => { setCurrentPage(1) }, [selectedCategory])

  if (loading) return    <p>Loading…</p>
  if (error)   return    <p className="text-red-600">{error}</p>

  // filter & paginate
  const filtered = selectedCategory === 'all'
    ? sessions
    : sessions.filter(s => s.focus.toLowerCase() === selectedCategory)

  const startIdx = (currentPage-1)*sessionsPerPage
  const page    = filtered.slice(startIdx, startIdx + sessionsPerPage)
  const total   = Math.ceil(filtered.length / sessionsPerPage)

  return (
    <div>
      <h2>Meditation Sessions</h2>

      {/* Category pills */}
      <div className="flex gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={()=>setSelectedCategory(cat)}
            className={
              `px-3 py-1 rounded-full ${
                cat===selectedCategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`
            }>
            {cat.charAt(0).toUpperCase()+cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Session grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {page.map(session => (
          <SessionCard
            key={session._id}
            {...session}
            currentlyPlaying={currentlyPlaying}
            setCurrentlyPlaying={setCurrentlyPlaying}
            onRatingChange={newRating => {
              // POST rating to backend
              const token = localStorage.getItem('token')
              fetch(`http://localhost:5000/api/sessions/${session._id}/ratings`, {
                method: 'POST',
                headers: {
                  'Content-Type':'application/json',
                  'Authorization':`Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({rating: newRating })
              })
              .then(r=>r.json())
              .then(({averageRating})=>{
                // update UI optimistically
                session.rating = averageRating
                setSessions([...sessions])
              })
            }}
          />
        ))}
      </div>

      {/* Pagination controls */}
      {total>1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={()=>currentPage>1&&setCurrentPage(currentPage-1)}
            disabled={currentPage===1}
            className="px-3 py-1 rounded"
          >‹</button>

          {Array.from({length:total},(_,i)=>i+1).map(n=>(
            <button
              key={n}
              onClick={()=>setCurrentPage(n)}
              className={`px-3 py-1 rounded ${
                n===currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >{n}</button>
          ))}

          <button
            onClick={()=>currentPage<total&&setCurrentPage(currentPage+1)}
            disabled={currentPage===total}
            className="px-3 py-1 rounded"
          >›</button>
        </div>
      )}
    </div>
  )
}
