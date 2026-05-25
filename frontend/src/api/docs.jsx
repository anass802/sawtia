import api from "./axios";

export const DocsApi={
    upload:async(Docsdata)=>{
        const res = await api.post('documents/upload',Docsdata)
        return res.data
    },
    loadDoc:async()=>{
        const res=await api.get('/documents/knowledge')
        return res.data
    }
}