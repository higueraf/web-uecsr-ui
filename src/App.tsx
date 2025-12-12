
import './App.css'
import { AppRouter } from './router/AppRouter'
import { LoadingOverlay } from './components/common/LoadingOverlay'

function App() {
  

  return (

    <>
        <AppRouter />
      <LoadingOverlay /> 

    </>
  )
}

export default App
