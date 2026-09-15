.PHONY: install install-frontend install-backend up down build logs

install: install-frontend install-backend

install-frontend:
	cd frontend && npm install

install-backend:
	cd backend && npm install

build:
	docker compose build

up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f