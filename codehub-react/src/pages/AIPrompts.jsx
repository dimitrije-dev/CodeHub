import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api.js'
import { usePageTitle } from '../hooks/usePageTitle.js'

const STORAGE_KEY = 'codehub_ai_prompt_sessions_v1'

const TEMPLATE_LIBRARY = [
  {
    id: 'bug-fix',
    title: 'Fix a bug safely',
    description: 'Ask the agent to reproduce, isolate root cause, and patch with validation.',
    intent: 'bug_fix',
  },
  {
    id: 'refactor',
    title: 'Refactor with no regressions',
    description: 'Improve code structure while preserving behavior and test coverage.',
    intent: 'refactor',
  },
  {
    id: 'tests',
    title: 'Generate practical tests',
    description: 'Create meaningful tests around edge cases and expected behavior.',
    intent: 'tests',
  },
  {
    id: 'review',
    title: 'Code review mode',
    description: 'Focus on risks, regressions, and missing validations before merge.',
    intent: 'review',
  },
  {
    id: 'explain',
    title: 'Explain complex module',
    description: 'Break down architecture, flow, and implementation details clearly.',
    intent: 'explain',
  },
]

function buildPrompt({ agent, template, task, notes }) {
  const subject = task?.title?.trim() || 'General engineering task'
  const context = task?.description?.trim() || 'No additional task description provided.'
  const extraNotes = notes?.trim() || 'No extra notes.'

  const shared = [
    `You are acting as ${agent}.`,
    `Primary objective: ${template.title}.`,
    `Task title: ${subject}.`,
    `Task context: ${context}`,
    `Additional notes: ${extraNotes}`,
    'Output requirements:',
    '- First provide a short diagnosis/plan.',
    '- Then provide concrete code-level changes.',
    '- List affected files and why each change is needed.',
    '- Add a verification checklist (tests or manual checks).',
    '- Mention possible risks or edge cases explicitly.',
  ]

  if (template.intent === 'bug_fix') {
    shared.push('Bug-fix mode: prioritize root cause over superficial patching.')
  }

  if (template.intent === 'refactor') {
    shared.push('Refactor mode: preserve public behavior and improve readability/maintainability.')
  }

  if (template.intent === 'tests') {
    shared.push('Test mode: include positive, negative, and edge-case scenarios.')
  }

  if (template.intent === 'review') {
    shared.push('Review mode: prioritize bugs, regressions, and missing tests over style concerns.')
  }

  if (template.intent === 'explain') {
    shared.push('Explain mode: present architecture and flow in concise, practical terms.')
  }

  return shared.join('\n')
}

export default function AIPrompts() {
  usePageTitle('AI Prompts')

  const [tasks, setTasks] = useState([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [error, setError] = useState('')
  const [selectedAgent, setSelectedAgent] = useState('Codex')
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATE_LIBRARY[0].id)
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [notes, setNotes] = useState('')
  const [copyState, setCopyState] = useState('')
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    let mounted = true

    async function loadTasks() {
      try {
        const taskData = await api.get('/api/tasks')
        if (!mounted) return
        setTasks(taskData)
      } catch (loadError) {
        if (mounted) setError(loadError.message || 'Failed to load tasks for prompt generation.')
      } finally {
        if (mounted) setLoadingTasks(false)
      }
    }

    loadTasks()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) setSessions(parsed)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 20)))
  }, [sessions])

  const selectedTemplate = useMemo(
    () => TEMPLATE_LIBRARY.find((template) => template.id === selectedTemplateId) || TEMPLATE_LIBRARY[0],
    [selectedTemplateId],
  )

  const selectedTask = useMemo(
    () => tasks.find((task) => String(task.id) === selectedTaskId) || null,
    [tasks, selectedTaskId],
  )

  const generatedPrompt = useMemo(() => buildPrompt({
    agent: selectedAgent,
    template: selectedTemplate,
    task: selectedTask,
    notes,
  }), [selectedAgent, selectedTemplate, selectedTask, notes])

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopyState('Copied to clipboard')
      setTimeout(() => setCopyState(''), 2200)
    } catch {
      setCopyState('Copy failed on this browser')
      setTimeout(() => setCopyState(''), 2200)
    }
  }

  function saveSession() {
    const item = {
      id: `${Date.now()}`,
      timestamp: new Date().toISOString(),
      agent: selectedAgent,
      templateTitle: selectedTemplate.title,
      taskTitle: selectedTask?.title || 'No task selected',
      notes: notes.trim() || '-',
      prompt: generatedPrompt,
    }

    setSessions((prev) => [item, ...prev].slice(0, 20))
    setCopyState('Session saved')
    setTimeout(() => setCopyState(''), 2200)
  }

  function copySavedPrompt(promptText) {
    try {
      navigator.clipboard.writeText(promptText)
      setCopyState('Saved prompt copied')
    } catch {
      setCopyState('Unable to copy saved prompt')
    }
    setTimeout(() => setCopyState(''), 2200)
  }

  return (
    <div className="panel-grid ai-page">
      <section className="card hero-card ai-hero">
        <div className="ai-hero-head">
          <div>
            <h1 className="page-title">AI Prompts</h1>
            <p className="page-subtitle">
              Build stronger prompts for Codex and Claude in seconds, directly from your active tasks.
            </p>
          </div>
          <div className="ai-agent-chips" role="tablist" aria-label="Agent selector">
            {['Codex', 'Claude'].map((agent) => (
              <button
                key={agent}
                className={`ai-chip ${selectedAgent === agent ? 'active' : ''}`}
                onClick={() => setSelectedAgent(agent)}
              >
                {agent}
              </button>
            ))}
          </div>
        </div>

        <div className="ai-template-grid">
          {TEMPLATE_LIBRARY.map((template) => (
            <button
              key={template.id}
              className={`ai-template-card ${selectedTemplateId === template.id ? 'active' : ''}`}
              onClick={() => setSelectedTemplateId(template.id)}
            >
              <div className="ai-template-title">{template.title}</div>
              <div className="ai-template-text">{template.description}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="ai-layout">
        <article className="card panel-grid">
          <div className="page-header">
            <h2>Prompt Builder</h2>
            {copyState && <span className="status-pill">{copyState}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="task-select">Attach task context</label>
            <select
              id="task-select"
              className="input"
              value={selectedTaskId}
              onChange={(event) => setSelectedTaskId(event.target.value)}
              disabled={loadingTasks}
            >
              <option value="">No task selected</option>
              {tasks.map((task) => (
                <option key={task.id} value={String(task.id)}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ai-notes">Additional notes for the agent</label>
            <textarea
              id="ai-notes"
              className="textarea"
              placeholder="e.g. Preserve current API response format and avoid schema changes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="inline-actions">
            <button className="btn btn-primary" onClick={copyPrompt}>Copy prompt</button>
            <button className="btn btn-outline" onClick={saveSession}>Save session</button>
          </div>

          <div className="ai-prompt-preview">
            <div className="ai-prompt-preview-title">Generated prompt</div>
            <pre>{generatedPrompt}</pre>
          </div>
        </article>

        <article className="card panel-grid ai-session-card">
          <div className="page-header">
            <h2>Session Log</h2>
            <span className="page-subtitle">Latest 20 prompts</span>
          </div>

          {sessions.length === 0 ? (
            <div className="empty-state">No saved sessions yet. Build and save your first prompt.</div>
          ) : (
            <div className="ai-session-list">
              {sessions.map((session) => (
                <div key={session.id} className="ai-session-item">
                  <div className="ai-session-meta">
                    <span>{session.agent}</span>
                    <span>{new Date(session.timestamp).toLocaleString('en-GB')}</span>
                  </div>
                  <div className="ai-session-title">{session.templateTitle}</div>
                  <div className="ai-session-subtitle">Task: {session.taskTitle}</div>
                  <button className="btn btn-outline" onClick={() => copySavedPrompt(session.prompt)}>
                    Copy saved prompt
                  </button>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  )
}
