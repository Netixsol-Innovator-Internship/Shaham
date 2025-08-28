'use client'
import { useState, useEffect } from 'react'
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from 'draft-js'
import 'draft-js/dist/Draft.css'

export default function RichTextEditor({
  defaultValue,
  onChange,
  resetSignal, // use this to clear editor after submit
}: {
  defaultValue?: string
  onChange?: (content: string) => void
  resetSignal?: any
}) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  // Load initial value
  useEffect(() => {
    if (defaultValue) {
      try {
        const raw = JSON.parse(defaultValue)
        setEditorState(EditorState.createWithContent(convertFromRaw(raw)))
      } catch {
        setEditorState(EditorState.createEmpty())
      }
    }
  }, [defaultValue])

  // Reset editor when resetSignal changes
  useEffect(() => {
    if (resetSignal !== undefined) {
      setEditorState(EditorState.createEmpty())
    }
  }, [resetSignal])

  const handleChange = (state: EditorState) => {
    setEditorState(state)
    if (onChange) {
      const raw = convertToRaw(state.getCurrentContent())
      onChange(JSON.stringify(raw))
    }
  }

  const handleKeyCommand = (command: string) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      handleChange(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  return (
    <div className="border rounded p-2 min-h-[120px] cursor-text">
      <Editor
        editorState={editorState}
        onChange={handleChange}
        handleKeyCommand={handleKeyCommand}
        placeholder="Write your comment..."
      />
    </div>
  )
}
