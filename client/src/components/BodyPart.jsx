import React,{useEffect} from 'react';
import { fetchData, exerciseOptions, EXERCISE_API_BASE_URL, encodeUrlParam, IS_NEW_API } from '../utils/fetchData';
import {exercisePng} from "../images";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
// import { FreeMode } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';


const BodyPart = ({bodyParts, setBodyPart, bodyPart, setExercises }) => {
  useEffect(() => {
    const fetchExercisesData = async () => {
      try {
        let exercisesData = [];
        
        if(bodyPart === "all"){
          // Get all exercises - start with a basic request
          if (IS_NEW_API) {
            // Gym-Fit API: Get exercises from multiple body parts
            const bodyPartsToFetch = ['Legs', 'Chest', 'Back', 'Arms', 'Shoulders', 'Core'];
            const allExercisesPromises = bodyPartsToFetch.map(bp => 
              fetchData(`${EXERCISE_API_BASE_URL}/v1/exercises/search?limit=20&offset=0&bodyPart=${encodeUrlParam(bp)}`, exerciseOptions)
            );
            
            const results = await Promise.all(allExercisesPromises);
            exercisesData = results.flat().filter(ex => ex); // Flatten and remove nulls
            
            // Remove duplicates based on exercise ID or name
            const uniqueExercises = [];
            const seen = new Set();
            exercisesData.forEach(ex => {
              const key = ex.id || ex.name || ex.title;
              if (key && !seen.has(key)) {
                seen.add(key);
                uniqueExercises.push(ex);
              }
            });
            exercisesData = uniqueExercises;
          } else {
            exercisesData = await fetchData(`${EXERCISE_API_BASE_URL}/exercises`, exerciseOptions);
          }
        } else {
          // Format body part name for API
          const formattedBodyPart = bodyPart.toLowerCase();
          
          if (IS_NEW_API) {
            // For the gym-fit API - use exact mapping from your working example
            const bodyPartMapping = {
              'chest': 'Chest',
              'back': 'Back', 
              'shoulders': 'Shoulders',
              'upper arms': 'Arms',
              'lower arms': 'Arms',
              'upper legs': 'Legs',
              'lower legs': 'Legs',
              'waist': 'Core',
              'cardio': 'Cardio',
              'neck': 'Shoulders' // Map neck to shoulders as fallback
            };
            
            const bodyPartParam = bodyPartMapping[formattedBodyPart] || 'Legs';
            
            // Try with just bodyPart parameter
            exercisesData = await fetchData(`${EXERCISE_API_BASE_URL}/v1/exercises/search?limit=50&offset=0&bodyPart=${bodyPartParam}`, exerciseOptions);
          } else {
            // For the original exercisedb API
            const encodedBodyPart = encodeUrlParam(formattedBodyPart);
            exercisesData = await fetchData(`${EXERCISE_API_BASE_URL}/exercises/bodyPart/${encodedBodyPart}`, exerciseOptions);
            
            // If that fails, try alternative endpoint
            if (!Array.isArray(exercisesData) || exercisesData.length === 0) {
              exercisesData = await fetchData(`${EXERCISE_API_BASE_URL}/exercises?bodyPart=${encodedBodyPart}&limit=1000`, exerciseOptions);
            }
          }
        }
        
        // Ensure exercisesData is an array before setting
        if (Array.isArray(exercisesData) && exercisesData.length > 0) {
          setExercises(exercisesData);
        } else {
          console.warn("Could not fetch exercises. This might be due to rate limiting or API changes. Please wait a moment and try again.");
          setExercises([]);
        }
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setExercises([]);
      }
    }
    
    fetchExercisesData();
  },[bodyPart]);


  // Ensure bodyParts is an array
  if (!Array.isArray(bodyParts) || bodyParts.length === 0) {
    return (
      <section>
        <div className="overflow-hidden">
          <h2 className='text-2xl sm:text-3xl md:text-5xl text-white capitalize text-center md:text-center border-b-4 border-red-500 sm:border-none mb-20'>Exercise Categories</h2>
          <p className="text-white text-center">Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section>
    
      <div className="overflow-hidden">
        <h2 className='text-2xl sm:text-3xl md:text-5xl text-white capitalize text-center md:text-center border-b-4 border-red-500 sm:border-none mb-20'>Exercise Categories</h2>
        <Swiper
          slidesPerView="auto"
          spaceBetween={20}
          // freeMode
          centeredSlides
          centeredSlidesBounds
          // modules={[FreeMode]}
          className="my-5"
        >

          {bodyParts.map((exercise, id) => (
              <SwiperSlide key={id} 
              style={{maxWidth:"150px", height: "auto", overflow:"hidden" }}
               className='shadow-lg animate-slideright cursor-pointer hover:opacity-80 transition-all overflow-hidden'>
            <div className='bg-white rounded-lg hover:bg-gray-200 transition text-center cursor-pointer border-t-2 border-t-rose-500 overflow-hidden' key={id} onClick={() => {setBodyPart(exercise);   window.scrollTo({ top: 1800, left: 100, behavior: 'smooth' });
            }} >
            <img src={exercisePng} alt="exercise-type" className='w-full mx-auto hover:scale-150 transition'/>
            <h2 className='text-xl border-b-2 border-b-green-500 hover:opacity-80 text-black '>{exercise}</h2>
          </div>
          </SwiperSlide>
          ))}

          </Swiper>
      </div>

    </section>
  )
}

export default BodyPart;