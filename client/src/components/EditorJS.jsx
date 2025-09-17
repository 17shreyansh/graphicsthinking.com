import { useEffect, useRef } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Paragraph from '@editorjs/paragraph'
import Image from '@editorjs/image'
import Quote from '@editorjs/quote'
import Code from '@editorjs/code'

const EditorJSComponent = ({ data, onChange, placeholder = 'Start writing...' }) => {
  const editorRef = useRef(null)
  const editorInstance = useRef(null)

  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        holder: editorRef.current,
        placeholder,
        data: data || {},
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a header',
              levels: [1, 2, 3, 4],
              defaultLevel: 2
            }
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true
          },
          list: {
            class: List,
            inlineToolbar: true
          },
          image: {
            class: Image,
            config: {
              endpoints: {
                byFile: '/api/upload/image',
                byUrl: '/api/upload/image'
              },
              field: 'image',
              types: 'image/*'
            }
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Quote author'
            }
          },
          code: {
            class: Code,
            config: {
              placeholder: 'Enter code'
            }
          }
        },
        onChange: async () => {
          if (onChange) {
            const outputData = await editorInstance.current.save()
            onChange(outputData)
          }
        }
      })
    }

    return () => {
      if (editorInstance.current && typeof editorInstance.current.destroy === 'function') {
        editorInstance.current.destroy()
        editorInstance.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (editorInstance.current && data && data.blocks) {
      editorInstance.current.isReady.then(() => {
        editorInstance.current.render(data)
      }).catch(console.error)
    }
  }, [data])

  return <div ref={editorRef} style={{ minHeight: '200px' }} />
}

export default EditorJSComponent