import { CloudUploadIcon } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'

interface UploadProps {
  onUploadComplete?: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
}

const DragAndDropUpload: React.FC<UploadProps> = ({
  onUploadComplete,
  maxFiles = 6,
  maxSize = 5242880 * 6, // 5MB
}) => {
  const [files, setFiles] = useState<File[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)

  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    setUploadError(null)
    if (onUploadComplete) {
      onUploadComplete(acceptedFiles)
    }
  }, [onUploadComplete])

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const errors = fileRejections.map(
      (rejection) => `${rejection.file.name}: ${rejection.errors[0].message}`
    )
    setUploadError(errors.join('\n'))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    maxFiles,
    maxSize,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
    },
  })

  return (
    <div 
      className="py-2 w-full border border-dashed rounded-2xl border-gray-400">
      <div
        {...getRootProps()}
        className={`flex justify-center dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here</p>
        ) : (
          <div className='flex items-center justify-center'>
            <p>Drag and Drop images here, or</p>
            <span className='rounded-full bg-gray-white w-7 h-7 flex justify-center items-center ms-1.5'>
              <CloudUploadIcon size={17}/>
            </span>
          </div>
        )}
      </div>

      {uploadError && <div className="error-message">{uploadError}</div>}

      {files.length > 0 && (
        <div className="file-list flex flex-col items-center">
          <h4>Selected Files:</h4>
          <ul>
            {files.map((file) => (
              <li key={file.name}>
                {file.name} - {(file.size / 1024).toFixed(2)} KB
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DragAndDropUpload