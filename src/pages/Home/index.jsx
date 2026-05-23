import React from 'react'

const Home = () => {
  return (
    <div className="pt-24 min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-5xl font-extrabold text-yellow-500 mb-4 tracking-wide uppercase">
        Welcome to MR BARBER
      </h2>
      <p className="text-gray-400 text-lg max-w-lg mb-8">
        Experience premium haircuts, beard grooming, and hot towel shaves tailored just for you.
      </p>
      <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-500/20">
        Book Your Appointment
      </button>
    </div>
  )
}

export default Home
