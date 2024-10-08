    'use client'
    import React from 'react'
    import Image from "next/image";
    import Link from "next/link";
    import { FaSearch } from 'react-icons/fa';
    import { FaBook } from 'react-icons/fa';
    import { useState, useEffect } from "react";
    import { FaUtensils } from 'react-icons/fa';
    import { PiForkKnifeFill } from "react-icons/pi";
    import { useRouter } from 'next/router';

    function ingredients() {
    

        const [selectedCategories, setSelectedCategories] = useState(new Set()); 
        const [ingredients, setIngredients] = useState([]);
        const [filteredIngredients, setFilteredIngredients] = useState([]);
        const [ingredientCounts, setIngredientCounts] = useState({});
        const [isModalOpen, setModalOpen] = useState(false);
        const [recipeName, setRecipeName] = useState('');
        const [selectedIngredients, setSelectedIngredients] = useState([]);

// เปิดและปิด modal
        const openModal = () => setModalOpen(true);
        const closeModal = () => setModalOpen(false);

        // คำนวนจำนวนของวัตถุดิบแต่ละชิ้น
        const totalCount = Object.values(ingredientCounts).reduce((sum, count) => sum + (count || 0), 0);

        // คำนวนแคลอรี่ของวัตถุดิบที่เลือกทั้งหมด
        const totalCalories = ingredients.reduce((total, ingredient) => {
            return total + (ingredientCounts[ingredient.id] || 0) * ingredient.calories;
        }, 0);


        // ค้นหาวัตถุดิบจากชื่อวัตถุดิบ
        const handleSearch = (event) => {
            const searchTerm = event.target.value.toLowerCase();
            setFilteredIngredients(
              ingredients.filter((ingredient) =>
                ingredient.ingredient.toLowerCase().includes(searchTerm)
              )
            );
          };


        //   ถ้าคลิกพื้นหลังก็สามารถปิด modal ได้เหมือนกัน
        const handleBackgroundClick = (e) => {
            if (e.target === e.currentTarget) {
                closeModal();
            }
        };

            // เลือกประเภทของวัตถุดิบ
        const toggleCategory = (category, event) => {
            event.preventDefault();
            setSelectedCategories(prevCategories => {
                const updatedCategories = new Set(prevCategories);
                if (updatedCategories.has(category)) {
                    updatedCategories.delete(category); // ลบประเภทที่ถูกเลือก
                } else {
                    updatedCategories.add(category); // เพิ่มประเภทใหม่
                }
                return updatedCategories;
            });
        };

         // แสดงวัตถุดิบตามที่เราเลือก
        useEffect(() => {
            if (selectedCategories.size > 0) {
                setFilteredIngredients(ingredients.filter(item => selectedCategories.has(item.category)));
            } else {
                setFilteredIngredients(ingredients);
            }
        }, [selectedCategories, ingredients]);





        // เมื่อกดปุ่มเพิ่มก็จะเพิ่ม count
        const handleIncrement = (id) => {
            setIngredientCounts(prevCounts => {
            const newCounts = {
                ...prevCounts,
                [id]: (prevCounts[id] || 0) + 1
            };
        
            // Update selectedIngredients state
            setSelectedIngredients(prevSelectedIngredients => {
                const updatedIngredients = prevSelectedIngredients.map(ingredient => {
                if (ingredient.id === id) {
                    return {
                    ...ingredient,
                    count: newCounts[id]
                    };
                } else {
                    return ingredient;
                }
                });
                // หากยังไม่มีส่วนผสมนี้ใน selectedIngredients ให้เพิ่มเข้าไป
                if (!prevSelectedIngredients.some(ingredient => ingredient.id === id)) {
                updatedIngredients.push({
                    id,
                    ...ingredients.find(ingredient => ingredient.id === id),
                    count: newCounts[id]
                });
                }
                return updatedIngredients;
            });
        
            return newCounts;
            });
        };

            // เมื่อกดปุ่ม - ก็จะลบ count 
        const handleDecrement = (id) => {
            setIngredientCounts(prevCounts => {
                const newCounts = {
                    ...prevCounts,
                    [id]: Math.max((prevCounts[id] || 0) - 1, 0)
                };
        
                // Update selectedIngredients state
                setSelectedIngredients(prevSelectedIngredients => {
                    // Remove ingredients with count 0
                    const updatedIngredients = prevSelectedIngredients
                        .map(ingredient => {
                            if (ingredient.id === id) {
                                return {
                                    ...ingredient,
                                    count: newCounts[id]
                                };
                            } else {
                                return ingredient;
                            }
                        })
                        .filter(ingredient => ingredient.count > 0);
                    
                    return updatedIngredients;
                });
        
                return newCounts;
            });
        };

// เอาข้อมูลทั้งหมดจาก file.json มาแสดง
        useEffect(() => {
            fetch('/api')
                .then(response => response.json())
                .then(data => {
                    setIngredients(data);
                    setFilteredIngredients(data); // ตั้งค่าเริ่มต้นให้แสดงข้อมูลทั้งหมด
                });
        }, []);

        
       

            // เมื่อกดปุ่มcreateRecipe ก็จะทำงาน
        const handleCreateRecipe = () => {
            
            if (recipeName !== '') {
                const newRecipe = {
                    recipeName,
                    selectedIngredients: selectedIngredients.map(ingredient => ({
                        name: ingredient.ingredient,
                        image: ingredient.image,
                        count: ingredient.count,
                        calories: ingredient.calories
                    })),
                    totalCalories // Add totalCalories to the newRecipe object
                };
                
                fetch('http://localhost:3003/addRecipe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newRecipe)
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    alert('Success');
                    setRecipeName('');
                    closeModal();
                    window.location.href = '/recipe'; 
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            } else {
                alert('Please input recipe name');
            }
        };
            

        return (
            <div>
                <div className="p-8 flex items-center justify-between w-full">
                    <h1 className="font-extrabold text-2xl mt-2">Let's create...your own salad!!!</h1>
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500" />
                        <input
                            type="text"
                            placeholder="Search ingredients to make a salad..."
                            className="p-2 pl-10 w-96 rounded-lg mr-4 my-4"
                            onChange={handleSearch}
                        />
                    </div>
                </div>
                {/* banner */}
                <img src="/text.png" alt="" className="container mx-auto rounded-lg p-8" />

                {/* end banner */}

               {/* category select */}

                <h1 className="font-extrabold text-lg mt-4 p-8">Select Category</h1>
                <div className="flex flex-wrap ml-8 gap-2">
                    <div className="relative inline-block">
                        <a href="#" onClick={(e) => toggleCategory('vegetable', e)} className="mr-6 bg-white rounded-xl flex flex-col items-center p-4 w-40 h-40">
                            <img src='/iconve.png' alt='vegetables' className="mt-2 w-16 h-16 rounded-full object-cover mb-4" />
                            <h2 className="text-gray-500">Vegetables</h2>
                        </a>
                        <div className={`absolute top-2 right-8 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center ${selectedCategories.has('vegetable') ? 'block' : 'hidden'}`}>
                            &#10003;
                        </div>
                    </div>

                    <div className="relative inline-block">
                        <a href="#" onClick={(e) => toggleCategory('fruit', e)} className="mr-6 bg-white rounded-xl flex flex-col items-center p-4 w-40 h-40">
                            <img src='iconfu.png' alt='fruit' className="mt-2 w-16 h-16 rounded-full object-cover mb-4" />
                            <h2 className="text-gray-500">Fruit</h2>
                        </a>
                        <div className={`absolute top-2 right-8 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center ${selectedCategories.has('fruit') ? 'block' : 'hidden'}`}>
                            &#10003;
                        </div>
                    </div>

                    <div className="relative inline-block ">
                        <a href="#" onClick={(e) => toggleCategory('topping', e)} className="mr-6 bg-white rounded-xl flex flex-col items-center p-4 w-40 h-40">
                            <img src='icontop.png' alt='toppings' className="mt-2 w-16 h-16 rounded-full object-cover mb-4" />
                            <h2 className="text-gray-500">Toppings</h2>
                        </a>
                        <div className={`absolute top-2 right-8 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center ${selectedCategories.has('topping') ? 'block' : 'hidden'}`}>
                            &#10003;
                        </div>
                    </div>

                    <div className="relative inline-block ">
                        <a href="#" onClick={(e) => toggleCategory('protein', e)} className="mr-6 bg-white rounded-xl flex flex-col items-center p-4 w-40 h-40">
                            <img src='iconpro.png' alt='protein' className="mt-2 w-16 h-16 rounded-full object-cover mb-4" />
                            <h2 className="text-gray-500">Protein</h2>
                        </a>
                        <div className={`absolute top-2 right-8 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center ${selectedCategories.has('protein') ? 'block' : 'hidden'}`}>
                            &#10003;
                        </div>
                    </div>

                    <div className="relative inline-block ">
                        <a href="#" onClick={(e) => toggleCategory('dressing', e)} className="mr-6 bg-white rounded-xl flex flex-col items-center p-4 w-40 h-40">
                            <img src='icondress.png' alt='dressing' className="mt-2 w-16 h-16 rounded-full object-cover mb-4" />
                            <h2 className="text-gray-500">Dressing</h2>
                        </a>
                        <div className={`absolute top-2 right-8 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center ${selectedCategories.has('dressing') ? 'block' : 'hidden'}`}>
                            &#10003;
                        </div>
                    </div>
                </div>
                {/* category select end */}

                {/* choose ingredient */}
                <h1 className="font-extrabold text-xl mt-4 p-8">Choose your ingredients to make a salad</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ml-8">

                    {filteredIngredients.map((ingredient) => (
                        <div key={ingredient.id} className="w-full h-[363px] p-[32px] gap-[24px] rounded-tl-[16px] bg-white shadow-lg relative mt-4 mb-8">
                            <img src={ingredient.image} alt="" className="w-[296px] h-[180px] object-cover" />
                            <div className="mt-4">
                                <h1 className="font-bold mt-4 mb-2">{ingredient.ingredient}</h1>
                                <h2 className="text-2xl font-bold">{ingredient.calories} <span className="font-bold text-2xl text-yellow-500">Cal</span></h2>
                            </div>
                            <div className="absolute bottom-4 right-4 flex items-center">
                                {ingredientCounts[ingredient.id] > 0 && (
                                    <>
                                        <button className="bg-yellow-500 text-white font-bold py-1 px-3 rounded-full" onClick={() => handleDecrement(ingredient.id)}>-</button>
                                        <span className="text-black font-bold py-1 px-4">{ingredientCounts[ingredient.id]}</span>

                                    </>

                                )}

                                <button className="bg-yellow-500 text-white font-bold py-1 px-3 rounded-full" onClick={() => handleIncrement(ingredient.id)}>+</button>
                            </div>
                        </div>
                    ))}


                </div>
                {/* end choose ingredient */}


                    {/* display result at bottom */}
                <div className="bg-white flex items-center w-full fixed bottom-0 left-0 ">
                    <div className='w-1/6'>
                            
                    </div>
                    <div className='w-5/6 flex items-center'>
                    <div className="w-5/6 bg-yellow-500  container my-4 mx-4 h-20 sm:h-16 md:h-16 lg:h-16 rounded-2xl flex       ">
                        <p className="bg-white rounded-lg flex items-center justify-center p-2 w-[44px] h-[44px] m-3 text-center ml-4 text-yellow-500 font-extrabold text-xl">
                            {totalCount}
                        </p>
                        <p className="text-white  text-center   font-extrabold text-sm lg:text-2xl md:text-xl sm:text-lg mt-4 ">Your Ingredients</p>
                        <p className="text-white justify-end text-sm lg:text-2xl md:text-xl sm:text-lg  font-extrabold ml-auto mr-12 mt-4">{totalCalories} Cal


                        </p>
                    </div>
                    <div className="w-1/6 ">
                        <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-2xl h-20 sm:h-16 md:h-16 lg:h-16 lg:w-56 text-sm lg:text-2xl md:text-xl sm:text-lg  " onClick={openModal}>
                            Create Recipe
                        </button>
                    </div>
                    
                    </div>
                    


                </div>

                  {/* display result at bottom */}



                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 " onClick={handleBackgroundClick}>


                        <div className="bg-white w-[450px] p-6 rounded-lg shadow-lg relative">
                            <button
                                className="absolute top-2 right-8 text-gray-500 text-2xl"
                                onClick={closeModal}
                            >
                                &times;
                            </button>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full mb-4 bg-yellow-500 flex items-center justify-center">
                                    <img src="/Vector.png" alt="" className=" h-10" />

                                </div>

                                <p className="text-xl font-bold mb-2">Recipe Name</p>
                                <input
                                    type="text"
                                    placeholder="Input Your Recipe Name....."
                                    className="border p-2 w-full rounded-lg mb-4"
                                    value={recipeName}
                                    onChange={(e) => setRecipeName(e.target.value)}
                                />
                                <div className="flex justify-between w-full">
                                    <button
                                        className=" text-black py-2 px-16 rounded-lg"
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-green-500 text-white py-2 px-4 rounded-lg"
                                        onClick={handleCreateRecipe}
                                    >
                                        
                                        Create New Recipe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* end modal */}

            </div>
        )
    }

    export default ingredients
