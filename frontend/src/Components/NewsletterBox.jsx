import React from 'react'

const NewsletterBox = () => {
  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis nesciunt quisquam eveniet deserunt reprehenderit eligendi earum vel aperiam dicta dolor temporibus sed harum maiores amet facere, eaque sunt consequatur suscipit.</p>
        <form className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border p1-3'>
          <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email here'required />
        <button type='submit' className='bg-black text-white text-xs-px-10 py-4'>SUBSCRIBE</button>
        </form>
      
    </div>
  )
}

export default NewsletterBox
