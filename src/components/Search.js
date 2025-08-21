import React from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6';

const Search = () => {
    return (
        <div className="flex flex-row w-full h-8 pl-1 space-x-4 items-center rounded-full bg-white">
            <button className='flex w-6 h-6 rounded-full items-center justify-center text-heading shrink-0'>
                <FaMagnifyingGlass size={20}/>
            </button>
            <input className='w-full text-heading text-sm tracking-wider bg-transparent focus:outline-hidden placeholder-heading' 
                placeholder='Search...'
            />
        </div>
    )
}

export default Search