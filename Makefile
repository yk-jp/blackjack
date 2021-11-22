build-dev:
	cd client && $(MAKE) build-dev
	cd server && $(MAKE) build-dev

# -p project name
run-dev:
	docker-compose -f docker-compose.dev.yml -p blackjack-app up 

build-prod:
	cd client && $(MAKE) build-prod
	cd server && $(MAKE) build-prod

# -p project name
run-prod:
	docker-compose -f docker-compose.dev.yml -f docker-compose.prod.yml -p blackjack-app-prod up 

