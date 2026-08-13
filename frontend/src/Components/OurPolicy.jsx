import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2'>
      <div>
        <img src={assets.exchange_icon}className='w-12 m-auto mb-5 '  alt="" />
        <p className='font-semibold'>Easy Exchange Policy</p>
        <p className='text-gray-400'>We offer hastle free exchange Policy</p>
      </div>
      <div>
        <img src={assets.quality_icon}className='w-12 m-auto mb-5 '  alt="" />
        <p className='font-semibold'>14 Days return&refund Policy</p>
        <p className='text-gray-400'>We provide 14 days return&refund Polucy</p>
      </div>
      <div>
        <img src={assets.support_img}className='w-12 m-auto mb-5 '  alt="" />
        <p className='font-semibold'>customer care&support Policy</p>
        <p className='text-gray-400'>We offer 24/7 customer support&care policy</p>
      </div>
    </div>
  )
}

export default OurPolicy
