/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./thirdparty/three","../NS","./BBoxSubdivider","./UsageCounter","../totara/ListMap","./OrthographicCamera","./PerspectiveCamera","./AnimationHelper","../View","./Billboard","./Callout","../BillboardCoordinateSpace","../BillboardTextEncoding","../BillboardStyle","../BillboardBorderLineStyle","../LeaderLineMarkStyle","./AnimationSequence","../AnimationPlayback","./Material","../ObjectType"],function(q,t,N,B,U,L,O,P,A,V,a,C,b,c,d,f,g,h,j,M,k){"use strict";var S=function(e){this._id=S._nextId++;S._add(this);this._submeshes=new Map();this._callouts=new Map();this._cameras=new Map();this._images=new Map();this._geometries=new Map();if(e){this._rootNode=e;this._nodes=new Map();this._NodeMeshIdSubmeshIdsMap=new Map();this._tracks=new Map();this._trackIdSequenceNodeMap=new L();this._viewGroups=new Map();this._views=new Map();}else{this._rootNode=null;this._nodes=null;this._NodeMeshIdSubmeshIdsMap=null;this._tracks=null;this._trackIdSequenceNodeMap=null;this._viewGroups=null;this._views=null;}this._currentSceneId=null;this._sceneIdTreeNodesMap=new Map();this._sceneIdRootNodeMap=new Map();this._sceneIdNodeMeshIdMap=new Map();this._sceneIdViewGroupMap=new Map();this._sceneIdViewMap=new Map();this._highlightStyles=new Map();this._animationHelper=new A(this);};S._nextId=1;S._map=new Map();S.prototype.getId=function(){return this._id;};S._add=function(e){S._map.set(e.getId(),e);return this;};S.prototype.setRootNode=function(e,i,l,v){this._rootNode=e;this._nodes=new Map();this._nodes.set(i,e);this._NodeMeshIdSubmeshIdsMap=new Map();if(!this._rootNode.userData){this._rootNode.userData={};}this._tracks=new Map();this._trackIdSequenceNodeMap=new L();this._viewGroups=new Map();this._views=new Map();if(l){this._sceneIdTreeNodesMap.set(l,this._nodes);this._sceneIdRootNodeMap.set(l,e);this._sceneIdNodeMeshIdMap.set(l,this._NodeMeshIdSubmeshIdsMap);this._sceneIdViewGroupMap.set(l,this._viewGroups);this._sceneIdViewMap.set(l,this._views);this._currentSceneId=l;}if(v){this._vkScene=v;}return this;};S.prototype._resetCurrentScene=function(e){if(e&&e!==this._currentSceneId){var i=this._sceneIdTreeNodesMap.get(e);if(i){this._nodes=i;}else{this._nodes=null;}var l=this._sceneIdRootNodeMap.get(e);if(l){this._rootNode=l;}else{this._rootNode=null;}this._currentSceneId=e;}};S.prototype.getNode=function(e,i){this._resetCurrentScene(i);if(!this._nodes){return null;}return this._nodes.get(e);};S.prototype.getObjectId=function(e){do{if(e.userData&&e.userData.treeNode&&e.userData.treeNode.sid){return e.userData.treeNode.sid;}e=e.parent;}while(e);return null;};var m=function(e){var i=new THREE.Matrix4();if(e.length===3){i.setPosition(new THREE.Vector3().fromArray(e));}else if(e.length===12){i.set(e[0],e[3],e[6],e[9],e[1],e[4],e[7],e[10],e[2],e[5],e[8],e[11],0.0,0.0,0.0,1.0);}else if(e.length===16){i.set(e[0],e[4],e[8],e[12],e[1],e[5],e[9],e[13],e[2],e[6],e[10],e[14],e[3],e[7],e[11],e[15]);}else{throw"Invalid matrix format";}return i;};var D={r:0.0235,g:0.0235,b:0.0235};var n={r:0.0602,g:0.0602,b:0.0602};S.prototype._createTemporaryMaterial=function(e){var i=new THREE.MeshPhongMaterial({color:0xaaaaaa});if(!i.userData){i.userData={};}i.userData.defaultHighlightingEmissive=D;i.userData.defaultHighlightingSpecular=n;i.userData.materialUsed=0;i.userData.materialId=e;i.userData.toBeUpdated=true;var v=new M();v.setMaterialRef(i);this._vkScene.setMaterial(e,v);return i;};S.prototype._getMaterialRef=function(e){var i=this._vkScene.getMaterial(e);var l;if(i){l=i.getMaterialRef();}return l;};S.prototype._addDynamicObject=function(e,i){if(!this._rootNode.userData._vkDynamicObjects){this._rootNode.userData._vkDynamicObjects=[];}this._rootNode.userData._vkDynamicObjects.push(e);e._vkUpdate=i;};S.prototype._setType=function(e){if(e.userData.treeNode){if(e.userData.treeNode.contentType==="HOTSPOT"){e.userData.objectType=k.Hotspot;}else if(e.userData.treeNode.contentType==="PMI"){e.userData.objectType=k.PMI;}}if(e.parent){if(e.parent.userData.objectType===k.Hotspot){e.userData.objectType=k.Hotspot;}else if(e.parent.userData.objectType===k.PMI){e.userData.objectType=k.PMI;}}};S.prototype.createNode=function(e,i,l){var v={needUpdateMaterial:false,needSetSubmesh:false,idOfGeometriesToUpdate:null,materialIds:[]};this._resetCurrentScene(l);var G=this._nodes.get(i)||null;var H=new THREE.Group();H.userData.treeNode=e;if(e.renderOrder){H.renderOrder=e.renderOrder;}H.visible=e.visible!==undefined?e.visible:true;if(e.name){H.name=e.name;}H.userData.opacity=e.opacity;if(e.transform){H.applyMatrix(m(e.transform));}if(e.transformType){H.userData.transformType=e.transformType;switch(e.transformType){case"BILLBOARD_VIEW":this._addDynamicObject(H,a.prototype._billboardViewUpdate);break;case"LOCK_TOVIEWPORT":this._addDynamicObject(H,a.prototype._lockToViewportUpdate);break;default:break;}}(G||this._rootNode).add(H);this._nodes.set(e.sid,H);var I=this.attachSubMeshesToNode(e.sid,l);var J=this.applyNodeMaterialToSubmeshes(e.sid,l);var K=this.applyNodeOpacityToSubmeshes(e.sid,l);v.needUpdateMaterial=J.needUpdateMaterial;v.needSetSubmesh=I.needSetSubmesh;v.idOfGeometriesToUpdate=I.idOfGeometriesToUpdate;v.materialIds=K.materialIds;this._setType(H);return v;};S.prototype.applyNodeMaterialToSubmeshes=function(e,l){var v={needUpdateMaterial:false};this._resetCurrentScene(l);var G=this._nodes.get(e);if(!G){return v;}var H=G.userData.treeNode;G.userData.materialId=H.materialId;if(!H.meshId||!G.userData.materialId){return v;}var I=this._getMaterialRef(G.userData.materialId);if(!I){I=this._createTemporaryMaterial(G.userData.materialId);v.needUpdateMaterial=true;}if(G&&G.children){for(var i=0;i<G.children.length;i++){var J=G.children[i];J.material=I;J.userData.materialId=G.userData.materialId;U.increaseMaterialUsed(I);}}return v;};S.prototype.applyNodeOpacityToSubmeshes=function(e,l,G){var H={materialIds:[]};this._resetCurrentScene(l);var I=this._nodes.get(e);if(!I){return H;}var J=I.userData.treeNode;if(!J.meshId||!J.opacity){return H;}if(I&&I.children){I.userData.opacity=J.opacity;var K=new Set();for(var i=0;i<I.children.length;i++){var Q=I.children[i];if(Q.material&&(!G||G===Q.material.userData.materialId)){if(!Q.material.userData.toBeUpdated){Q.userData.opacity=J.opacity;Q.userData.originalMaterial=Q.material;Q.material=Q.material.clone();Q.material.opacity*=Q.userData.opacity;Q.material.transparent=Q.material.opacity<0.99;}else{K.add(Q.material.userData.materialId);}}}K.forEach(function(v){H.materialIds.push(v);});}return H;};S.prototype.attachSubMeshesToNode=function(e,l){var v={needSetSubmesh:false,idOfGeometriesToUpdate:new Set()};this._resetCurrentScene(l);var G=this._nodes.get(e);var H=G.userData.treeNode;if(!H.meshId){return v;}var I=this._NodeMeshIdSubmeshIdsMap.get(H.meshId);if(!I){v.needSetSubmesh=true;return v;}var J=[];I.forEach(function(R){J.push(R);});var i;var K;for(i=0;i<J.length;i++){K=J[i];this._insertSubmesh(H.sid,K,l);}for(i=0;i<J.length;i++){K=J[i];var Q=this._submeshes.get(K);if(Q&&Q.userData&&Q.userData.isBoundingBox&&Q.userData.geometryId){v.idOfGeometriesToUpdate.add(Q.userData.geometryId);}}return v;};S.prototype.updateMaterialInNode=function(e,l){this._resetCurrentScene(l);var v={needUpdateMaterial:false,nodeUpdated:false};var G=this._nodes.get(e.sid);var H=G.userData.materialId;var I=G.userData.opacity;G.userData.treeNode=e;G.userData.materialId=e.materialId;G.userData.opacity=e.opacity;var J=false;if(H===undefined){if(G.userData.materialId!==undefined){J=true;}}else if(H!==G.userData.materialId){J=true;}var K=false;if(I===undefined){if(G.userData.opacity!==undefined){K=true;}}else if(I!==G.userData.opacity){K=true;}if(!J&&!K){return v;}v.nodeUpdated=true;var Q=null;if(G.userData.materialId){Q=this._getMaterialRef(G.userData.materialId);if(Q===undefined){Q=this._createTemporaryMaterial(G.userData.materialId);v.needUpdateMaterial=true;}}if(G&&G.children){for(var i=0;i<G.children.length;i++){var R=G.children[i];if(Q){R.material=Q;R.userData.materialId=e.materialId;U.increaseMaterialUsed(Q);}else{var T=this._getMaterialRef(R.userData.initialMaterialId);R.material=T;R.userData.materialId=R.userData.initialMaterialId;U.increaseMaterialUsed(T);}delete R.userData.originalMaterial;if(G.userData.opacity!==undefined&&(R.material&&R.material.userData&&!R.material.userData.toBeUpdated)){R.userData.opacity=G.userData.opacity;R.userData.originalMaterial=R.material;R.material=R.material.clone();R.material.opacity*=R.userData.opacity;R.material.transparent=R.material.opacity<0.99;}else{R.userData.opacity=undefined;}}}return v;};S.prototype.updateGeometryInNode=function(e,l,v){this._resetCurrentScene(v);var G=this._nodes.get(e);if(G&&G.children){for(var i=0;i<G.children.length;i++){var H=G.children[i];if(!H.isMesh){continue;}if(H.userData.geometryId===l){var I=this._geometries.get(l);if(I){if(I.isPolyline&&!H.isLineSegment){var J=H.parent;var K=H.material;J.remove(H);var Q=new THREE.LineBasicMaterial({color:0xff0000,linewidth:1});Q.color.copy(K.color);var R=new THREE.LineSegments(I,Q);J.add(R);this._setType(R);R.userData.meshId=H.userData.meshId;if(I.isPositionQuantized){R.position.copy(H.position);R.scale.copy(H.scale);}R.userData.initialMaterialId=H.userData.initialMaterialId;R.userData.isBoundingBox=false;R.userData.geometryId=H.userData.geometryId;R.userData.meshId=H.userData.meshId;R.userData.materialId=H.userData.materialId;R.userData.submeshInfo=H.userData.submeshInfo;R.userData.submeshId=H.userData.submeshId;var T=this._submeshes.get(R.userData.submeshId);if(T&&T.renderOrder){R.renderOrder=T.renderOrder;}this._submeshes.set(R.userData.submeshId,R);}else{H.geometry=I;H.userData.isBoundingBox=false;if(!I.isPositionQuantized){H.position.set(0,0,0);H.scale.set(1,1,1);}}U.increaseGeometryUsed(I);}}}}return this;};S.prototype.getChildNodeIds=function(e,l,v){this._resetCurrentScene(l);var G=this._nodes.get(e);var H=[];if(!G){return H;}if(G&&G.children){for(var i=0;i<G.children.length;i++){var I=G.children[i];if(I.userData&&I.userData&&I.userData.treeNode&&I.userData.treeNode.sid){H.push(I.userData.treeNode.sid);}else if(v&&I.userData&&I.userData.submeshInfo&&I.userData.submeshInfo.id){H.push(I.userData.submeshInfo.id);}}}return H;};function o(e){var l=atob(e);var v=l.length;var G=new Uint8Array(v);for(var i=0;i<v;i++){G[i]=l.charCodeAt(i);}return G;}function p(l){if(l){for(var i=0;i<l.length;i++){if(l[i].type==="box"&&l[i].data){return l[i];}}}return null;}function r(v){if(v===0){return Number.EPSILON;}return v;}function u(e,i){e.position.set((i[3]+i[0])/2,(i[4]+i[1])/2,(i[5]+i[2])/2);e.scale.set(r(i[3]-i[0]),r(i[4]-i[1]),r(i[5]-i[2]));}S.prototype.setSubmesh=function(l,v){var G={needUpdateMaterial:false,geometryIdToRequest:null,geometryPriority:0};var H=this._NodeMeshIdSubmeshIdsMap.get(l);if(!H){H=new Set();this._NodeMeshIdSubmeshIdsMap.set(l,H);}H.add(v.id);if(!v.lods){return false;}var I=null;for(var i=0;i<v.lods.length;i++){if(v.lods[i].type===undefined||v.lods[i].type==="mesh"||v.lods[i].type==="line"){I=v.lods[i];}}if(!I){return false;}var J=null;if(v.materialId){J=this._getMaterialRef(v.materialId);if(!J){J=this._createTemporaryMaterial(v.materialId);G.needUpdateMaterial=true;}}var K=null;var Q=this._geometries.get(I.id);if(Q){if(Q.isPolyline){var R=new THREE.LineBasicMaterial({color:0xff0000,linewidth:1});if(J){R.color.copy(J.color);}K=new THREE.LineSegments(Q,R);}else if(J){K=new THREE.Mesh(Q,J);}else{K=new THREE.Mesh(Q);}K.userData.initialMaterialId=v.materialId;K.userData.isBoundingBox=false;K.userData.geometryId=I.id;K.userData.meshId=l;K.userData.submeshId=v.id;K.userData.materialId=v.materialId;if(Q.userData&&Q.userData.noNormal&&v.materialId){this.updateMaterialForGeometryWithoutNormal(v.materialId);}if(Q.isPositionQuantized){u(K,I.boundingBox);}U.increaseGeometryUsed(Q);}else{G.geometryIdToRequest=I.id;var T;try{var W=p(v.lods);if(W&&W.data){var X=o(W.data);var Y=B.unpackSubDividedBoundingBox(X);T=B.makeSubDividedBoundingBoxGeometry(Y);}}catch(e){}var Z=new THREE.BoxBufferGeometry(1,1,1);K=new THREE.Mesh(T?T:Z,J);var $=I.boundingBox;if(Array.isArray($)&&$.length===6){G.geometryPriority=new THREE.Vector3($[3]-$[0],$[4]-$[1],$[5]-$[2]).length();}else{$=[0,0,0,1,1,1];}u(K,$);K.userData.initialMaterialId=v.materialId;K.userData.isBoundingBox=true;K.userData.geometryId=I.id;K.userData.meshId=l;K.userData.materialId=v.materialId;K.userData.submeshId=v.id;}K.userData.submeshInfo=v;this._submeshes.set(v.id,K);return G;};S.prototype.getSubmesh=function(e){return this._submeshes.get(e);};S.prototype.setGeometry=function(e){if(e.error){return this;}var i=new THREE.BufferGeometry();var l=new THREE.BufferAttribute(new Uint16Array(e.data.indices),1);var v=new THREE.BufferAttribute(new Float32Array(e.data.points),3);i.setIndex(l);i.addAttribute("position",v);if(!i.userData){i.userData={};}if(!e.isPolyline){if(e.data.normals.length===e.data.points.length){var G=new THREE.BufferAttribute(new Float32Array(e.data.normals),3);i.addAttribute("normal",G);}else{i.userData.noNormal=true;}if(e.data.uvs&&e.data.uvs.length*3===e.data.points.length*2){i.addAttribute("uv",new THREE.BufferAttribute(new Float32Array(e.data.uvs),2));}}else{i.isPolyline=true;}try{i.computeBoundingSphere();}catch(H){return this;}i.isPositionQuantized=e.isPositionQuantized;i.userData.geometryId=e.id;i.userData.geometryUsed=0;this._geometries.set(e.id,i);return this;};S.prototype.getGeometry=function(e){return this._geometries.get(e);};S.prototype._insertSubmesh=function(e,i,l){this._resetCurrentScene(l);var v=this._nodes.get(e);var G=this._submeshes.get(i);if(!v||!G){return false;}if(G.parent){G=G.clone();if(G.userData){if(G.userData.submeshInfo&&G.userData.initialMaterialId){var H=this._getMaterialRef(G.userData.initialMaterialId);if(H){G.material=H;U.increaseMaterialUsed(H);}}if(G.userData&&G.userData.opacity){delete G.userData.opacity;}}}v.add(G);this._setType(G);return true;};var s=[d.RectangularShape,d.CircularShape,d.None,d.TextGlow];var w=[b.Viewport,b.Screen,b.World];var x=[f.None,f.Solid,f.Dash,f.Dot,f.DashDot,f.DashDotDot];var y=[g.None,g.Point,g.Arrow];function z(e){var i=(((e[0]*255)<<16)|((e[1]*255)<<8)|(e[2]*255)).toString(16);return"#"+"000000".substring(i.length)+i;}S.prototype.createAnnotation=function(e,i,l){this._resetCurrentScene(e);var v=this._nodes.get(i);var G=l.position;l.coordinateSpace|=0;var H={node:v,coordinateSpace:w[l.coordinateSpace],style:s[l.shape||0],width:l.width,height:l.height,backgroundColor:l.backgroundColour?z(l.backgroundColour):"#fff",backgroundOpacity:l.backgroundColour?l.backgroundColour[3]:0,borderColor:l.borderColour?z(l.borderColour):"#000",borderOpacity:l.borderColour?l.borderColour[3]:0,borderWidth:l.borderWidth,borderLineStyle:x[l.borderLineStyle]};if(l.fontFace){H.encoding=c.PlainText;H.font=l.fontFace;H.fontSize=Math.abs(l.fontSize);H.fontWeight=Math.min(l.fontWeight,900);H.textColor=z(l.textColour);}else{H.encoding=c.HtmlText;}if(l.coordinateSpace<2){H.position=new THREE.Vector3(G[0]*2-1,G[1]*-2+1,G[2]);H.renderOrder=(l.order|0)+1000;var I=new a(H);I.setText(l.text);this._addDynamicObject(v,I._update.bind(I));}else{H.anchorNode=this._nodes.get(l.sid);H.position=new THREE.Vector3().fromArray(G);H.depthTest=false;H.renderOrder=l.order|0;var J=new C(H);J.setText(l.text);this._callouts.set(l.id,J);this._addDynamicObject(v,J._update.bind(J));}};S.prototype.createImageNote=function(e,i,l,v){this._resetCurrentScene(e);var G=this._nodes.get(i);G.updateMatrix();var H=new THREE.Vector3().fromArray(l.position);H.x+=l.width*0.5;H.y+=l.height*0.5;H.applyMatrix4(G.matrix);var I=new a({node:G,coordinateSpace:b.Screen,renderOrder:(l.order|0)+1000,position:H,width:l.width*0.5*G.matrix.elements[0],height:l.height*0.5*G.matrix.elements[5]});I.setMaterial(v);this._addDynamicObject(G,I._update.bind(I));};S.prototype.insertLeaderLine=function(e,v,G){var H=this._callouts.get(v);if(H){var I=[];for(var i=0,l=G.points.length;i<l;i++){I.push(new THREE.Vector3().fromArray(G.points[i]));}var J=this._nodes.get(G.startPointSid);H.addLeaderLine(I,J,G.material,y[G.startPointHeadStyle],y[G.endPointHeadStyle],G.pointHeadConstant,G.extensionLength);}};S.prototype._decrementResourceCounters=function(e){e.traverse(function(i){if(i.isMesh){U.decreaseMaterialUsed(i.material);U.decreaseGeometryUsed(i.geometry);}});};S.prototype.decrementResourceCountersForDeletedTreeNode=function(e,i){this._resetCurrentScene(i);var l=this;e=[].concat(e);e.forEach(function(v){var G=l._nodes.get(v);if(G){l._decrementResourceCounters(G);l._nodes.delete(v);}});return this;};S.prototype.remove=function(e,l){this._resetCurrentScene(l);var v=this;e=[].concat(e);e.forEach(function(G){var H=v._nodes.get(G);if(H){v._decrementResourceCounters(H);if(H.parent){H.parent.remove(H);}v._nodes.delete(G);for(var i=0;i<H.children.length;i++){var I=H.children[i];if(I.userData&&I.userData.treeNode&&I.userData.treeNode.sid){v.remove(I.userData.treeNode.sid,l);}}}});return this;};S.prototype.resourcesCleanUp=function(){var e=this._geometries;e.forEach(function(i){var l=i.userData.geometryUsed;if(l<=0){i.dispose();}});return this;};S.prototype.createCamera=function(e,i){this._resetCurrentScene(i);var l;if(e.ortho){l=new THREE.OrthographicCamera(-1,1,1,-1,e.near,e.far);}else{l=new THREE.PerspectiveCamera(e.fov*180/Math.PI,1,e.near,e.far);}if(e.origin){var v=new THREE.Vector3().fromArray(e.origin);l.position.copy(v);}if(e.up){var G=new THREE.Vector3().fromArray(e.up).normalize();l.up.copy(G);}if(e.target){l.lookAt((new THREE.Vector3().fromArray(e.target)).add(l.position));}if(e.ortho){l.zoom=e.zoom||0.02;}this._rootNode.userData.camera=l;var H=null;if(l.isOrthographicCamera){H=new O();}else if(l.isPerspectiveCamera){H=new P();}H.setCameraRef(l);H.setUsingDefaultClipPlanes(true);if(e.zoom===-1){H.setZoomNeedRecalculate(true);}H.cameraInfo=e;var I=e.id;if(I){this._cameras.set(I,H);}return H;};S.prototype.insertCamera=function(e,i,l){this._resetCurrentScene(l);var v=this._nodes.get(e);var G=this._cameras.get(i);if(v&&G){v.add(G.parent?G.clone():G);}return this;};S.prototype.getCamera=function(e){return this._cameras.get(e);};S.prototype.updateMaterialForGeometryWithoutNormal=function(e){var i=this._getMaterialRef(e);if(i&&i.emissive){i.emissive.copy(i.color);i.side=THREE.DoubleSide;}return this;};S.prototype.createMaterial=function(e){var i=[];var l=this._getMaterialRef(e.id);if(e.lineWidth>0){if(!l||!l.isLineBasicMaterial){l=new THREE.LineBasicMaterial();var v=new M(true);v.setMaterialRef(l);this._vkScene.setMaterial(e.id,v);}l.color=new THREE.Color(e.lineColour[0],e.lineColour[1],e.lineColour[2]);l.linewidth=e.lineWidth;l.userData.lineStyle={width:e.lineWidth,haloWidth:e.lineHaloWidth||0,endCapStyle:e.lineEndRound?1:0,dashPattern:e.lineDashPattern||[],dashPatternScale:e.lineDashPatternScale};l.userData.materialInfo=e;l.userData.materialId=e.id;return i;}if(!l){l=this._createTemporaryMaterial(e.id);}if(l.userData&&l.userData.toBeUpdated){delete l.userData.toBeUpdated;}l.userData.materialInfo=e;if(e.diffuseColour){l.color.fromArray(e.diffuseColour);}if(e.specularColour){l.specular.fromArray(e.specularColour);}var G=true;if(e.emissiveColour){l.emissive.fromArray(e.emissiveColour);if(l.emissive.r!==0||l.emissive.g!==0||l.emissive.b!==0){G=false;}}if(G&&e.ambientColour){l.emissive.fromArray(e.ambientColour);l.emissive.multiplyScalar(0.2);}if(l.opacity!==undefined){l.opacity=e.opacity;l.transparent=e.opacity<1;if(l.transparent){l.side=THREE.DoubleSide;}}var H=l.glossiness?l.glossiness:0;var I=l.specularLevel?l.specularLevel:0;l.shininess=H*2+I*3;l.userData.defaultHighlightingEmissive=D;l.userData.defaultHighlightingSpecular=n;i=this.updateTextureMaps(e.id);return i;};S.prototype.getMaterial=function(e){return this._getMaterialRef(e);};var E=function(i){var l="";try{var v=0x8000;var G=0;var H=i.length;var I;while(G<H){I=i.slice(G,Math.min(G+v,H));l+=String.fromCharCode.apply(null,I);G+=v;}}catch(e){l="";}return l;};S.prototype.createImage=function(i){var e=new DataView(i.binaryData.buffer);var l=true;if(e.getUint8(0,true)===parseInt("0xFF",16)&&e.getUint8(1,true)===parseInt("0xD8",16)){l=false;}var v=E(i.binaryData);var G="data:image/"+(l?"png":"jpeg")+";base64,"+btoa(v);this._images.set(i.id,G);return this;};var F=new THREE.TextureLoader();S.TextureType={Diffuse:0,Bump:1,Opacity:2,Reflection:3,Refraction:4,Specular:5,Ambient:6,Emissive:7,SpecularLevel:8,Glosiness:9,AmbientOcclusion:10,Decal:11};S.prototype.updateTextureMaps=function(e){var i=[];var l=this._getMaterialRef(e);if(!l){return i;}var v=l.userData.materialInfo;if(!v){return i;}if(v.textureDiffuse){var G=this.updateTextureMap(v.id,S.TextureType.Diffuse);if(G.imageId){i.push(G);}}if(v.textureBump){var H=this.updateTextureMap(v.id,S.TextureType.Bump);if(H.imageId){i.push(H);}}if(v.textureOpacity){var I=this.updateTextureMap(v.id,S.TextureType.Opacity);if(I.imageId){i.push(I);}}if(v.textureEmissive){var J=this.updateTextureMap(v.id,S.TextureType.Emissive);if(J.imageId){i.push(J);}}if(v.textureAmbientOcclusion){var K=this.updateTextureMap(v.id,S.TextureType.AmbientOcclusion);if(K.imageId){i.push(K);}}if(v.textureReflection){var Q=this.updateTextureMap(v.id,S.TextureType.Reflection);if(Q.imageId){i.push(Q);}}return i;};S.prototype.updateTextureMap=function(e,i){var l={textureType:i,imageId:null};var v=this._getMaterialRef(e);if(!v){return l;}var G=v.userData.materialInfo;if(!G){return l;}var H=null;switch(i){case S.TextureType.Diffuse:H=G.textureDiffuse;break;case S.TextureType.Bump:H=G.textureBump;break;case S.TextureType.Opacity:H=G.textureOpacity;break;case S.TextureType.Reflection:H=G.textureReflection;break;case S.TextureType.Emissive:H=G.textureEmissive;break;case S.TextureType.AmbientOcclusion:H=G.textureAmbientOcclusion;break;default:break;}if(!H){return l;}var I=H[0];var J=this._images.get(I.imageId);if(!J){l.imageId=I.imageId;return l;}var K=F.load(J);K.wrapS=I.uvHorizontalTilingEnabled?THREE.RepeatWrapping:THREE.ClampToEdgeWrapping;K.wrapT=I.uvVerticalTilingEnabled?THREE.RepeatWrapping:THREE.ClampToEdgeWrapping;K.magFilter=I.filterMode===1?THREE.NearestFilter:THREE.LinearFilter;K.minFilter=I.filterMode===1?THREE.NearestFilter:THREE.LinearMipMapLinearFilter;K.anisotropy=4;var Q=I.influence!==undefined?I.influence:0;var R=I.uvHorizontalScale!==undefined?I.uvHorizontalScale:1;var T=I.uvVerticalScale!==undefined?I.uvVerticalScale:1;var W=I.uvHorizontalOffset!==undefined?I.uvHorizontalOffset:0;var X=I.uvVerticalOffset!==undefined?I.uvVerticalOffset:0;K.repeat.set(R,T);K.center.set(-W,-X);K.offset.set(W,X);K.rotation=-I.uvRotationAngle;switch(i){case S.TextureType.Diffuse:v.map=K;v.transparent|=J.startsWith("data:image/png");break;case S.TextureType.Bump:v.bumpMap=K;v.bumpScale=Q;break;case S.TextureType.Opacity:v.alphaMap=K;break;case S.TextureType.Reflection:K.mapping=THREE.SphericalReflectionMapping;v.envMap=K;v.combine=THREE.AddOperation;v.reflectivity=Q;break;case S.TextureType.Emissive:v.emissiveMap=K;v.emissive.setRGB(1,1,1);break;case S.TextureType.AmbientOcclusion:v.aoMap=K;break;default:}v.userData.textureAdded=true;v.needsUpdate=true;return l;};S.prototype.insertPlayback=function(e,v,i){this._resetCurrentScene(i);var l=new j({pid:e.id,sequenceId:e.sequenceId,timeScale:e.speed?e.speed:1,preDelay:e.preDelay?e.preDelay:0,postDelay:e.postDelay?e.postDelay:0,repeat:e.repeat?Math.abs(e.repeat):0,reversed:e.reversed?true:false,startTime:e.start?e.start:0});var G=this._views.get(v);if(G){var H=G.getPlaybacks();if(!H){H=[];}H.push(l);G.setPlaybacks(H);}return this;};S.prototype.insertSequence=function(i){var e;if(i.endTime){e=i.endTime;}else{e=1.0;}this._vkScene.createAnimationSequence(i.id,i.name,e);if(i.nodes&&i.nodes.length>0){for(var l=0;l<i.nodes.length;l++){var v=i.nodes[l];var G=this._trackIdSequenceNodeMap.getOrCreate(v.trackId);G.push({sequenceId:i.id,targetId:v.sid,type:v.binding,pivot:v.pivot});}}return this;};S.prototype.insertTracks=function(e){this._animationHelper.insertTracks(e,this._trackIdSequenceNodeMap,this._nodes,this._vkScene);return this;};S.prototype.finalizeAnimation=function(){var e=this._rootNode;if(e){while(e.parent){e=e.parent;}if(!e.userData){e.userData={};}e.userData.tracks=this._tracks;}return this;};S.prototype.finalizePlaybacks=function(){var e=this._rootNode;if(e){while(e.parent){e=e.parent;}if(!e.userData){e.userData={};}}else{return this;}if(!e.userData.animationNodeOriginalData){e.userData.animationNodeOriginalData=new Map();}var v;var i=this._viewGroups.entries();var l=i.next();while(!l.done){v=l.value[1];l=i.next();var G=[];for(var H=0;H<v.views.length;H++){if(v.views[H].id){var I=this._views.get(v.views[H].id);if(I){G.push(I);}}}}return this;};S.prototype.finalizeViewGroups=function(e){this._resetCurrentScene(e);var i=this._rootNode;if(i){while(i.parent){i=i.parent;}if(!i.userData){i.userData={};}}else{return this;}var v=[];var l=this._viewGroups.entries();var G=l.next();while(!G.done){var H=G.value[1];var I=G.value[0];if(!H||!H.views||!H.views.length){G=l.next();continue;}var J=[];for(var K=0;K<H.views.length;K++){var Q=H.views[K].id;var R=this._views.get(Q);if(R&&R.userData.viewInfo.thumbnailId&&!R.thumbnailData){var T=this._images.get(R.userData.viewInfo.thumbnailId);if(T){R.thumbnailData=T;}}if(R){R.viewGroupId=I;J.push(R);}}var W={};W.originalId=G.value[0];W.name=H.name;W.modelViews=J;W.sceneId=G.value[1].sceneId;v.push(W);G=l.next();}i.userData.viewportGroups=v;return this;};S.prototype.insertViewGroup=function(i,e){this._resetCurrentScene(e);this._viewGroups.set(i.id,i);return this;};S.prototype.getViewGroup=function(v,e){this._resetCurrentScene(e);var i=this._viewGroups.get(v);var l=[];if(i&&i.views){for(var G=0;G<i.views.length;G++){var H=i.views[G].id;var I=this._views.get(H);if(I){l.push(I);}}}return l;};S.prototype.insertView=function(v,e){this._resetCurrentScene(e);var i=new V({name:v.name,description:v.description?"<pre style=\"white-space: pre-wrap;\">"+v.description+"</pre>":v.description});i.userData={};i.userData.viewInfo=v;if(v.thumbnailId){var l=this._images.get(v.thumbnailId);if(l){i.thumbnailData=l;}}this._views.set(v.id,i);return this;};S.prototype.recordHighlightedNodeInView=function(e,i,v,l){this._resetCurrentScene(l);var G=this._views.get(v);if(!G){return this;}var H=this._nodes.get(i);if(!H){return this;}if(!G.highlightIdNodesMap){G.highlightIdNodesMap=new Map();}var I=G.highlightIdNodesMap.get(e);if(!I){I=[];}I.push(H);G.highlightIdNodesMap.set(e,I);return this;};S.prototype.insertHighlightStyle=function(i){var e=this._highlightStyles.get(i.id);if(e){return this;}e=i;this._animationHelper.addAnimationTracksToHighlight(e);this._highlightStyles.set(i.id,e);return this;};S.prototype.highlightStyleExists=function(i){var e=this._highlightStyles.get(i);return e!==undefined;};S.prototype.finalizeHighlightsInViews=function(){var v,e;var i=this._views.entries();var l=i.next();while(!l.done){v=l.value[1];e=l.value[0];l=i.next();if(v&&v.highlightIdNodesMap){v.highlights=[];var G=v.highlightIdNodesMap.entries();var H=G.next();while(!H.done){var I=H.value[1];var J=H.value[0];var K=this._highlightStyles.get(J);if(K){K.highlightNodes=I;v.highlights.push(K);}H=G.next();}this._animationHelper.processHighlights(v,e,this._vkScene);this._animationHelper.setInitialNodePositionsOnView(v,this._vkScene,true);}}var Q=this._viewGroups.entries();var R=Q.next();while(!R.done){var T=R.value[1];R=Q.next();if(!T||!T.views||!T.views.length){continue;}var W=[];for(var X=0;X<T.views.length;X++){v=this._views.get(e);if(v){W.push(v);}}if(W.length>0){this._animationHelper.setInitialNodePositionsFromSubsequentViews(W,this._vkScene,true);this._animationHelper.setInitialNodePositionsFromPreviousViews(W,this._vkScene,true);}}return this;};S.prototype.getView=function(v,e){this._resetCurrentScene(e);return this._views.get(v);};S.prototype.getSequence=function(e){return this._vkScene.getAnimationSequence(e);};S.prototype.setViewCamera=function(e,v,i){this._resetCurrentScene(i);var l=this._cameras.get(e);var G=this._views.get(v);if(l&&G){G.camera=l;var H=l.getCameraRef();if(l.cameraInfo&&H){var I=true;var J=false;if(l.cameraInfo.zoom===-1){J=true;}if(H.type==="PerspectiveCamera"){G.setCameraInfo({type:H.type,fov:l.cameraInfo.fov*180/Math.PI,position:H.position.toArray(),nearClipPlane:H.near,farClipPlane:H.far,upDirection:H.up.toArray(),targetDirection:H.getWorldDirection().toArray(),usingDefaultClipPlanes:I});}if(H.type==="OrthographicCamera"){G.setCameraInfo({type:H.type,zoomFactor:H.zoom,position:H.position.toArray(),nearClipPlane:H.near,farClipPlane:H.far,upDirection:H.up.toArray(),targetDirection:H.getWorldDirection().toArray(),usingDefaultClipPlanes:I,zoomNeedRecalculate:J});}}}return this;};S.prototype.setViewNodeInfos=function(e,v,i){this._resetCurrentScene(i);var l=this._views.get(v);l.setNodeInfos(e);return this;};S.prototype.setViewThumbnail=function(i,v,e){this._resetCurrentScene(e);var l=this._views.get(v);var G=this._images.get(i);if(l&&G){l.thumbnailData=G;}return this;};S.prototype.cleanup=function(){this._rootNode=null;if(this._nodes){this._nodes.clear();}if(this._NodeMeshIdSubmeshIdsMap){this._NodeMeshIdSubmeshIdsMap.clear();}if(this._submeshes){this._submeshes.clear();}if(this._callouts){this._callouts.clear();}if(this._cameras){this._cameras.clear();}if(this._vkScene){this._vkScene.clearMaterials();}if(this._images){this._images.clear();}if(this._geometries){this._geometries.clear();}if(this._sceneIdTreeNodesMap){this._sceneIdTreeNodesMap.clear();}if(this._sceneIdRootNodeMap){this._sceneIdRootNodeMap.clear();}if(this._sceneIdNodeMeshIdMap){this._sceneIdNodeMeshIdMap.clear();}if(this._tracks){this._tracks.clear();}if(this._trackIdSequenceNodeMap){this._trackIdSequenceNodeMap.clear();}if(this._viewGroups){this._viewGroups.clear();}if(this._views){this._views.clear();}if(this._sceneIdViewGroupMap){this._sceneIdViewGroupMap.clear();}if(this._sceneIdViewMap){this._sceneIdViewMap.clear();}if(this._highlightStyles){this._highlightStyles.clear();}this._currentSceneId=null;S._map.delete(this._id);};return S;});
