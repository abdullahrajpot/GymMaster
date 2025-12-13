// import React, {useState, useEffect} from 'react'
// import { useParams } from "react-router-dom";
// import { GiGymBag } from "react-icons/gi";
// import { fetchData, exerciseOptions, youtubeExerciseOptions} from "../utils/fetchData";
// import {ExerciseCard, ExerciseVideos} from "../components";
// const ExerciseDetail = () => {
  
//   const {id} = useParams();
//   const [exercises, setExercises] = useState({});
//   const [youtubeVideo, setYoutubeVideo] = useState([]);
//   const [targetMuscle, setTargetMuscle] = useState([]);
//   const [equipmentExercise, setEquipmentExercise] = useState([]);


//   useEffect(() => {
//     const exerciseData = async () => {
//      const particularExerciseData = await fetchData(`https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`, exerciseOptions );
//     //  console.log(particularExerciseData);
//      setExercises(particularExerciseData);

//      const youtubeExerciseVideoData = await fetchData(`https://youtube-search-and-download.p.rapidapi.com/search?query=${particularExerciseData.name}`, youtubeExerciseOptions );
//     //  console.log(youtubeExerciseVideoData.contents);
//      setYoutubeVideo(youtubeExerciseVideoData.contents);

//      const targetMuscleData= await fetchData(`https://exercisedb.p.rapidapi.com/exercises/target/${particularExerciseData.target}`, exerciseOptions );
//     //  console.log(targetMuscleData);
//      setTargetMuscle(targetMuscleData);

//      const equipmentExerciseData = await fetchData(`https://exercisedb.p.rapidapi.com/exercises/equipment/${particularExerciseData.equipment}`, exerciseOptions);
//     //  console.log(equipmentExerciseData);
//      setEquipmentExercise(equipmentExerciseData);
//     }  

//     exerciseData();
//     window.scrollTo({top:0, left:0, behavior:"smooth"})

//   }, [id]);

//   if(exercises.length === 0){
//     return(
//       <h1 className='text-4xl flex justify-center items-center w-full h-screen text-center'>Loading.....</h1>
//     )
//   }

//   return (
//     <section className=''>
//       <div className="px-7 sm:px-14">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-white rounded-md">
//             <img src={exercises.gifUrl} className='w-full' alt="gym" loading='lazy' />
//           </div>                            
//           <div className="rounded flex flex-col gap-6 justify-center">
//             <h2 className='font-medium text-2xl md:text-4xl capitalize'>{exercises.name}</h2>
//             <p className='capitalize text-lg text-gray-500 font-medium'>exercises keep you strong {exercises.name} is one of the best exercises to target your {exercises.target} . it will help you improve your mood and energy</p>
//            <div className='flex flex-col md:flex-row gap-10'>
//             <div><GiGymBag className='rounded-full bg-orange-500 text-7xl p-2 md:p-3 lg:p-4 hover:bg-orange-600 text-white'/> <span className='capitalize text-xl'>{exercises.equipment}</span></div>
//             <div><GiGymBag className='rounded-full bg-orange-500 text-7xl p-2 md:p-3 lg:p-4 hover:bg-orange-600 text-white'/> <span className='capitalize text-xl'>{exercises.target}</span></div>
//             <div><GiGymBag className='rounded-full bg-orange-500 text-7xl p-2 md:p-3 lg:p-4 hover:bg-orange-600 text-white'/> <span className='capitalize text-xl'>{exercises.bodyPart}</span></div>
//            </div>
//           </div>
//         </div>
//       </div>


//   <ExerciseVideos youtubeVideo={youtubeVideo} name="related"/>
//   <ExerciseCard exercises={targetMuscle} heading="target muscle"/>
//   <ExerciseCard exercises={equipmentExercise} heading="equipment muscle"/>

//     </section>
//   )
// }

// export default ExerciseDetail;


// aos 

import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { GiGymBag } from "react-icons/gi";
import { fetchData, exerciseOptions, youtubeExerciseOptions, EXERCISE_API_BASE_URL, encodeUrlParam, IS_NEW_API } from "../utils/fetchData";
import { ExerciseCard, ExerciseVideos } from "../components";
import AOS from 'aos'; 
import 'aos/dist/aos.css'; 

const ExerciseDetail = () => {
  const { id } = useParams();
  const [exercises, setExercises] = useState({});
  const [youtubeVideo, setYoutubeVideo] = useState([]);
  const [targetMuscle, setTargetMuscle] = useState([]);
  const [equipmentExercise, setEquipmentExercise] = useState([]);

  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({    duration: 1000, // Animation duration in milliseconds
      easing: 'ease-in-out', // Animation easing
      offset: 120, // Trigger animation before the element comes into view
      once: true });
  }, []);

  useEffect(() => {
    const exerciseData = async () => {
      try {
        let exerciseEndpoint;
        
        if (IS_NEW_API) {
          // For the gym-fit API - search by exercise name/id
          exerciseEndpoint = `${EXERCISE_API_BASE_URL}/v1/exercises/search?limit=1&offset=0&name=${encodeUrlParam(id)}`;
        } else {
          // For the original exercisedb API
          exerciseEndpoint = `${EXERCISE_API_BASE_URL}/exercises/exercise/${encodeUrlParam(id)}`;
        }
        
        const particularExerciseData = await fetchData(exerciseEndpoint, exerciseOptions);
        
        // Check if we got valid exercise data
        let exerciseData = particularExerciseData;
        
        // For gym-fit API, the response might be an array
        if (IS_NEW_API && Array.isArray(particularExerciseData) && particularExerciseData.length > 0) {
          exerciseData = particularExerciseData[0];
        }
        
        if (exerciseData && typeof exerciseData === 'object' && (exerciseData.name || exerciseData.title)) {
          setExercises(exerciseData);

          // Fetch YouTube videos
          const exerciseName = exerciseData.name || exerciseData.title || id;
          const youtubeExerciseVideoData = await fetchData(`https://youtube-search-and-download.p.rapidapi.com/search?query=${exerciseName}`, youtubeExerciseOptions);
          if (youtubeExerciseVideoData && youtubeExerciseVideoData.contents && Array.isArray(youtubeExerciseVideoData.contents)) {
            setYoutubeVideo(youtubeExerciseVideoData.contents);
          } else {
            setYoutubeVideo([]);
          }

          // Fetch target muscle exercises
          const targetMuscle = exerciseData.target || exerciseData.primaryMuscles?.[0];
          if (targetMuscle) {
            const encodedTarget = encodeUrlParam(targetMuscle);
            let targetMuscleData;
            
            if (IS_NEW_API) {
              targetMuscleData = await fetchData(`${EXERCISE_API_BASE_URL}/v1/exercises/search?limit=20&offset=0&primaryMuscles=${encodedTarget}`, exerciseOptions);
            } else {
              targetMuscleData = await fetchData(`${EXERCISE_API_BASE_URL}/exercises/target/${encodedTarget}`, exerciseOptions);
              
              // Try alternative endpoint if first fails
              if (!Array.isArray(targetMuscleData) || targetMuscleData.length === 0) {
                targetMuscleData = await fetchData(`${EXERCISE_API_BASE_URL}/exercises?target=${encodedTarget}&limit=100`, exerciseOptions);
              }
            }
            
            setTargetMuscle(Array.isArray(targetMuscleData) ? targetMuscleData : []);
          }

          // Fetch equipment exercises
          const equipment = exerciseData.equipment;
          if (equipment) {
            const encodedEquipment = encodeUrlParam(equipment);
            let equipmentExerciseData;
            
            if (IS_NEW_API) {
              equipmentExerciseData = await fetchData(`${EXERCISE_API_BASE_URL}/v1/exercises/search?limit=20&offset=0&equipment=${encodedEquipment}`, exerciseOptions);
            } else {
              equipmentExerciseData = await fetchData(`${EXERCISE_API_BASE_URL}/exercises/equipment/${encodedEquipment}`, exerciseOptions);
              
              // Try alternative endpoint if first fails
              if (!Array.isArray(equipmentExerciseData) || equipmentExerciseData.length === 0) {
                equipmentExerciseData = await fetchData(`${EXERCISE_API_BASE_URL}/exercises?equipment=${encodedEquipment}&limit=100`, exerciseOptions);
              }
            }
            
            setEquipmentExercise(Array.isArray(equipmentExerciseData) ? equipmentExerciseData : []);
          }
        } else {
          console.error("Failed to fetch exercise data");
          setExercises({});
          setYoutubeVideo([]);
          setTargetMuscle([]);
          setEquipmentExercise([]);
        }
      } catch (error) {
        console.error("Error fetching exercise data:", error);
        setExercises({});
        setYoutubeVideo([]);
        setTargetMuscle([]);
        setEquipmentExercise([]);
      }
    }

    exerciseData();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  if (Object.keys(exercises).length === 0) {
    return (
      <h1 className='text-4xl flex justify-center items-center w-full h-screen text-center'>Loading.....</h1>
    );
  }

  return (
    <section className=''>
      <div className="px-7 sm:px-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-md" data-aos="fade-up"> {/* Add AOS here */}
            <img src={exercises.gifUrl} className='w-full' alt="gym" loading='lazy' />
          </div>
          <div className="rounded flex flex-col gap-6 justify-center" data-aos="fade-up"> {/* Add AOS here */}
            <h2 className='font-medium text-2xl md:text-4xl capitalize'>{exercises.name}</h2>
            <p className='capitalize text-lg text-gray-500 font-medium'>Exercises keep you strong. {exercises.name} is one of the best exercises to target your {exercises.target}. It will help you improve your mood and energy.</p>
            <div className='flex flex-col md:flex-row gap-10'>
              <div><GiGymBag className='rounded-full bg-orange-500 text-7xl p-2 md:p-3 lg:p-4 hover:bg-orange-600 text-white' /> <span className='capitalize text-xl'>{exercises.equipment}</span></div>
              <div><GiGymBag className='rounded-full bg-orange-500 text-7xl p-2 md:p-3 lg:p-4 hover:bg-orange-600 text-white' /> <span className='capitalize text-xl'>{exercises.target}</span></div>
              <div><GiGymBag className='rounded-full bg-orange-500 text-7xl p-2 md:p-3 lg:p-4 hover:bg-orange-600 text-white' /> <span className='capitalize text-xl'>{exercises.bodyPart}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Adding AOS to ExerciseVideos and ExerciseCard */}
      <ExerciseVideos youtubeVideo={youtubeVideo} name="related" data-aos="fade-up" />
      <ExerciseCard exercises={targetMuscle} heading="Target Muscle" data-aos="fade-up" />
      <ExerciseCard exercises={equipmentExercise} heading="Equipment Muscle" data-aos="fade-up" />
    </section>
  );
}

export default ExerciseDetail;
