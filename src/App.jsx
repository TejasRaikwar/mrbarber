import './App.css'
import AppRoutes from './routes/AppRoutes'
import { SiteContentProvider, useSiteContent } from '@/context/SiteContentContext'
import { ThemeProvider } from '@/context/ThemeContext'
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
      {/* ThemeProvider reads the site theme from settings, so it sits inside. */}
      <SiteContentProvider>
        <ThemeProvider>
          <MetaSync>
            <AppRoutes />
          </MetaSync>
        </ThemeProvider>
      </SiteContentProvider>
    </ToastProvider>
  )
}

export default App
