import './App.css'
import Providers from './providers'

function App() {
  return (
    <html lang="en">
      <body className="dark:bg-black dark:text-neutral-400 h-screen">
        <Providers>
          <Toaster richColors position='top-right' />
        </Providers>
      </body>
    </html>
  )
}

export default App
