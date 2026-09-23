import React, { useEffect, useState } from "react";

const MyComponent = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("https://api.example.com/data")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return <div>{JSON.stringify(data)}</div>;
};

return (
  <div>
    <h1>Hello, World!</h1>
    <p>This is my React component.</p>
  </div>
);

export default MyComponent;
