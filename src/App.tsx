import { BrowserRouter, Routes, Route } from 'react-router-dom'; import Home,{Application,Offer} from './pages/pages'; import './index.css';
export default function App(){return <BrowserRouter><Routes><Route path="/" element={<Home/>}/><Route path="/application" element={<Application/>}/><Route path="/offer" element={<Offer/>}/></Routes></BrowserRouter>}
