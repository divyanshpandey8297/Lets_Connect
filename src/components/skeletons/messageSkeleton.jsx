import React from 'react'

const messageSkeleton = () => {

    const skeletonMessages=Array(6).fill(null);

    
  return (
    <div>
        {
            skeletonMessages.map((_,index)=>(
                <div key={index}
                className={`flex items-start gap-3 ${index %2 === 0 ? "justify-start":"justify-end flex-row-reverse"}`}
                >

                    {/* Avatar */}
                    <div className='w-10 h-10 rounded-full bg-gray-300 animate-pulse'></div>

                    {/* MESSAGE BUBBLE */}
                    <div className='h-4 w-16 bg-gray-300 mb-2 animate-pulse'></div>
                    <div className='w-[200px] h-16 bg-gray-300 rounded-lg animate-pulse'></div>
                    


                </div>
            ))
        }
      

    </div>
  )
}

export default messageSkeleton
