copy-to-alfred:
	echo "Copying source files to defined Alfred workflow directory.."
	cp src/* ${WORKFLOW_PATH}
copy-info-from-alfred:
	echo "Copying info source file from defined Alfred workflow directory to project"
	cp ${WORKFLOW_PATH}/info.plist src/
run-workflow:
	echo "Starting workflow from terminal (with test icon 'sun').."
	osascript -e 'tell application id "com.runningwithcrayons.Alfred" to run trigger "terminal-trigger" in workflow "com.github.rialdave.alfred-iconify" with argument "sun"'
bundle-workflow:
	echo "Bundling workflow ..."
	cd src && zip -rq9 ../output/alfred-iconify.alfredworkflow *

# SETTINGS
TARGET_MAX_CHAR_NUM := 25
MAKEFLAGS += --silent

include .env
