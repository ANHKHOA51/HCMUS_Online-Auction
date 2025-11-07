import './App.css'
import Header from './components/Header'
import Home from "./pages/Home";
import { Route, Routes, BrowserRouter } from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<Header></Header>
			<Routes>
				<Route path="/" element={<Home />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App