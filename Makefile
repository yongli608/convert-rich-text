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

.PHONY: all clean info start lint test

all: $(BUNDLE) $(TEST_BUNDLE)

clean:
	rm -rf $(BUILD_DIR)

info:
	@echo "Source:" $(SRC)
	@echo "Test Source:" $(TEST_SRC)

start:
	$(HTTP_SERVER) &
	$(WATCHIFY) --verbose --debug --external $(EXPORT) --outfile $(TEST_BUNDLE) $(TEST_ENTRY) &
	$(WATCHIFY) --verbose --debug --require $(EXPORT) --outfile $(BUNDLE) $(ENTRY)

lint:
	$(JSHINT) --verbose .

test: $(BUNDLE) $(TEST_BUNDLE)
	$(MOCHA) test/index.html

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(BUNDLE): $(BUILD_DIR) $(SRC)
	$(BROWSERIFY) --debug --require $(EXPORT) --outfile $(BUNDLE) $(ENTRY)

$(TEST_BUNDLE): $(BUILD_DIR) $(TEST_SRC)
	$(BROWSERIFY) --debug --external $(EXPORT) --outfile $(TEST_BUNDLE) $(TEST_ENTRY)
