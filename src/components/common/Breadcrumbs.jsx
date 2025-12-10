import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react"; // Assuming lucide-react is installed as it is common with shadcn

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link
            to="/home"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              {item.href ? (
                <Link
                  to={item.href}
                  className="ml-1 md:ml-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="ml-1 md:ml-2 text-sm font-medium text-foreground">
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
