import { MessageSquare } from 'lucide-react'
import React from 'react'

const NoChatSelected = () => {
  return (
    
        <div className='w-full flex flex-1 flex-col items-center justify-center p-16 mb-32  bg-white/50'>
            <div className='max-w-md text-center space-y-6'>

                {/* Icon display */}
                <div className='flex justify-center gap-4 mb-4'>
                    <div className='relative'>
                        <div className='w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center animate-bounce'>
                            <MessageSquare
                            className='w-8 h-8 text-blue-600'
                            />

                        </div>

                    </div>

                </div>

                {/* Welcome Text */}
                <h1 className='text-2xl font-bold text-gray-600'>
                    Welcome to Let's Connect
                    

                </h1>
                <p className='text-gray-500'>
                    Select a conversation from the sidebar to start chatting
                </p>



            </div>
        </div>
      
  
  )
}

export default NoChatSelected
