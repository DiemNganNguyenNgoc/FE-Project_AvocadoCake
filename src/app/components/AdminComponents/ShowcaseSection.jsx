import React from "react";
import { cn } from "../../../utils/cn";

/**
 * ShowcaseSection - Wrapper component for dashboard sections
 * Inspired by NextJS admin template
 */
const ShowcaseSection = ({ title, children, className, headerAction }) => {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="border-b border-stroke px-4 py-4 dark:border-dark-3 sm:px-6 xl:px-7.5">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-dark dark:text-white text-body-2xlg">
            {title}
          </h2>
          {headerAction && <div>{headerAction}</div>}
        </div>
      </div>

      <div className={cn("p-4 sm:p-6 xl:p-10", className)}>{children}</div>
    </div>
  );
};

export default ShowcaseSection;
