import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './pages/app'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Room } from './pages/room'
import { Toaster } from './ui/sonner'
import { TooltipProvider } from './ui/tooltip'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		{/* NAVIGATION */}
		<TooltipProvider>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<App />} />
					<Route path='/room/:roomId' element={<Room />} />
				</Routes>
			</BrowserRouter>
			<Toaster position='top-right' />
		</TooltipProvider>
	</StrictMode>,
)
