# Prevent make from using the build folder
.PHONY: build

help: ## This help dialog.
	@grep -F -h "##" $(MAKEFILE_LIST) | grep -F -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

install-wails: ## Install wails and run doctor
	go install github.com/wailsapp/wails/v2/cmd/wails@latest
	wails doctor

build-proto: ## Build the Thrift protocol
	thrift -r -out src --gen go:skip_remote proto/zaap.thrift

dev: ## Run the application
	wails dev

build: ## Build the application
	wails build -upx

tidy: ## Generate go.mod & go.sum files
	go mod tidy

clean: ## Clean packages and binaries
	go clean -modcache
	rm -rf build/bin

test: ## Run all tests in the program
	@echo "Running all tests..."
	@go test -v -count=1 ./...

bench: ## Run all benchmarks in the program
	@echo "Running all benchmarks..."
	@go test -bench=. ./...