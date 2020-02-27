GENDIR := gen
OPENAPI_OUTDIR := "./$(GENDIR)/openapi"

# Find all .proto files.
PROTO_FILES := $(wildcard opentelemetry/proto/*/v1/*.proto opentelemetry/proto/collector/*/v1/*.proto)

# Function to execute a command. Note the empty line before endef to make sure each command
# gets executed separately instead of concatenated with previous one.
# Accepts command to execute as first parameter.
define exec-command
$(1)

endef

# Function to make sure that the git directory is clean.
define check-git-status
if [ -n $$(git --no-pager status -s 2> /dev/null) ] ;\
then \
	echo "Git tree is not clean. Did you forget to commit some files?" ;\
	git --no-pager status ;\
fi
endef

# CI build
.PHONY: ci
ci: validate-go gen-java gen-swagger

# Validate that generated Go files are up to date.
.PHONY: validate-go
validate-go: gen-go-ci
	$(check-git-status)

# Generate ProtoBuf implementation for Go.
.PHONY: gen-go-ci
gen-go-ci:
	rm -rf ./$(GENDIR)/go
	$(foreach file,$(PROTO_FILES),$(call exec-command,protoc --go_out=plugins=grpc:$(GOPATH)/src $(file)))

# Generate ProtoBuf implementation for Go.
.PHONY: gen-go
gen-go:
	rm -rf ./$(GENDIR)/go
	$(foreach file,$(PROTO_FILES),$(call exec-command,protoc --go_out=plugins=grpc:$(GOPATH)/src $(file)))
	cp -R $(GOPATH)/src/github.com/open-telemetry/opentelemetry-proto/$(GENDIR)/go ./gen/

# Generate ProtoBuf implementation for Java.
.PHONY: gen-java
gen-java:
	rm -rf ./$(GENDIR)/java
	mkdir -p ./$(GENDIR)/java
	$(foreach file,$(PROTO_FILES),$(call exec-command, protoc --java_out=./$(GENDIR)/java $(file)))

# Generate Swagger
.PHONY: gen-swagger
gen-swagger:
	mkdir -p $(OPENAPI_OUTDIR)
	protoc --plugin=protoc-gen-swagger=/usr/bin/protoc-gen-swagger --swagger_out=logtostderr=true,grpc_api_configuration=opentelemetry/proto/collector/trace/v1/trace_service_http.yaml:$(OPENAPI_OUTDIR) opentelemetry/proto/collector/trace/v1/trace_service.proto
