import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export default function BarChart({data, labels}) {
    const options = {
        responsive: true,
        plugins: {
          legend: {
              display: false,
            position: 'top' ,
          },
          title: {
            display: false,
            text: 'Bar Chart',
          },
        },
        maintainAspectRatio: false,
      };

      const barData = {
        labels,
        datasets: [
          {
            label: "Items",
            data: data,
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
          
        ],
      };
  return <Bar options={options} data={barData}   height={'350'}/>;
}
