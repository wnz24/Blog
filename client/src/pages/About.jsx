import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-2xl mx-auto p-6 text-center bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white my-6">
          About Noor's Blog
        </h1>
        <div className="text-lg text-gray-600 dark:text-gray-300 flex flex-col gap-6 leading-relaxed">
          <p>
            Welcome to my blog! This is where I share my journey as a software developer, diving into coding, tech insights, and problem-solving. Whether you're just starting or looking to sharpen your skills, you'll find something valuable here.
          </p>
          <p>
            From JavaScript frameworks like React and Node.js to backend technologies and best practices, I love exploring modern web development trends and sharing what I learn along the way.
          </p>
          <p>
            Beyond technical content, I also discuss productivity, self-improvement, and the mindset needed to grow as a developer. Let's learn, build, and innovate together!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
