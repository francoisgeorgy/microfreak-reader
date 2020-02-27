#!/usr/bin/env bash

rsync -avi --delete --exclude=.DS_Store --exclude=.git --exclude=.idea /Users/francois/dev/projects/microfreak-reader/build/ kimsufi2:/home/applications/microfreak-reader/

#DEST=~/dev/projects/studiocode-static/microfreak/reader
#cd ~/dev/projects/microfreak-reader
#rm -rf ${DEST}/static ${DEST}/*.js ${DEST}/*.json ${DEST}/*.html
#rsync -av --exclude=.DS_Store build/ ${DEST}/

# rsync -av --exclude=.DS_Store ${DEST}/ kimsufi:/home/sites/sysex.io/midi-baby/editor/
# rsync -avi --delete --exclude=.DS_Store build/ kimsufi:/home/sites/sysex.io/midi-baby/editor/