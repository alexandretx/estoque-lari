import React from 'react';

export const TableRowSkeleton = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse">
      {[...Array(cols)].map((_, index) => (
        <td key={index} className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </td>
      ))}
    </tr>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <>
      {[...Array(rows)].map((_, index) => (
        <TableRowSkeleton key={index} cols={cols} />
      ))}
    </>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-md p-4 w-full">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4">
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
        </div>
      ))}
    </div>
  );
};

export default {
  TableRowSkeleton,
  TableSkeleton,
  CardSkeleton,
  DashboardSkeleton
}; 