
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartData } from '../types';

interface BarChartComponentProps {
  data: ChartData[];
  xAxisKey: string;
  barDataKey: string;
  barName?: string;
  fillColor?: string;
  title?: string;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  xAxisKey,
  barDataKey,
  barName = "Count",
  fillColor = "#2C5E9E", // university-blue-light
  title
}) => {
  if (!data || data.length === 0) {
    return <div className="p-4 text-center text-gray-500">No data available for chart.</div>;
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow h-96">
      {title && <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20, // Adjusted for better label visibility
            left: 0,  // Adjusted for better label visibility
            bottom: 50, // Increased bottom margin for XAxis labels
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey={xAxisKey} 
            angle={-35} // Angle labels
            textAnchor="end" // Anchor angled labels at the end
            interval={0} // Show all labels if possible, adjust if too crowded
            tick={{ fontSize: 10, fill: '#374151' }} // Smaller font size for labels
            height={60} // Allocate more height for XAxis labels
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#374151' }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px' }}
            labelStyle={{ color: '#333', fontWeight: 'bold' }}
          />
          <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
          <Bar dataKey={barDataKey} name={barName} fill={fillColor} radius={[4, 4, 0, 0]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
