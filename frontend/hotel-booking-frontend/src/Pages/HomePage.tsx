import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="pt-8"> {/* Added top padding */}
      <h1 className="text-3xl font-bold">Welcome to StayMate</h1>
      <p className="text-lg mt-2">Find the best hotels near you!</p>
    </div>
  );
};

export default HomePage;