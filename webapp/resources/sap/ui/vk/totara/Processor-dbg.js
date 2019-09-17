
sap.ui.define([
	"./Command",
	"./CameraHandler",
	"./TreeHandler",
	"./NotificationHandler",
	"./MeshHandler",
	"./MaterialHandler",
	"./ImageHandler",
	"./ViewHandler",
	"./AnimationHandler",
	"./AnnotationHandler"
], function(
	Command,
	CameraHandler,
	TreeHandler,
	NotificationHandler,
	MeshHandler,
	MaterialHandler,
	ImageHandler,
	ViewHandler,
	AnimationHandler,
	AnnotationHandler
) {
	"use strict";

	var Processor = function() {

		var callbackMap = new Map();
		var numCommandSkipped = 0;

		this.setCommandCallback = function(commandName, callback) {
			callbackMap.set(commandName, callback);
		};

		this.process = function(state, command) {

			var result;
			var skipped = false;

			if (command.sceneId) {
				state.currentSceneInfo.id = command.sceneId;
			}

			switch (command.name) {

				case Command.setCamera:
					result = CameraHandler.setCamera(state, command.jsonContent, command.binaryContent);
					break;

				case Command.notifyFinishedMaterial:
					result = NotificationHandler.notifyFinishedMaterial(state, command.jsonContent, command.binaryContent);
					break;

				case Command.notifyFinishedImage:
					result = NotificationHandler.notifyFinishedImage(state, command.jsonContent, command.binaryContent);
					break;

				case Command.notifyFinishedMesh:
					result = NotificationHandler.notifyFinishedMesh(state, command.jsonContent, command.binaryContent);
					break;

				case Command.notifyFinishedGeometry:
					result = NotificationHandler.notifyFinishedGeometry(state, command.jsonContent, command.binaryContent);
					break;

				case Command.setMesh:
					result = MeshHandler.setMesh(state, command.jsonContent, command.binaryContent);
					break;

				case Command.setMaterial:
					result = MaterialHandler.setMaterial(state, command.jsonContent, command.binaryContent);
					break;

				case Command.setGeometry:
					result = MeshHandler.setGeometry(state, command.jsonContent, command.binaryContent);
					break;

				case Command.setAnnotation:
					result = AnnotationHandler.setAnnotation(state, command.jsonContent, command.binaryContent);
					break;

				case Command.setImage:
					result = ImageHandler.setImage(state, command.jsonContent, command.binaryContent);
					break;

				case Command.setHighlightStyle:
					result = AnimationHandler.setHighlightStyle(state, command.jsonContent, command.binaryContent);
					break;

				case Command.notifyError:
					result = NotificationHandler.notifyError(state, command.jsonContent, command.binaryContent);
					break;

				case Command.timestamp:
					result = NotificationHandler.timestamp(state, command.jsonContent, command.binaryContent);
					break;

				case Command.setTree:
					result = TreeHandler.setTree(state, command.jsonContent);
					break;

				case Command.setTreeNode:
					result = TreeHandler.setTreeNode(state, command.jsonContent);
					break;

				case Command.notifyFinishedTree:
					result = TreeHandler.notifyFinishedTree(state, command.jsonContent);
					break;

				case Command.setView:
					result = ViewHandler.setView(state, command.jsonContent);
					break;

				case Command.setPlayback:
					result = AnimationHandler.setPlayback(state, command.jsonContent);
					break;

				case Command.setViewNode:
					result = ViewHandler.setViewNode(state, command.jsonContent);
					break;

				case Command.notifyFinishedView:
					result = ViewHandler.notifyFinishedView(state, command.jsonContent);
					break;

				case Command.setSequence:
					result = AnimationHandler.setSequence(state, command.jsonContent);
					break;

				case Command.setTrack:
					result = AnimationHandler.setTrack(state, command.jsonContent);
					break;

				case Command.setViewGroup:
					result = ViewHandler.setViewGroup(state, command.jsonContent);
					break;

				default:
					// console.log('"' + command.name + '"- Not Implemented');
					skipped = true;

					break;
			}

			var commandNameToHandle = command.name;
			if (result && result.error && commandNameToHandle !== Command.notifyError) {
				// error can happen within command.
				// we have to notify these errors too
				var errorCallback = callbackMap.get(Command.notifyError);
				if (errorCallback) {
					errorCallback(result);
				}
			}

			var callback = callbackMap.get(commandNameToHandle);
			if (callback) {
				callback(result);
			}

			if (skipped) {
				numCommandSkipped++;
			}

			return result;
		};

		this.getNumberOfCommandsSkipped = function() {
			return numCommandSkipped;
		};

	};

	return Processor;

});
