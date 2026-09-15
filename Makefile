.PHONY: install install-frontend install-backend

install: install-frontend install-backend

install-frontend:
	cd frontend && npm install

install-backend:
	cd backend && npm install