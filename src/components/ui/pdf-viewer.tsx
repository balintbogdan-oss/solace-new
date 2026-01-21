'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react'

interface PDFViewerProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title?: string
}

export function PDFViewer({ isOpen, onClose, pdfUrl, title = "Document Viewer" }: PDFViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(100)
      setRotation(0)
      setCurrentPage(1)
      setIsLoading(true)
      setError(null)
    }
  }, [isOpen])

  // Reload iframe when zoom or rotation changes
  useEffect(() => {
    if (iframeRef.current && isOpen) {
      const newSrc = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&zoom=${zoom}&rotate=${rotation}&page=${currentPage}`
      iframeRef.current.src = newSrc
    }
  }, [zoom, rotation, currentPage, pdfUrl, isOpen])


  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  // Handle iframe error
  const handleIframeError = () => {
    setIsLoading(false)
    setError('Failed to load PDF. Please try downloading the document instead.')
  }

  // Download PDF
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = title || 'document.pdf'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Zoom controls
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 300))
    setIsLoading(true)
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50))
    setIsLoading(true)
  }

  const handleResetZoom = () => {
    setZoom(100)
    setIsLoading(true)
  }

  // Rotation controls
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
    setIsLoading(true)
  }

  // Page navigation
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages || 1))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] w-[95vw] h-[95vh] p-0 flex flex-col bg-white dark:bg-gray-900"
        aria-describedby="pdf-viewer-description"
      >
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold truncate">
              {title}
            </DialogTitle>
            <div id="pdf-viewer-description" className="sr-only">
              PDF document viewer with zoom, rotation, and navigation controls
            </div>
          </div>
        </DialogHeader>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Zoom controls */}
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="h-8 w-8"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleResetZoom}
                className="h-8 w-16"
              >
                <span className="text-sm">{zoom}%</span>
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoom >= 300}
                className="h-8 w-8"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>

              {/* Rotation */}
              <Button
                variant="outline"
                size="icon"
                onClick={handleRotate}
                className="h-8 w-8"
              >
                <RotateCw className="h-4 w-4" />
              </Button>

              {/* Page navigation */}
              <div className="flex items-center gap-1 ml-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousPage}
                  disabled={currentPage <= 1}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="h-8 w-16 flex items-center justify-center text-sm text-muted-foreground bg-muted/50 rounded-md border">
                  {currentPage} / {totalPages || '?'}
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextPage}
                  disabled={currentPage >= (totalPages || 1)}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Download button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="h-8"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 relative bg-gray-100 dark:bg-gray-900 overflow-hidden min-h-0">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading PDF...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-red-500 mb-2">⚠️</div>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Instead
                </Button>
              </div>
            </div>
          )}

          <iframe
            key={`${zoom}-${rotation}-${currentPage}`}
            ref={iframeRef}
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&zoom=${zoom}&rotate=${rotation}&page=${currentPage}`}
            className={`absolute inset-0 w-full h-full border-0 ${
              isLoading || error ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title={title}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'opacity 0.3s ease-in-out',
              height: '100%',
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
