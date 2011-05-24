test:
	@find test/*.js | xargs -n 1 -t expresso

.PHONY: test
