import { Helmet } from "react-helmet-async";

const Meta = ({ title, description, keyword }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keyword} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "כלי עבודה | Jobify",
  description: "מצא כלי עבודה לכל צורך במקום אחד",
  keyword:
    "כלים, כלי עבודה, Jobify, כלי עבודה לגינה, כלי עבודה לבית, כלי עבודה למכוניות, כלי עבודה למטבח",
};

export default Meta;
