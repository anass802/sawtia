
import { Routes, Route } from "react-router-dom"
import Sawtia from "./layouts/sawtia"
import AIParameters from "./pages/AIParameters"
import WhatsAppSync from "./pages/WhatsAppSync"
import DocumentsPDF from "./pages/Documentspdf"
import AuthPage from "./pages/AuthPage"
import BroadcastPage from "./pages/Broadcastpage"
import ComingSoon from "./pages/Comingsoon "
import WebScanner from "./pages/Webscanner"

const App = () => {
  return (
    
    <Routes>
      <Route path="/" element={<AuthPage/>} />
      <Route element={<Sawtia/>}>
        <Route path="/ai-parametre" element={<AIParameters/>} />
        <Route path="/whatss-appsync" element={<WhatsAppSync/>} />
        <Route path="/doc-indexed" element={<DocumentsPDF/>} />
        <Route path="/broadcast" element={<BroadcastPage/>}/>
        <Route path="/comingsoon" element={<ComingSoon/>}/>
        <Route path="/webscanner" element={<WebScanner/>}/>
      </Route>
    </Routes>
    
  )
}

export default App