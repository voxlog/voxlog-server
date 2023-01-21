setup-db:
	@echo "Creating database..."
	docker-compose up -d
	@echo "Waiting for database to start..."
	sleep 5
	@echo "Creating database schema..."
	yarn prisma migrate dev
	@echo "Seeding database..."
	yarn prisma db seed
	@echo "Database setup complete."
