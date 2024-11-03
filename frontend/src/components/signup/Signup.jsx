import React from 'react';

export default function Signup() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-sky-200">
            <div className="flex flex-col gap-y-4 border border-solid w-11/12 sm:w-96 p-6 bg-white shadow-lg">
                <form action="" className="flex flex-col gap-y-4">
                    <div>
                        <input 
                            type="text" 
                            placeholder="Name" 
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-200 font-semibold"
                        />
                    </div>
                    <div>
                        <input 
                            type="tel" 
                            placeholder="Phone" 
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-200 font-semibold"
                        />
                    </div>
                    <div>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-200 font-semibold"
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-200 font-semibold"
                        />
                    </div>
                    
                    <div>
                        <button 
                            type="submit" 
                            className="w-full py-2 bg-sky-500 text-white hover:bg-sky-200 transition duration-300 font-bold"
                        >
                            Sign Up
                        </button>
                    </div>
                    <div className="flex justify-center text-gray-500 text-sm font-semibold">
                        <span>Already have an account?</span>
                        <a href="/login" className="text-sky-500 ml-1 hover:underline">Log in</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
