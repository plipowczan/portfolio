import { FaChevronRight, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center space-x-2 text-sm text-gray-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <FaChevronRight className="w-3 h-3 mx-2 text-gray-600" />
              )}
              
              {isLast ? (
                <span className="text-primary-500 font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center py-0.5 hover:text-primary-500 transition-colors"
                >
                  {index === 0 && <FaHome className="mr-1.5 w-4 h-4" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
