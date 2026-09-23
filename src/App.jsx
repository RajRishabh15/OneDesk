import { ThemeProvider } from './context/ThemeContext';
import Maintenance from './pages/Maintenance';

export default function App() {
  return (
    <ThemeProvider>
      <Maintenance />
    </ThemeProvider>
  );
}
