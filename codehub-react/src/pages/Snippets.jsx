import { useEffect, useMemo, useState } from 'react'
import SnippetCard from '../snippets/SnippetCard.jsx'
import { api } from '../services/api.js'
import { usePageTitle } from '../hooks/usePageTitle.js'

export default function Snippets() {
  usePageTitle('Snippets')

  const [snippets, setSnippets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [form, setForm] = useState({ title: '', language: 'javascript', code: '' })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', language: 'javascript', code: '' })

  useEffect(() => {
    let mounted = true

    async function loadSnippets() {
      try {
        const data = await api.get('/api/snippets')
        if (mounted) setSnippets(data)
      } catch (error) {
        if (mounted) setError(error.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadSnippets()
    return () => {
      mounted = false
    }
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    setError('')

    try {
      const payload = {
        title: form.title,
        language: form.language,
        code: form.code,
      }
      const created = await api.post('/api/snippets', payload)
      setSnippets((previous) => [created, ...previous])
      setForm({ title: '', language: 'javascript', code: '' })
    } catch (error) {
      setError(error.message)
    }
  }

  function startEdit(snippet) {
    setEditingId(snippet.id)
    setEditForm({ title: snippet.title, language: snippet.language, code: snippet.code })
  }

  async function saveEdit(e) {
    e.preventDefault()
    try {
      const payload = {
        title: editForm.title,
        language: editForm.language,
        code: editForm.code,
      }
      const updated = await api.put(`/api/snippets/${editingId}`, payload)
      setSnippets((list) => list.map((snippet) => (snippet.id === editingId ? updated : snippet)))
      setEditingId(null)
    } catch (error) {
      setError(error.message)
    }
  }

  async function removeSnippet(id) {
    try {
      await api.delete(`/api/snippets/${id}`)
      setSnippets((list) => list.filter((snippet) => snippet.id !== id))
    } catch (error) {
      setError(error.message)
    }
  }

  const filteredSnippets = useMemo(() => {
    if (!query.trim()) return snippets

    const needle = query.toLowerCase()
    return snippets.filter((snippet) => {
      const title = (snippet.title || '').toLowerCase()
      const code = (snippet.code || '').toLowerCase()
      const language = (snippet.language || '').toLowerCase()
      return title.includes(needle) || code.includes(needle) || language.includes(needle)
    })
  }, [query, snippets])

  return (
    <div className="panel-grid">
      <section className="card panel-grid">
        <div className="page-header">
          <div>
            <h1 className="page-title">Snippets</h1>
            <p className="page-subtitle">Store reusable code and find it in seconds.</p>
          </div>
        </div>

        <form onSubmit={handleAdd} className="snippet-form">
          <input
            className="input"
            placeholder="Snippet title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          />

          <select
            className="input"
            value={form.language}
            onChange={(event) => setForm((prev) => ({ ...prev, language: event.target.value }))}
          >
            <option>javascript</option>
            <option>typescript</option>
            <option>python</option>
            <option>java</option>
            <option>csharp</option>
            <option>html</option>
            <option>css</option>
            <option>sql</option>
          </select>

          <textarea
            className="textarea"
            placeholder="Snippet code..."
            rows={8}
            value={form.code}
            onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
          />

          <button type="submit" className="btn btn-primary">Save snippet</button>
        </form>

        {error && <div className="error-message">{error}</div>}
      </section>

      <section className="card panel-grid">
        <div className="page-header">
          <h3>Library</h3>
          <input
            className="input"
            placeholder="Search by title, language, or code"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={{ maxWidth: '360px' }}
          />
        </div>

        {loading ? (
          <div>Loading snippets...</div>
        ) : filteredSnippets.length === 0 ? (
          <div className="empty-state">No snippets available.</div>
        ) : (
          <div className="data-grid">
            {filteredSnippets.map((snippet) => (
              <div key={snippet.id}>
                {editingId === snippet.id ? (
                  <div className="snippet-card">
                    <form onSubmit={saveEdit} className="snippet-form">
                      <input
                        className="input"
                        value={editForm.title}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, title: event.target.value }))}
                      />

                      <select
                        className="input"
                        value={editForm.language}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, language: event.target.value }))}
                      >
                        <option>javascript</option>
                        <option>typescript</option>
                        <option>python</option>
                        <option>java</option>
                        <option>csharp</option>
                        <option>html</option>
                        <option>css</option>
                        <option>sql</option>
                      </select>

                      <textarea
                        className="textarea"
                        rows={8}
                        value={editForm.code}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, code: event.target.value }))}
                      />

                      <div className="inline-actions">
                        <button type="submit" className="btn btn-primary">Save</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <SnippetCard
                    snippet={snippet}
                    onEdit={() => startEdit(snippet)}
                    onDelete={() => removeSnippet(snippet.id)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
