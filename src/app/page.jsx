'use client';
import Image from "next/image";
import Sidebar from "./components/Sidebar";
import Link from "next/link";
import { FaSearch } from 'react-icons/fa';
import { FaBook } from 'react-icons/fa';
import { useState, useEffect } from "react";
import { FaUtensils } from 'react-icons/fa';
import { PiForkKnifeFill } from "react-icons/pi";
import Ingredients from "./ingredients/page";


export default function Home() {

  


  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="w-1/6">
        <Sidebar />
      </div>
      <main className="w-5/6 mb-24 ">
      <Ingredients/>







      </main>

    </div>


  );
}
