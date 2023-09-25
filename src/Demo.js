import React from "react";

const Demo = () => {
  const degree = 30;
  const radians = (degree * Math.PI) / 180;
  const ans = Math.sin(radians);

  return <>{console.log(ans)}</>;
};

export default Demo;
