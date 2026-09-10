import './App.css'
import AppRoutes from './routes/AppRoutes'
import { SiteContentProvider, useSiteContent } from '@/context/SiteContentContext'
import { ToastProvider } from '@/context/ToastContext'
import { useDocumentMeta } from '@/lib/useDocumentMeta'

const MetaSync = ({ children }) => {
  const { settings } = useSiteContent()
  useDocumentMeta(settings)
  return children
}

function App() {
  return (
    <ToastProvider>
      <SiteContentProvider>
        <MetaSync>
          <AppRoutes />
        </MetaSync>
      </SiteContentProvider>
    </ToastProvider>
  )
}

export default App
