// import { Sidebar } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import NoChatSelected from '../components/NoChatSelected'
import ChatContainer from '../components/ChatContainer'
import Sidebar from '../components/Sidebar'
import { motion } from 'framer-motion'

const Home = () => {
    const {selectedUser}=useSelector((state)=>state.chat)
  return (
    <div>
        <div>
            <motion.div
            initial={{
                y:50,
                opacity:0
            }}
            animate={{
                y:0,
                opacity:1
            }}
            transition={{
                duration:0.8,
                ease:"easeOut"
            }}
            className='flex items-center justify-center pt-20 px-4'>
                <div className='bg-white rounded-lg shadow-md w-full max-w-6xl h-[calc(100vh-8rem)] '>
                    <div className='flex h-full rounded-lg overflow-hidden '>
                        <Sidebar/>
                        {!selectedUser ? <NoChatSelected/> : <ChatContainer/>}

                    </div>

                </div>

            </motion.div>

        </div>
      
    </div>
  )
}

export default Home
