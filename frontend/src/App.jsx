
import { Routes, Route } from "react-router-dom"
import Sawtia from "./layouts/sawtia"
import AIParameters from "./pages/AIParameters"
import WhatsAppSync from "./pages/WhatsAppSync"
import AuthPage from "./pages/AuthPage"

const App = () => {
  return (
    
    <Routes>
      <Route path="/auth" element={<AuthPage/>} />
      <Route element={<Sawtia/>}>
        <Route path="/" element={<AIParameters/>} />
        <Route path="/whatss-appsync" element={<WhatsAppSync/>} />
      </Route>
    </Routes>
    
  )
}

export default App