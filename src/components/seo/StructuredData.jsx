import { useEffect } from "react";

const StructuredData = ({ schema }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [schema]);

  return null;
};

export default StructuredData;
