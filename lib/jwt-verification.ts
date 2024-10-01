import { NextResponse } from 'next/server';
import { getCookie } from 'typescript-cookie';
import jwt from 'jsonwebtoken'

export const authenticate = () => {
    try{
        let token = getCookie('uia')
        if (token) {
            return token
        }
        
        return false
    }catch(err){
        console.log('[SERVER_POST - USER_VALIDATION]', err)
        return new NextResponse('[Internal Error][USER_VALIDATION]', {status: 500})
    }
}