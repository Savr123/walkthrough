sap.ui.define([
	"./TotaraUtils"
], function(TotaraUtils) {
	"use strict";

	var AnimationHandler = function() {};

	AnimationHandler.setPlayback = function(state, command) {
		if (TotaraUtils.checkError(command)) {
			return command;
		}

		var result = {};

		var sceneId = state.viewIdSceneIdMap.get(command.viewId);
		var context = state.getContext(sceneId);

		var view = state.sceneBuilder.getView(command.viewId, command.sceneId);
		result.view = view;

		if (!sceneId) {
			command.error = "Try to extract play backs for unmatching scene";
			return command;
		}

		var ai, playback;
		if (context.playbackIds) {
			for (ai = 0; ai < command.playbacks.length; ai++){
				playback = command.playbacks[ai];
				for (var aii = 0; aii < context.playbackIds.length; aii++) {
					if (playback.id === context.playbackIds[aii]) {
						playback.notLoading = false;
						break;
					}
				}
				if (playback.notLoading === undefined) {
					playback.notLoading = true;
				}
			}
			delete context.playbackIds;
			result.onlyLoadingPlaybacks = true;
		}

		var sequenceIdSet = new Set();
		for (ai = 0; ai < command.playbacks.length; ai++){
			playback = command.playbacks[ai];

			if (playback.notLoading) {
				continue;
			}

			if (playback.id == null) {
				// This is the case when whole playback is sent inline, there are no playbacks, sequences or tracks ids
				// Usually happens with temporary playbacks. Setting initial positions of objects is typical use case
				// We'll create ids here so that scene builder code treats them like any other playback or sequence
				playback.id = command.viewId + "-playback";
				playback.sequence.id = command.viewId + "-cont";
				playback.sequenceId = playback.sequence.id;
				AnimationHandler.setSequence(state, { sequences: [ playback.sequence ] });
			}
			state.sceneBuilder.insertPlayback(playback, command.viewId, sceneId);
			if (playback.sequenceId) {
				var existingSequence = state.sceneBuilder.getSequence(playback.sequenceId);
				if (existingSequence) {
					// Already received, don't ask for it again
					continue;
				} else {
					// Send it to the queue, to be requested
					sequenceIdSet.add(playback.sequenceId);
					state.sequenceIds.add(playback.sequenceId);
				}
			}
		}

		result.sequenceIdSet = sequenceIdSet;
		result.viewId = command.viewId;
		state.currentViewId = result.viewId;
		return result;
	};

	AnimationHandler.setSequence = function(state, command) {
		if (TotaraUtils.checkError(command)) {
			return command;
		}

		var result = {};
		var trackIdSet = new Set();
		for (var si = 0; si < command.sequences.length; si++){
			var sequence = command.sequences[si];
			if (sequence.nodes) {
				var nodes = [];
				var inlineTracks = [];
				for (var nj = 0; nj < sequence.nodes.length; nj++){
					var seqNode = sequence.nodes[nj];
					if (seqNode.rotate) {
						var rotateNode = {};

						if (seqNode.rotate.trackId) {
							rotateNode.trackId = seqNode.rotate.trackId;
							trackIdSet.add(seqNode.rotate.trackId);
							state.trackIds.add(seqNode.rotate.trackId);

						} else {
							rotateNode.trackId = sequence.id + "ROTATE" + seqNode.sid;
							seqNode.rotate.id = rotateNode.trackId;
							inlineTracks.push(seqNode.rotate);
						}

						rotateNode.sid = seqNode.sid;
						rotateNode.binding = "ROTATE";
						if (seqNode.rotate.pivot) {
							rotateNode.pivot = seqNode.rotate.pivot;
						}
						nodes.push(rotateNode);
					}

					if (seqNode.translate) {
						var translateNode = {};

						if (seqNode.translate.trackId) {
							translateNode.trackId = seqNode.translate.trackId;
							trackIdSet.add(seqNode.translate.trackId);
							state.trackIds.add(seqNode.translate.trackId);

						} else {
							translateNode.trackId = sequence.id + "TRANSLATE" + seqNode.sid;
							seqNode.translate.id = translateNode.trackId;
							inlineTracks.push(seqNode.translate);
						}

						translateNode.sid = seqNode.sid;
						translateNode.binding = "TRANSLATE";
						if (seqNode.translate.pivot) {
							translateNode.pivot = seqNode.translate.pivot;
						}
						nodes.push(translateNode);
					}

					if (seqNode.scale) {
						var scaleNode = {};

						if (seqNode.scale.trackId) {
							scaleNode.trackId = seqNode.scale.trackId;
							trackIdSet.add(seqNode.scale.trackId);
							state.trackIds.add(seqNode.scale.trackId);

						} else {
							scaleNode.trackId = sequence.id + "SCALE" + seqNode.sid;
							seqNode.scale.id = scaleNode.trackId;
							inlineTracks.push(seqNode.scale);
						}

						scaleNode.sid = seqNode.sid;
						scaleNode.binding = "SCALE";
						if (seqNode.scale.pivot) {
							scaleNode.pivot = seqNode.scale.pivot;
						}
						nodes.push(scaleNode);
					}

					if (seqNode.opacity) {
						var opacityNode = {};

						if (seqNode.opacity.trackId) {
							opacityNode.trackId = seqNode.opacity.trackId;
							trackIdSet.add(seqNode.opacity.trackId);
							state.trackIds.add(seqNode.opacity.trackId);

						} else {
							opacityNode.trackId = sequence.id + "OPACITY" + seqNode.sid;
							seqNode.opacity.id = opacityNode.trackId;
							inlineTracks.push(seqNode.opacity);
						}

						opacityNode.sid = seqNode.sid;
						opacityNode.binding = "OPACITY";
						nodes.push(opacityNode);
					}
				}
				if (inlineTracks.length > 0) {
					this.setTrack(state, { tracks: inlineTracks });
				}
				sequence.nodes = nodes;
			}
			state.sceneBuilder.insertSequence(sequence);
			state.sequenceIds.delete(sequence.id);
		}

		result.trackIdSet = trackIdSet;
		return result;
	};

	AnimationHandler._convertTrack = function(track) {
		track.times = track.time;
		if (track.vector3) {
			track.values = track.vector3;
		} else if (track.quaternion) {
			track.values = track.quaternion;
			track.rotateType = "quaternion";
			// to be consistent with quaternion defined in three.js
			for (var vi = 3; vi < track.values.length; vi = vi + 4) {
				track.values[vi] = -track.values[vi];
			}
		} else if (track.angleAxis) {
			track.values = track.angleAxis;
			track.rotateType = "angleAxis";
		} else if (track.euler) {
			track.values = track.euler;
			track.rotateType = "euler";
		} else if (track.scalar) {
			track.values = track.scalar;
		}
		track.cyclicInfo = {};
		track.cyclicInfo.cyclicStart = track.cyclicStart;
		track.cyclicInfo.cyclicEnd = track.cyclicEnd;
	};

	AnimationHandler.setTrack = function(state, command) {
		if (TotaraUtils.checkError(command)) {
			return command;
		}
		var result = {};

		var tracks = [];
		for (var ti = 0; ti < command.tracks.length; ti++) {
			var track = command.tracks[ti];
			this._convertTrack(track);
			tracks.push(track);
			state.trackIds.delete(track.id);
		}

		state.sceneBuilder.insertTracks(tracks);

		return result;
	};

	AnimationHandler.setHighlightStyle = function(state, command) {
		if (TotaraUtils.checkError(command)) {
			return command;
		}

		var result = {};

		state.sceneBuilder.insertHighlightStyle(command);
		state.highlightStyleIds.delete(command.id);

		result.id = command.id;

		return result;
	};

	return AnimationHandler;
});