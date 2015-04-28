MODULE		  = convert-rich-text
EXPORT 		  = $(MODULE)
BUILD_DIR 	= build

BUNDLE 		  = $(BUILD_DIR)/$(MODULE).js
ENTRY		    = index.js
SRC 		    = $(ENTRY)

TEST_BUNDLE = $(BUILD_DIR)/test.js
TEST_ENTRY  = test/test.js
TEST_SRC    = $(TEST_ENTRY)

BROWSERIFY  = node_modules/.bin/browserify
WATCHIFY    = node_modules/.bin/watchify
JSHINT      = node_modules/.bin/jshint
MOCHA       = node_modules/.bin/mocha-phantomjs
HTTP_SERVER = node_modules/.bin/http-server

ifneq ($(wildcard lib),)
	SRC += $(shell find lib -type f -name '*.js')
endif

.PHONY: all clean info watch lint test server

all: $(BUNDLE) $(TEST_BUNDLE)

clean:
	rm -rf $(BUILD_DIR)

info:
	@echo "Source:" $(SRC)
	@echo "Test Source:" $(TEST_SRC)

watch:
	$(WATCHIFY) --verbose -x $(EXPORT) -o $(TEST_BUNDLE) $(TEST_ENTRY) &
	$(WATCHIFY) --verbose -r $(EXPORT) -o $(BUNDLE) $(ENTRY)

lint:
	$(JSHINT) --verbose .

test: $(BUNDLE) $(TEST_BUNDLE)
	$(MOCHA) test/index.html

server:
	$(HTTP_SERVER)

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(BUNDLE): $(BUILD_DIR) $(SRC)
	$(BROWSERIFY) -r $(EXPORT) -o $(BUNDLE) $(ENTRY)

$(TEST_BUNDLE): $(BUILD_DIR) $(TEST_SRC)
	$(BROWSERIFY) -x $(EXPORT) -o $(TEST_BUNDLE) $(TEST_ENTRY)
