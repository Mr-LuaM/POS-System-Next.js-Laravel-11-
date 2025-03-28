import {
    Chart as ChartJS,
    LineElement,
    BarElement,
    PointElement,
    ArcElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    Filler,
  } from "chart.js";
  
  // ✅ Register Chart.js components
  ChartJS.register(
    LineElement,
    BarElement,
    PointElement,
    ArcElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    Filler
  );
  
  export default ChartJS;
  