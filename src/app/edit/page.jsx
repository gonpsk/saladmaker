"use client"
import React, { useState, useEffect } from 'react';

function edit({ recipeData }) {

    const [name, setName] = useState(recipeData?.name || '');
    const [ingredients, setIngredients] = useState(recipeData?.ingredients || []);
    const [calories, setCalories] = useState(recipeData?.calories || 0);

    const [recipe, setRecipe] = useState(recipeData);

    const [totalCalories, setTotalCalories] = useState(0);




    // คำนวณ แคลอรี่ทั้งหมดของวัตถุดิบ
    useEffect(() => {
        const calculateTotalCalories = () => {
            const total = ingredients.reduce((sum, ingredient) => {
                // คำนวณ calories ของแต่ละ ingredient แล้วรวม
                return sum + (ingredient.calories * ingredient.count);
            }, 0);
            setTotalCalories(total);
        };

        calculateTotalCalories();
    }, [ingredients]);


    // ลบcount ของ วัตถุดิบ ถ้าเหลือ0 จะลบหายไป
    const handleDelete = (ingredientName) => {
        const updatedIngredients = ingredients.map(ingredient => {
            if (ingredient.name === ingredientName) {
                return {
                    ...ingredient,
                    count: ingredient.count - 1
                };
            }
            return ingredient;
        }).filter(ingredient => ingredient.count > 0);

        setIngredients(updatedIngredients);
    };

    // เพิ่ม count ของวัตถุดิบ
    const handleAdd = (ingredientName) => {
        setIngredients(prevIngredients => {
            return prevIngredients.map(ingredient =>
                ingredient.name === ingredientName
                    ? { ...ingredient, count: ingredient.count + 1 }
                    : ingredient
            );
        });
    };


    // กดปุ่มอัพเดทจะส่งข้อมูลไปยัง database 
    const handleUpdate = async () => {
        const updatedRecipe = {
            name,
            ingredients,
            totalCalories
        };

        try {
            const response = await fetch('http://localhost:3003/updateRecipe', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedRecipe),
            });

            if (response.ok) {
                alert('Recipe updated successfully!');
                window.location.href = '/recipe'
            } else {
                console.error('Failed to update recipe');
            }
        } catch (error) {
            console.error('Error updating recipe:', error);
        }
    };






    return (
        <div>
            <h2 className='p-8 text-2xl font-bold'>Edit Recipe</h2>
            <div className="container mx-auto">
                <div className="bg-white shadow-md rounded-lg p-6  h-auto">
                    <div className="mb-4">
                        <h2 className="text-xl mb-8 font-bold">Your ingredients to make a salad Recipe</h2>
                        <ul className='border-b border-gray-300 pb-8'>
                            {ingredients.map((ingredient, index) => (
                                <li key={index} className="flex items-center justify-between mb-4">
                                    <div className="flex items-center flex-1">
                                        <img
                                            src={ingredient.image}
                                            alt={ingredient.name}
                                            className="rounded object-cover"
                                            style={{ width: '80px', height: '80px' }}
                                        />
                                        <div className="flex flex-col ml-4">
                                            <p className="font-bold">{ingredient.name}</p>
                                            <p className="text-gray-500">
                                                x{ingredient.count} <span className="text-red-500 underline decoration-1 ml-4 font-bold hover:cursor-pointer" onClick={() => handleDelete(ingredient.name)}>delete</span>
                                                <span className='ml-3 text-red-500 underline decoration-1 font-bold hover:cursor-pointer' onClick={() => handleAdd(ingredient.name)}  >add</span>
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-bold ml-auto ">
                                        {'+' + ingredient.calories * ingredient.count || 0} <span className="text-yellow-500">Cal</span>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-center mb-6 mt-16">
                        <span className="text-xl">Total Calorie</span>
                        <span className="text-xl justify-end ml-auto mr-4">{totalCalories || 0}</span>
                        <span className="text-xl text-yellow-500 mr-2 font-bold"> Cal</span>
                    </div>
                    <div className="flex  ">

                        <button
                            className="bg-yellow-500 text-white py-2 px-4 rounded-2xl font-bold container w-full h-12 mt-4 mb-2"
                            onClick={handleUpdate}
                        >
                            Update Recipe
                        </button>
                    </div>
                </div>
            </div>





        </div>






    );
}

export default edit
