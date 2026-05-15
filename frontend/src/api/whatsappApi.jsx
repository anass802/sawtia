import api from "./axios";

export const whatsappAPI ={
    connect: async()=>{
        const res=await api.post('/whatsapp/connect');
        return res.data
    },
    qr:async(userId)=>{
        const res=await api.get(`/whatsapp/qr/${userId}`)
        return res.data
    },
    status:async(userId)=>{
        const res=await api.get(`/whatsapp/status/${userId}`)
        return res.data
    },
    disconnect:async()=>{
        const res=await api.post('/whatsapp/disconnect')
        return res.data
    }
}