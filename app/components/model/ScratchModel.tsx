"use client";

import { useState } from 'react';

import ScratchCard from 'react-scratchcard-v2';
import RestaurantMap from '../map/RestaurantMap';

// Icon Imports
import { FaWalking } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

import { XMarkIcon } from "@heroicons/react/24/outline";


export default function ScratchModel({randomRestaurant, revealed, setRevealed, setIsOpen}) {

  const [selectTransport, setSelectTransport] = useState("walking")

  const width = !revealed ? 320 : 512;
  const height = !revealed ? 240 : 672;
  console.log(selectTransport)
  return (
    <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center transition-all duration-500'
    onClick={(e) => [setIsOpen(false) , setRevealed(false)]}>
          {!revealed ? (
            <div onClick={(e) => e.stopPropagation()}>
                 <ScratchCard
        width={width}
        height={height}
        finishPercent={70}
        onComplete={() => setRevealed(true)}
      >
        <div 
          className={`pt-6 text-center bg-white rounded-lg shadow-xl duration-500 w-full h-full`} 
        >
          <h1 className='text-3xl'>{randomRestaurant.name}</h1>
          <div> 
            <p> {randomRestaurant.travelTime} </p>
            <p> {randomRestaurant.stars} </p>
          </div>
        </div>
   
      </ScratchCard>
      </div>
          ) : (
            <div className="relative eveal-pop bg-white rounded-lg shadow-xl p-6 w-[700px] h-auto"
            onClick={(e) => e.stopPropagation()}>

              <XMarkIcon className='absolute h-8 w-8 right-3 top-8 cursor-pointer'
              onClick={() => [setIsOpen(false) , setRevealed(false)]}/>
              <h1 className='text-3xl text-center poppi-style'>{randomRestaurant.name}</h1>
              <div className='flex flex-col items-center'>
  
              <RestaurantMap/>
            
              {/*Transportation*/}
              <div className='flex mt-2 gap-4 justify-center'>
                  <div
                  className={`cursor-pointer select-transport py-2 ${selectTransport === "walking" ? "bg-[#e76268] text-[#e7edf2]": "bg-[#e7edf2] text-[#193948]"}  text-center`}
                  onClick={(e) => setSelectTransport("walking")}
                  > Walking 
                  </div>

                  <div 
                  className={`cursor-pointer select-transport py-2 ${selectTransport === "biking" ? "bg-[#e76268] text-[#e7edf2]": "bg-[#e7edf2] text-[#193948]"}  text-center`}
                  onClick={(e) => setSelectTransport("biking")}
                  > Biking 
                  </div>
                </div>
              </div>

                 <div className='flex justify-center mt-5 '> 
                  <div className='rounded-lg  bg-[#fcdc73] w-[90%]'>
                    <h2 className='text-2xl text-center rounded-lg poppi-style py-3'> Overview</h2>
                    <div className='rounded-lg bg-white py-2 '>

                      <div className='flex justify-between rounded-sm bg-[#193948] text-[#fcdc73] font-light drop-shadow-sm mx-2 my-2 py-3 px-5'>
                        <label> Time Travel </label>
                        <p
                        className='flex gap-2'
                        > <FaWalking/>{randomRestaurant.travelTime}mins</p>
                      </div>

                      <div className='flex justify-between rounded-sm bg-[#193948] text-[#fcdc73] font-light drop-shadow-sm mx-2 my-2 py-3 px-5'>
                        <label> Rating Stars </label>
                                              <p
                      className='flex gap-2 items-center'
                      > <FaStar/>{randomRestaurant.stars} </p>
                     
                      </div>

                      <div className='flex justify-between rounded-sm bg-[#193948] text-[#fcdc73] font-light drop-shadow-sm mx-2 my-2 py-3 px-5'>
                        <label> Average Price </label>
                        <p
                          className='flex gap-2 items-center'
                        > ${randomRestaurant.avgPrice} AUD </p>
                     
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          )}
 
    </div>
  )
}