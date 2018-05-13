// Upload to CloudApp
//
// Sketch plugin to upload the selected artboard to CloudApp.
//
// Copyright (c) 2018 Mike Gowen, Delighted

const sketch = require("sketch");

// Run handlers

export default function(context) {
  let document = sketch.fromNative(context.document);
  let selectedLayers = toArray(document.selectedLayers);

  if (!validSelection(selectedLayers)) {
    sketch.UI.message("Please select a single artboard to upload. CloudApp must be installed.");
    return false;
  }

  let artboard = selectedLayers[0];
  let artboardSaveDirectory = saveDirectory(artboard);
  let savedArtboardPath = saveArtboardToDirectory(artboard, artboardSaveDirectory);

  uploadSavedArtboard(savedArtboardPath);
}

// Functions

function uploadSavedArtboard(savedArtboardPath) {
  let uploadSuccess = NSWorkspace.sharedWorkspace().openFile_withApplication(savedArtboardPath, "CloudApp")
  if (uploadSuccess) {
    sketch.UI.message("Artboard uploaded!");
  }
}

function saveArtboardToDirectory(artboard, directory) {
  let fullPath = directory + "/" + artboard.name + ".png";
  sketch.export(artboard, { output: fullPath });
  return fullPath;
}

function saveDirectory() {
  let fileManager = NSFileManager.defaultManager()
  let cachesURL = fileManager.URLsForDirectory_inDomains(NSCachesDirectory, NSUserDomainMask).lastObject()
  return cachesURL.URLByAppendingPathComponent("com.delighted.upload-to-cloudapp").path()
}

function validSelection(selectedLayers) {
  log(NSWorkspace.sharedWorkspace().fullPathForApplication("CloudApp"));
  if (selectedLayers.length !== 1) return false;
  if (selectedLayers[0].type !== String(sketch.Types.Artboard)) return false;
  if (!NSWorkspace.sharedWorkspace().fullPathForApplication("CloudApp")) return false;
  return true;
}

function toArray(nsArray) {
  return nsArray.map(el => el);
}

