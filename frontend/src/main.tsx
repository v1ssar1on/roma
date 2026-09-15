import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './pages/app'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Room } from './pages/room'

import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<App />} />
				<Route path='/room/:roomId' element={<Room />} />
			</Routes>
		</BrowserRouter>
		<ToastContainer
			position='top-right'
			autoClose={5000}
			hideProgressBar={false}
			newestOnTop={false}
			closeOnClick={false}
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover
			theme='dark'
		/>
	</StrictMode>,
)
