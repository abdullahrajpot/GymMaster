import React, {useState, useEffect} from 'react';
import {AiOutlineSearch} from "react-icons/ai";
import { exerciseOptions, fetchData, EXERCISE_API_BASE_URL, IS_NEW_API } from '../utils/fetchData';
import BodyPart from './BodyPart';
const SearchInput = ( {setExercises, bodyPart, setBodyPart  } ) => {
  const [search, setSearch] = useState('');
  const [bodyParts, setBodyParts] = useState([]);
  
  useEffect(() => {
    const fetchBodypartsData = async () => {
      try {
        let bodypartsData = [];
        
        if (IS_NEW_API) {
          // For the gym-fit API - use hardcoded body parts since API structure is different
          bodypartsData = ["back", "cardio", "chest", "lower arms", "lower legs", "neck", "shoulders", "upper arms", "upper legs", "waist"];
        } else {
          // For the original exercisedb API
          bodypartsData = await fetchData(`${EXERCISE_API_BASE_URL}/exercises/bodyPartList`, exerciseOptions);
        }
        
        // Ensure bodypartsData is an array before spreading
        if (Array.isArray(bodypartsData) && bodypartsData.length > 0) {
          setBodyParts(["all", ...bodypartsData]);
        } else {
          console.warn("Could not fetch body parts. Using default list.");
          // Default body parts based on current ExerciseDB structure
          setBodyParts([
            "all", "back", "cardio", "chest", "lower arms", "lower legs", 
            "neck", "shoulders", "upper arms", "upper legs", "waist"
          ]);
        }
      } catch (error) {
        console.error("Error fetching body parts:", error);
        // Fallback to default list
        setBodyParts([
          "all", "back", "cardio", "chest", "lower arms", "lower legs", 
          "neck", "shoulders", "upper arms", "upper legs", "waist"
        ]);
      }
    }
    
    fetchBodypartsData();
  }, []);
  
  const handleSearch = async () => {
    if(search){
      try {
        let exercisesData = [];
        
        if (IS_NEW_API) {
          // For the gym-fit API - use smaller limit
          exercisesData = await fetchData(`${EXERCISE_API_BASE_URL}/v1/exercises/search?limit=50&offset=0`, exerciseOptions);
        } else {
          // For the original exercisedb API
          exercisesData = await fetchData(`${EXERCISE_API_BASE_URL}/exercises?limit=1000`, exerciseOptions);
        }
        
        // Ensure exercisesData is an array before filtering
        if (Array.isArray(exercisesData) && exercisesData.length > 0) {
          const searchedExercises = exercisesData.filter((exercise) => 
            exercise.name?.toLowerCase().includes(search) || 
            exercise.target?.toLowerCase().includes(search) || 
            exercise.equipment?.toLowerCase().includes(search) || 
            exercise.bodyPart?.toLowerCase().includes(search)
          );
          setSearch('');
          setExercises(searchedExercises);
          window.scrollTo({top:1500, left:100, behavior:"smooth"})
        } else {
          console.error("No exercises found or invalid data:", exercisesData);
          setExercises([]);
        }
      } catch (error) {
        console.error("Error searching exercises:", error);
        setExercises([]);
      }
    }
  }

  return (
    <section className='pt-32 '>
      <div className='px-7 sm:px-14 space-y-12'>
          <h2 className='text-2xl sm:text-3xl md:text-5xl text-white capitalize text-center md:text-center border-b-4 border-red-500 sm:border-none'>awesome exercise you <br /> should know</h2>
          <div className='flex flex-row justify-center items-center'>
            <input type="text" placeholder='search' className='outline-none px-6 py-2 text-2xl text-gray-400 w-full max-w-4xl' value={search} onChange={(e) => setSearch(e.target.value.toLocaleLowerCase())}/>
            <button className='text-3xl md:text-4xl px-5 text-white bg-blue-500 py-[7px] rounded hover:bg-blue-600' onClick={handleSearch}><AiOutlineSearch/></button>
          </div>
          
          <BodyPart bodyParts={bodyParts} bodyPart={bodyPart} setBodyPart={setBodyPart} setExercises={setExercises}/>
      </div>
        
    </section>
  )
}

export default SearchInput;