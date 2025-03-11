import React from 'react';
import CallToAction from '../components/CallToAction';

const projects = [
  {
    title: "Chat Application",
    description: "A real-time chat app built with MERN stack and Socket.io for seamless messaging.",
  },
  {
    title: "Personal Finance Tracker",
    description: "Track your income and expenses with ease using this Python-powered finance tool.",
  },
  {
    title: "AI Chatbot",
    description: "An AI-powered chatbot built with OpenAI’s API for intelligent conversations.",
  },
];

const Projects = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Projects</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">Build fun projects while learning!</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{project.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{project.description}</p>
          </div>
        ))}
      </div>
      <div className='mt-6'>

        <CallToAction />
      </div>
    </div>
  );
};

export default Projects;
