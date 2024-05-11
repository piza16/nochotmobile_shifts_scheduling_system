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
  title: "משמרות | NOC Shifts",
  description: "מערכת ניהול משמשות של בקרת הוט מובייל",
  keyword: "",
};

export default Meta;
