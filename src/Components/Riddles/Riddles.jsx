import React from "react";
// import "./Riddles.css";

const riddles = [
  { question: "The more you take, the more you leave behind. What am I?" },
  { question: "I have keys but open no locks. What am I?" },
  { question: "The person who makes it has no need for it. What is it?" },
  { question: "I fly without wings. I cry without eyes. What am I?" },
  { question: "What has to be broken before you can use it?" },
  { question: "The more you remove from me, the bigger I become. What am I?" },
  {
    question:
      "I am always hungry, I must always be fed. The finger I touch will soon turn red. What am I?",
  },
  {
    question:
      "I have cities, but no houses. I have mountains, but no trees. What am I?",
  },
  {
    question:
      "What can travel around the world while staying in the same spot?",
  },
  { question: "What has one eye but can't see?" },
];

const Riddles = () => {
  return (
    <div className="p-4 bg-black mt-16 ">
      <div className=" relative text-center bg-red-950 text-white py-4 rounded-xl bg-opacity-50">  
        <h1 className=" text-2xl lg:text-3xl font-extrabold">
          Your Hints to Reach the Treasure's Keys
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 bg-black">
        {riddles.map((riddle, index) => (
          <div key={index} className=" relative  rounded-xl overflow-hidden ">
            <img
              src="../../../Riddlepng.png"
              alt="Riddle"
              className="w-full  object-center"
            />
            <div className=" absolute top-1/3  left-0 w-full h-full text-center text-black p-2">
              <p className="text-xl sm:text-2xl text-black font-bold">
                {riddle.question}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Riddles;
