import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './pages/app'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Room } from './pages/room'
import { Toaster } from './ui/sonner'
import { TooltipProvider } from './ui/tooltip'
import { ErrorBoundary, getErrorMessage } from 'react-error-boundary'
import { ViewTransition } from 'react'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		{/* NAVIGATION */}
		<ErrorBoundary
			fallbackRender={({ error, resetErrorBoundary }) => (
				<div role='alert'>
					<p>Something went wrong:</p>
					<pre>{getErrorMessage(error)}</pre>
					<button onClick={resetErrorBoundary}>Try again</button>
				</div>
			)}
		>
			<TooltipProvider>
				<ViewTransition enter={'slide-up'} exit={'slide-down'}>
					<BrowserRouter>
						<Routes>
							<Route path='/' element={<App />} />
							<Route path='/room/:roomId' element={<Room />} />
						</Routes>
					</BrowserRouter>
					<Toaster position='top-right' />
				</ViewTransition>
			</TooltipProvider>
		</ErrorBoundary>
	</StrictMode>,
)
