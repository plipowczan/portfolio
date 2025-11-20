import { Helmet } from "react-helmet-async";

const StructuredData = ({ schema }) => {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default StructuredData;
