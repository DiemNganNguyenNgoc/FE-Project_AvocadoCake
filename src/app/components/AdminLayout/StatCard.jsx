import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../../utils/cn";

/**
 * StatCard - Modern statistics card component
 * Inspired by NextJS admin dashboard with AvocadoCake design system
 */
const StatCard = ({
  title,
  value,
  change,
  icon,
  color = "bg-primary",
  progress,
  subtitle,
  hideProgress = false,
}) => {
  const isPositiveChange = change >= 0;
  const isDecreasing = change < 0;

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Icon Section */}
      <div className={cn("rounded-lg p-3 inline-flex", color)}>{icon}</div>

      {/* Stats Section */}
      <div className="mt-6 flex items-end justify-between">
        <dl className="flex-1">
          <dt className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
            {value}
          </dt>
          <dd className="text-sm font-medium text-dark-6 dark:text-dark-6">
            {title}
          </dd>
          {subtitle && (
            <dd className="mt-1 text-body-xs text-dark-5 dark:text-dark-5">
              {subtitle}
            </dd>
          )}
        </dl>

        {/* Change Indicator */}
        {!hideProgress && change !== undefined && (
          <dl
            className={cn(
              "text-sm font-medium",
              isDecreasing ? "text-red" : "text-green"
            )}
          >
            <dt className="flex items-center gap-1.5">
              {Math.abs(change)}%
              {isDecreasing ? (
                <TrendingDown className="h-4 w-4" aria-hidden="true" />
              ) : (
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
              )}
            </dt>
            <dd className="sr-only">
              {title} {isDecreasing ? "Giảm" : "Tăng"} {Math.abs(change)}%
            </dd>
          </dl>
        )}
      </div>

      {/* Progress Bar */}
      {!hideProgress && progress !== undefined && (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-body-sm font-medium text-dark-6 dark:text-dark-6">
              Tiến độ
            </span>
            <span className="text-body-sm font-medium text-dark dark:text-white">
              {progress}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-2 dark:bg-dark-3">
            <div
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                isPositiveChange ? "bg-green" : "bg-red"
              )}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
