import './App.css'
import AppRoutes from './routes/AppRoutes'
import { SiteContentProvider, useSiteContent } from '@/context/SiteContentContext'
import { useDocumentMeta } from '@/lib/useDocumentMeta'

const MetaSync = ({ children }) => {
  const { settings } = useSiteContent()
  useDocumentMeta(settings)
  return children
}

function App() {
  return (
    <SiteContentProvider>
      <MetaSync>
        <AppRoutes />
      </MetaSync>
    </SiteContentProvider>
  )
}

export default App
