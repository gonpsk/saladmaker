'use client'
import React from 'react'
import Sidebar from '../components/Sidebar'
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Edit from '../edit/page';
import { useEffect } from 'react';

function recipe() {

  const [isEditing, setIsEditing] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);


// รับข้อมูลทั้งหมดจากdatabase ที่มีการเพิ่ม recipe เข้าไป
  useEffect(() => {
    fetch('http://localhost:3003/getRecipes') 
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data); // Log the fetched data
        // Convert the object to an array of recipes
        const recipesArray = Object.values(data);
        console.log('Recipes as array:', recipesArray);
        setRecipes(recipesArray);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  // เมื่อกดปุ่ม edit 
  const handleEditClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsEditing(true);
  };


  // เมื่อกดปุ่มลบ recipe 
  const handleDelete = async (recipeName) => {
    try {
      const response = await fetch('http://localhost:3003/deleteRecipe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeName: recipeName,
        }),
      });

      if (response.ok) {
        // อัปเดตสถานะหลังจากลบสูตร
        alert('delete successfully')
        setRecipes(recipes.filter(recipe => recipe.name !== recipeName));
        window.location.href = '/recipe';

      } else {
        console.error('Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };


// ฟังก์ชันเปิด modal
  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setModalOpen(true);
  };

  // ฟังก์ชันสำหรับปิด modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedRecipe(null);
  };

  // ฟังก์ชันเมื่อกดโดนพื้นหลังให้สามารถปิดได้ด้วย
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };





  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <div className='w-1/6'>
        {/* sidebar */}
        <div className="flex">
            <div className="bg-white text-white p-4 text-center h-screen  fixed w-24  md:w-40 sm:w-36 lg:w-80 ">
            <div className='flex justify-center mt-4'>
              <img src='/SALADMAKER..png' className=' mt-4 font-black text-2xl text-center' alt="Salad Maker" />
            </div>
            <ul className='flex flex-col justify-center items-center'>
              <li className="flex items-center mb-4 mt-20 p-2.5 rounded-2xl lg:w-[200px] h-[50px] md:w-full sm:w-32  ">
                <img src='/vec.png' className="mr-4 w-6 h-6 ml-4 text-gray-500" alt="Vector Icon" />
                <Link href="/" style={{ color: '#A098AE' }}>
                  Salad Maker
                </Link>
              </li>
              <li className="flex items-center p-2.5 mt-2 rounded-2xl lg:w-[200px] h-[50px] md:w-full bg-yellow-500 sm:w-32">
                <img src='/book-2.png' className="mr-4 w-6 h-6 ml-4" alt="Recipe Icon" />
                <Link href='/recipe' className='text-white'>
                  Recipe
                </Link>
              </li>
            </ul>
          </div>

        </div>
        {/* end sidebar */}
      </div>
      <div className='w-5/6'>

      {/* เมื่อกดปุ่ม edit ก็จะแสดง ข้อมูลให้edit */}
        {isEditing ? (
          <Edit recipeData={selectedRecipe} />
        ) : (
          // ถ้ายังไม่กด default แสดงตามนี้
          <div>
            <h2 className='p-8 text-2xl font-bold'>Recipe</h2>
            <div className='container mx-auto bg-white min-h-screen rounded-xl mb-8'>
              <h1 className='p-4 py-8 font-bold text-xl'>Your Recipe</h1>
               <div className='grid lg:grid-cols-4  md:grid-cols-3 sm:grid-cols-2  p-8  gap-8 '>
                {recipes.map(recipe => (
                  <div key={recipe.name} className="rounded-lg p-4   w-[344px] h-[363px] lg:w-[344px] lg:h-[363px] flex flex-col card-background md:w-[230px] md:h-[363px] sm:w-[250px] sm:h-[363px] ">
                    <div className='container mx-auto bg-white rounded-2xl h-40'>
                      <h3 className="text-lg p-3 mt-4 ">{recipe.name}</h3>
                      {recipe.calories && (
                        <p className="text-gray-700 p-3 font-bold text-2xl">
                          {recipe.calories} <span className='font-bold text-2xl text-yellow-500'>Cal</span>
                        </p>
                      )}
                    </div>
                    <div className="flex justify-center mt-auto mb-2">
                      <button className="bg-white text-red-600 font-bold py-2 px-4 rounded-3xl w-36 flex items-center justify-center" onClick={() => openModal(recipe)}>
                        <RiDeleteBinLine className="mr-4 text-xl" />

                        Delete
                      </button>
                      <button
                        className="bg-white text-black py-2 px-4 rounded-3xl w-36 flex items-center justify-center ml-2"
                        onClick={() => handleEditClick(recipe)}
                      >
                        <FaRegEdit className="mr-4 text-xl" />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          // จบส่วนแสดง Recipe ทั้งหมด
        )}
      </div>


        {/* modal เมื่อกดปุ่ม delete  */}
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 " onClick={handleBackgroundClick}>


          <div className="bg-white w-[450px] p-6 rounded-lg shadow-lg relative -translate-y-3/4 ">
            <button
              className="absolute top-2 right-8 text-gray-500 text-2xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <img src="/Icon.png" alt="" className=" h-15 w-15" />

              </div>

              <p className="text-xl font-bold mb-8">Delete Recipe</p>

              <div className="flex  w-full">
                <button
                  className=" text-black py-2 px-16 rounded-lg"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-pink-700 text-white py-2 px-4 rounded-lg w-52"
                  onClick={() => handleDelete(selectedRecipe.name)}
                >

                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* จบ modal */}



    </div>
  );
}





export default recipe
