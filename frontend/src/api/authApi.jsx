import api from './axios'


import React from 'react'

export const authApi =  {
login: async(email , password)=>{
    const res=await api.post('/auth/login',{email,password})
    return res.data
},
logout:async(token)=>{
    const res=await api.post('/auth/logout',
        {},
        {
            headers: {
                    Authorization: `Bearer ${token}`
                }
        }
    )
}

}

 
