import React from 'react'

const AuthImagePattern = ({title,subtitle}) => {
  return (
    <div>
        <div className='hidden lg:flex items-center justify-center mt-36 p-12'>
            <div className='max-w-md text-center'>

                {/* Grid Pattern */}
                <div className='grid grid-cols-3 gap-3 mb-8'>
                    {
                        [...Array(9)].map((_,i)=>(
                            <div key={i} className={`aspect-square rounded-2xl bg-gray-700/30
                             ${i%2==0 ? "animate-pulse":""}`}>

                            </div>
                            )
                        )
                    }
                </div>

                <h1 className='text-2xl font-bold text-black mb-4'>{title}</h1>
                <p className='text-gray-700'>{subtitle}</p>

            </div>

        </div>
      
    </div>
  )
}

export default AuthImagePattern
