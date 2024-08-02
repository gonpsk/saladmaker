'use client'
import React from 'react'
import { FaHome, FaUser, FaCog } from 'react-icons/fa';
import { FaBook } from 'react-icons/fa';
import Link from 'next/link';
import { useState } from 'react';


function Sidebar() {


 
    return (
      <div>
        {/* sidebar */}

        <div className="flex ">
          <div className="bg-white text-white p-4 text-center h-screen fixed w-80 md:w-40 sm:w-36 lg:w-80">
            <div className='flex justify-center mt-4'>
            <img src='/SALADMAKER..png' className=' mt-4 font-black text-2xl text-center'img/>
            </div>
            <ul className='flex flex-col justify-center items-center'>
              <li className="flex items-center mb-4 bg-yellow-500 mt-20 p-2.5 rounded-2xl lg:w-[200px] h-[50px] md:w-full sm:w-full">
                <img src='/Vector.png' className="mr-4 w-6 h-6 ml-4" alt="Vector Icon" />
                <Link href="/" className="text-white">Salad Maker</Link>
              </li>

              <li className="flex items-center p-2.5 mt-2 rounded-2xl lg:w-[200px] h-[50px]  md:w-full sm:w-full">
                <img src='/solar_book-2-bold.png' className="mr-4 w-6 h-6 ml-4 text-gray-500 " alt="Recipe Icon" />
                <Link href='/recipe' style={{color: '#A098AE' }}>
                  Recipe
                </Link>
              </li>
            </ul>
          </div>
        
        </div>

        {/* sidebar */}

       
          

          


      </div>
  )
}

export default Sidebar
