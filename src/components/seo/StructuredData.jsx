import { useEffect } from "react";

const StructuredData = ({ schema }) => {
  useEffect(() => {
    // Don't create script tag if schema is null/undefined
    if (!schema) {
      return;
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      // Cleanup: Remove script tag when component unmounts or schema changes
      // This ensures old schema is removed when navigating between posts
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, [schema]);

  return null;
};

export default StructuredData;
