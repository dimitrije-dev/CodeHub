import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java'
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql'
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('csharp', csharp)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('sql', sql)
SyntaxHighlighter.registerLanguage('markup', markup)

const LANGUAGE_ALIASES = {
  js: 'javascript',
  ts: 'typescript',
  html: 'markup',
  csharp: 'csharp',
  'c#': 'csharp',
}

export default function SnippetCard({ snippet, onEdit, onDelete }) {
  const { title, code, language = 'javascript' } = snippet
  const normalizedLanguage = LANGUAGE_ALIASES[language?.toLowerCase()] || language

  return (
    <div className="snippet-card">
      <div className="snippet-card-head">
        <div>
          <div className="snippet-title">{title}</div>
          <div className="snippet-lang">{language}</div>
        </div>

        <div className="snippet-actions">
          <button className="btn btn-outline" onClick={onEdit}>Uredi</button>
          <button className="btn btn-outline" style={{ color: 'var(--danger)' }} onClick={onDelete}>Obriši</button>
        </div>
      </div>

      <div className="snippet-code-wrap">
        <SyntaxHighlighter
          language={normalizedLanguage}
          style={oneLight}
          customStyle={{
            margin: 0,
            padding: '14px',
            background: 'var(--surface-soft)',
            fontSize: '13px',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
            lineHeight: '1.55',
            maxHeight: '340px',
          }}
          showLineNumbers
          lineNumberStyle={{
            color: '#8ea0b8',
            minWidth: '28px',
            marginRight: '10px',
          }}
        >
          {code || ''}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
