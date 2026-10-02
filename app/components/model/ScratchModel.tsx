"use client";

import { useState, useEffect } from 'react';

import ScratchCard from 'react-scratchcard-v2';
import RestaurantMap from '../map/RestaurantMap';
import { getCoords } from '@/lib/geo';
import { TransportMode } from '@/lib/types';
import { useStore } from '@/store/useStore';

// Icon Imports
import { FaStar } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { CiForkAndKnife } from "react-icons/ci";
import { XMarkIcon } from "@heroicons/react/24/outline";


// Spinning wheel of food emojis shown while the random pick loads.
function FoodWheel() {
  const emojis = ["🍜", "🍕", "🍣", "🥘", "🍔", "🌮", "🍛", "🍱"];
  const radius = 62;
  return (
    <button onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-6">
      <div className="relative animate-spin" style={{ width: 160, height: 160, animationDuration: "1.4s" }}>
        {emojis.map((emoji, i) => {
          const angle = (i * 360) / emojis.length;
          return (
            <span
              key={i}
              className="absolute text-3xl"
              style={{
                left: "50%",
                top: "50%",
                marginLeft: -16,
                marginTop: -16,
                transform: `rotate(${angle}deg) translate(0, -${radius}px)`,
              }}>
              {emoji}
            </span>
          );
        })}
      </div>
      <p className="text-white text-2xl animate-pulse">Finding your spot…</p>
    </button>
  );
}

export default function ScratchModel() {
  const selected = useStore((s) => s.selected);
  const routes = useStore((s) => s.routes);
  const revealed = useStore((s) => s.revealed);
  const setRevealed = useStore((s) => s.setRevealed);
  const closeReveal = useStore((s) => s.closeReveal);
  const picking = useStore((s) => s.picking);

  const [selectTransport, setSelectTransport] = useState<TransportMode>("walking");
  const [userLat, setUserLat] = useState(0);
  const [userLng, setUserLng] = useState(0);

  // Scratch card grows once revealed
  const width = !revealed ? 320 : 512;
  const height = !revealed ? 240 : 672;

  // Grab the user's location for the "Get Directions" link (via lib/geo)
  useEffect(() => {
    getCoords()
      .then((c) => { setUserLat(c.lat); setUserLng(c.lng); })
      .catch((err) => console.log(err.message));
  }, []);

  // While the random pick loads, show the spinning wheel (no close on backdrop).
  if (picking) {
    return (
      <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center'>
        <FoodWheel />
      </div>
    );
  }

  if (!selected) return null;
  const route = routes ? routes[selectTransport] : null;

  return (
    <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center transition-all duration-500'
      onClick={closeReveal}>
      {!revealed ? (
        <button onClick={(e) => e.stopPropagation()}>
          <ScratchCard
            {...({
              width,
              height,
              finishPercent: 70,
              onComplete: () => setRevealed(true),
              ariaLabel: "Scratch to reveal",
            } as any)}
          >
            <div className='block content-center pt-6 text-center bg-white rounded-lg shadow-xl duration-500 w-full h-full'>
              <h1 className='text-3xl poppi-style'>{selected.name}</h1>
              <div className='flex justify-center gap-3 mt-3'>
                <p className='flex items-center gap-2 bg-[#193948] text-[#fcdc73] px-3 rounded-lg'> <FaStar aria-label="Rating"/> {selected.rating} </p>
                <p className='flex items-center gap-2 bg-[#193948] text-[#fcdc73] px-3 rounded-lg'> <CiForkAndKnife aria-label="Cuisine"/> {selected.cuisine} </p>
              </div>
            </div>
          </ScratchCard>
          <h2 className="text-white  font-bold text-2xl text-center animate-pulse"> Scratch to reveal! </h2>
        </button>
      ) : (

        <div className="relative reveal-pop bg-white rounded-lg shadow-xl p-6 w-[700px] h-[750px] overflow-y-scroll"
          onClick={(e) => e.stopPropagation()}>

          <XMarkIcon aria-label="Close" className='absolute h-8 w-8 right-3 top-8 cursor-pointer' onClick={closeReveal} />
          <h1 className='text-3xl text-center poppi-style'>{selected.name}</h1>

          <div className='flex flex-col items-center'>
            <RestaurantMap route={route ? route.geometry : null} destination={selected} />

            {/* Transportation */}
            <div className='flex mt-2 gap-4 justify-center'>
              {(["walking", "biking", "driving"] as TransportMode[]).map((m) => (
                <button
                  key={m}
                  className={`cursor-pointer select-transport py-2 capitalize ${selectTransport === m ? "bg-[#e76268] text-[#e7edf2]" : "bg-[#e7edf2] text-[#193948]"} text-center`}
                  onClick={() => setSelectTransport(m)}>
                  {m}
                </button>

            
              ))}
            </div>
          </div>

          <div className='flex justify-center mt-5'>
            <div className='rounded-lg bg-[#fcdc73] w-[90%]'>
              <h2 className='text-2xl text-center rounded-lg poppi-style py-3'> Overview</h2>
              <div className='rounded-lg bg-white py-2'>

                <div className='flex justify-between rounded-sm bg-[#193948] text-[#fcdc73] font-light drop-shadow-sm mx-2 my-2 py-3 px-5'>
                  <label> Rating Stars </label>
                  <p className='flex gap-2 items-center'> <FaStar />{selected.rating} </p>
                </div>

                <div className='flex justify-between rounded-sm bg-[#193948] text-[#fcdc73] font-light drop-shadow-sm mx-2 my-2 py-3 px-5'>
                  <label> Cuisine </label>
                  <p className='flex gap-2 items-center'> {selected.cuisine} </p>
                </div>

                <div className='flex justify-between rounded-sm bg-[#193948] text-[#fcdc73] font-light drop-shadow-sm mx-2 my-2 py-3 px-5'>
                  <label> Location </label>
                  <p className='flex gap-2 items-center'> {selected.address} </p>
                </div>

                <div className='flex justify-between rounded-sm bg-[#193948] text-[#fcdc73] font-light drop-shadow-sm mx-2 my-2 py-3 px-5'>
                  <label> Time travel </label>
                  <p> {route ? `${route.duration_min} min` : "…"} </p>
                </div>

                <div className='flex justify-between rounded-sm bg-[#193948] text-[#fcdc73] font-light drop-shadow-sm mx-2 my-2 py-3 px-5'>
                  <label> Distance </label>
                  <p> {route ? `${route.distance_km} km` : "…"} </p>
                </div>

              </div>
            </div>
          </div>

          {/* Get directions */}
          <div className='flex justify-end w-[94%]'>
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${selected.lat},${selected.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-4 bg-blue-400 text-white w-50 py-4 mt-4 rounded-lg"
            >
              Get Directions <FaArrowRight aria-label="Get Directions"/>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
