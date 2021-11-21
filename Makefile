build-dev:
	cd client && $(MAKE) build.dev
	cd server && $(MAKE) build.dev

# -p project name
run-dev:
	docker-compose -p blackjack-app up 

build-prod:
	cd client && $(MAKE) build.prod
	cd server && $(MAKE) build.prod

# -p project name
run-prod:
	docker-compose -p blackjack-app-prod up 

