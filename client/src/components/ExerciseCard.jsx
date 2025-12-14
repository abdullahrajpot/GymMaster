import React from 'react';
import { Link } from 'react-router-dom';
import {useCart} from "../context/cart";
import {toast} from "react-hot-toast";
const ExerciseCard = ({exercises, heading}) => {
  const { cart, setCart } = useCart();
console.log(exercises);

// Ensure exercises is an array
if(!Array.isArray(exercises) || exercises.length === 0){
  return (
    <h1 className='text-4xl flex justify-center items-center w-full h-screen text-center'>No Exercises Found.....</h1>
  )
}


const handleAddToCart = (exercise) => {
  const isExerciseInCart = cart.some(item => item.id === exercise.id);

  if (!isExerciseInCart) {
    setCart([...cart, exercise]);
    localStorage.setItem("cart", JSON.stringify([...cart, exercise]));
    toast.success("Exercise added to Favourite");
  } else {
    toast.error("Exercise is already in the Favourite");
  }
};

  return (
    <section className='pt-32 bg-white' id='exercises'>
    <div className="px-7 sm:px-14">
    <h2 className='text-2xl sm:text-3xl md:text-5xl text-black capitalize text-center md:text-center border-b-4 border-red-500 sm:border-none mb-20'>{ heading ? ` similar ${heading} exercise` : 'showing Results'}</h2>
    <div className="grid gap-4 md:gap-5 grid-cols-2 lg:grid-cols-3 items-stretch exercise-grid">
      {exercises?.slice(0, 21).map((exercise, id) => {
        // Handle different API response formats (Gym-Fit vs ExerciseDB)
        const exerciseName = exercise.name || exercise.title || exercise.exerciseName || 'Exercise';
        const bodyPart = exercise.bodyPart || exercise.bodypart || exercise.body_part || exercise.primaryMuscles?.[0] || exercise.bodyParts?.[0] || 'Body Part';
        const target = exercise.target || exercise.targetMuscle || exercise.target_muscle || exercise.primaryMuscles?.[0] || exercise.secondaryMuscles?.[0] || 'Target';
        
        // Try multiple image property names for Gym-Fit API
        // Skip placeholder values like "image_coming_soon"
        let gifUrl = exercise.gifUrl || 
                     exercise.gif_url || 
                     exercise.image || 
                     exercise.imageUrl ||
                     exercise.image_url ||
                     exercise.images?.gif ||
                     exercise.images?.url ||
                     exercise.images?.image ||
                     (Array.isArray(exercise.images) && exercise.images[0]) ||
                     exercise.media?.[0]?.url ||
                     exercise.thumbnail ||
                     exercise.thumbnailUrl ||
                     exercise.photo ||
                     exercise.photoUrl ||
                     '';
        
        // Filter out placeholder values
        if (gifUrl && (gifUrl === 'image_coming_soon' || 
                       gifUrl === 'coming_soon' || 
                       gifUrl === 'placeholder' ||
                       !gifUrl.startsWith('http'))) {
          gifUrl = '';
        }
        
        const exerciseId = exercise.id || exercise._id || exercise.exerciseId || id;
        
        // Debug: Log first exercise to see its structure
        if (id === 0) {
          console.log('First exercise object:', exercise);
          console.log('All image-related properties:', {
            gifUrl: exercise.gifUrl,
            image: exercise.image,
            imageUrl: exercise.imageUrl,
            images: exercise.images,
            media: exercise.media,
            thumbnail: exercise.thumbnail,
            photo: exercise.photo
          });
          console.log('Final Image URL:', gifUrl);
        }
        
        return (
        <div className='flex justify-center items-center flex-col gap-5 border-2 pb-2' key={id}>
          <Link to={exerciseId ? `${exerciseId}` : "" } key={id} className='no-underline rounded-xl'>
        <div className="overflow-hidden bg-white">
            {gifUrl ? (
              <img src={gifUrl} className='w-[70%] mx-auto hover:scale-110 transition' alt={exerciseName} loading="lazy" onError={(e) => {
                console.warn('Image failed to load:', gifUrl);
                e.target.style.display = 'none';
              }} />
            ) : (
              <div className='w-[70%] mx-auto h-48 bg-gray-200 flex items-center justify-center text-gray-500'>
                <span>No Image</span>
              </div>
            )}
            <div className="flex gap-1 flex-row items-center my-8 justify-center">
                <button className='rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-white bg-[#240b36] hover:opacity-90 transition-all'>{String(bodyPart).slice(0, 15)}</button>
                <button className='rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-white bg-[#c31432] hover:opacity-90 transition-all'>{String(target).slice(0, 15)}</button>
            </div>
            <h2 className='text-base sm:text-xl capitalize text-center font-bold'>{String(exerciseName).slice(0, 24)}</h2>

            {/* favourite exercies */}
          
        </div>
        <div>

        </div>
          </Link>
            <button type="button" className="bg-blue-500 text-white font-semibold rounded-sm px-4 py-2" onClick={() => handleAddToCart(exercise)}>Add To Favourites</button>
        </div>
        );
      })}
    </div>

    </div>
  </section>
  )
}

export default ExerciseCard;