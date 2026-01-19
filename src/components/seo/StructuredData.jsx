import { useEffect } from "react";

const StructuredData = ({ schema }) => {
  useEffect(() => {
    let script = null;

    // Only create script tag if schema exists
    if (schema) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup: Remove script tag when component unmounts or schema changes
      // This ensures old schema is removed even when new schema is null
      if (script && script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, [schema]);

  return null;
};

export default StructuredData;
