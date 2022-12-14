///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/on',
  'dojo/query',
  'dojo/Deferred',
  'dojo/promise/all',
  'jimu/BaseWidget',
  'jimu/dijit/TabContainer',
  'jimu/dijit/LoadingIndicator',
  'jimu/dijit/Message',
  'jimu/utils',
  'jimu/zoomToUtils',
  'jimu/LayerInfos/LayerInfos',
  './editorManager',
  './resultRendererManager',
  'esri/tasks/GPMessage',
  'esri/tasks/Geoprocessor',
  'esri/tasks/JobInfo',
  'esri/layers/ImageParameters',
  'esri/request',
  './utils'
],
function(declare, lang, array, html, on, query, Deferred, all,
  BaseWidget, TabContainer, LoadingIndicator, Message, utils, zoomToUtils, LayerInfos, editorManager,
  resultRendererManager, GPMessage, Geoprocessor, JobInfo, ImageParameters,
  esriRequest, gputils) {
  var clazz = declare([BaseWidget], {
    //these two properties is defined in the BaseWidget
    baseClass: 'jimu-widget-geoprocessing',
    name: 'GeoprocessingUDS',
    messageInterval: null,
    jodId: '',

    postMixInProperties: function(){
      this.inherited(arguments);
      lang.mixin(this.nls, window.jimuNls.common);
      lang.mixin(this.nls, window.jimuNls.units);
    },

    startup: function(){
      this.inherited(arguments);

      if(!this.config.taskUrl){
        html.setStyle(this.toolNode, 'display', 'none');
        html.setStyle(this.errorNode, 'display', '');
        return;
      }
      this.inputNodes = [];
      this.drawTools = [];

      //each result will be displayed by dijit
      this.resultNodes = [];
      this.resultLayers = [];
      this.resultExtentMap = {};
      this.visibleOutputNames = [];
      if (this.config.useResultMapServer) {
        var resultLayers = [];
        array.some(this.config.outputParams, lang.hitch(this, function(param) {
          if (param.dataType === 'MapServiceLayer') {
            resultLayers = param.layerNames;
            return true;
          }
        }));
        array.forEach(this.config.outputParams, lang.hitch(this, function(param){
          if (!param.ignore && param.visible) {
            if (param.dataType === 'MapServiceLayer') {
              this.visibleOutputNames.push(param.name);
            } else if(resultLayers.indexOf(param.name) < 0 && resultLayers.indexOf(param.label) < 0 &&
              param.dataType === 'GPFeatureRecordSetLayer') {
              this.visibleOutputNames.push(param.name);
            }
          }
        }));
      } else {
        array.some(this.config.outputParams, lang.hitch(this, function(param) {
          if (!param.ignore && param.visible && param.dataType === 'GPFeatureRecordSetLayer') {
            this.visibleOutputNames.push(param.name);
          }
        }));
      }

      editorManager.setMap(this.map);
      editorManager.setNls(this.nls);

      resultRendererManager.setMap(this.map);
      resultRendererManager.setNls(this.nls);

      this.gp = new Geoprocessor(this.config.taskUrl);
      this.gp.setOutSpatialReference(this.map.spatialReference);

      if(this.config.updateDelay){
        this.gp.setUpdateDelay(this.config.updateDelay);
      }

      this.tab = new TabContainer({
        tabs: [{
          title: this.nls.input,
          content: this.inputPaneNode
        }, {
          title: this.nls.output,
          content: this.outputPaneNode
        }],
        selected: this.nls.input
      });
      this.tab.placeAt(this.domNode);
      this.tab.startup();

      this.loading = new LoadingIndicator({
        hidden: true
      }, this.loadingNode);
      this.loading.startup();

      //Fires when a synchronous GP task is completed
      this.own(on(this.gp, 'execute-complete', lang.hitch(this, this.onExecuteComplete)));

      //Fires when an asynchronous GP task using submitJob is complete.
      this.own(on(this.gp, 'job-complete', lang.hitch(this, this.onJobComplete)));

      this.own(on(this.gp, 'job-cancel', lang.hitch(this, this.onJonCancel)));

      //Fires when a job status update is available.
      this.own(on(this.gp, 'status-update', lang.hitch(this, this.onStatusUpdate)));

      //Fires when the result of an asynchronous GP task execution is available.
      this.own(on(this.gp, 'get-result-data-complete',
        lang.hitch(this, this.onGetResultDataComplate)));

      //Fires when a map image is generated by invoking the getResultImage method.
      this.own(on(this.gp, 'get-result-image-layer-complete',
        lang.hitch(this, this.onGetResultImageLayerComplete)));

      this.own(on(this.gp, 'error', lang.hitch(this, this.onError)));

      html.setAttr(this.helpLinkNode, 'href', this.config.helpUrl);

      this._generateUniqueID();
      if(!("serverInfo" in this.config)){
        //Load gp server info if it does not exist.
        gputils.getServiceDescription(this.config.taskUrl).then(lang.hitch(this,
          function(taskInfo){
          this.config.serverInfo = taskInfo.serverInfo;
          this._createInputNodes();
        }));
      }else{
        this._createInputNodes();
      }
    },

    executeGP: function(){
      this._clearLastResult();
      html.addClass(this.exeNode, 'jimu-state-disabled');
      this._getInputParamValues().then(lang.hitch(this, function(inputValues){
        this._showLoading();

        // Send a request to service url to make it added to corsEnabledServers.
        esriRequest({
          url: this.config.taskUrl,
          content: {
            f: 'json'
          },
          handleAs : "json",
          callbackParamName:'callback'
        }).then(lang.hitch(this, function() {
          if(this.config.isSynchronous){
            this.gp.execute(inputValues);
            this.infoTextNode.innerHTML = this.nls.executing;
          }else{
            this.gp.submitJob(inputValues);
          }
          this.tab.selectTab(this.nls.output);
        }), lang.hitch(this, function() {
          html.removeClass(this.exeNode, 'jimu-state-disabled');
        }));
      }), lang.hitch(this, function() {
        html.removeClass(this.exeNode, 'jimu-state-disabled');
      }));
    },

    onDeActive: function(){
      array.forEach(this.drawTools, function(drawTool){
        drawTool.deactivate();
      });
    },

    onExecuteComplete: function(results){
      this._hideLoading();

      //show messages if there are warning or error
      var msgs;
      if(results.messages && results.messages.length > 0){
        msgs = array.filter(results.messages, function(msg){
          return msg.type === GPMessage.TYPE_WARNING ||
                 msg.type === GPMessage.TYPE_ERROR;
        });
        if(msgs.length > 0){
          this._createErrorMessages(msgs);
        }
      }

      //the results.results is an array of ParameterValue,
      //because it contains one or more parameters
      this._createOutputNodes(results.results);

      html.removeClass(this.exeNode, 'jimu-state-disabled');
    },

    onJobComplete: function(jobInfo){
      this._hideLoading();
      this._clearMessageInterval();

      html.removeClass(this.exeNode, 'jimu-state-disabled');

      //onJobComplete is invoked even if jobStatus is STATUS_FAILED.
      //It hides this.infoNode so user can not see the error message!
      if(jobInfo.jobInfo.jobStatus !== JobInfo.STATUS_SUCCEEDED){
        this._createErrorMessages(jobInfo.jobInfo.messages);
        return;
      }

      if(this.config.useResultMapServer){
        var resultLayers = [];
        array.some(this.config.outputParams, function(param) {
          if (param.dataType === 'MapServiceLayer') {
            resultLayers = param.layerNames;
            return true;
          }
        });
        //only when GP task is async and the GP service publish the result map service,
        //the option "useResultMapServer" may be true. This will be guaranteed in builder
        var imageParameters = new ImageParameters({
          imageSpatialReference: this.map.spatialReference
        });
        var resultMapServiceParam = this._getResultMapServiceParam();
        if (!resultMapServiceParam || resultMapServiceParam.ignore !== true) {
          this.gp.getResultImageLayer(jobInfo.jobInfo.jobId, null, imageParameters);
          // add outputs that are not contained in result map service
          array.forEach(this.config.outputParams, function(param){
            if(resultLayers.indexOf(param.name) < 0 && resultLayers.indexOf(param.label) < 0 &&
              (param.dataType === 'GPFeatureRecordSetLayer' ||
              param.dataType === 'GPRasterDataLayer' ||
              param.dataType === 'GPRecordSet')) {
              this.gp.getResultData(jobInfo.jobInfo.jobId, param.name);
            }
          }, this);
        }
        // add outputs whose type is not geo dataset
        array.forEach(this.config.outputParams, function(param){
          if(param.ignore !== true &&
            param.dataType !== 'GPFeatureRecordSetLayer' &&
            param.dataType !== 'GPRasterDataLayer' &&
            param.dataType !== 'GPRecordSet') {
            this.gp.getResultData(jobInfo.jobInfo.jobId, param.name);
          }
        }, this);
      }else{
        array.forEach(this.config.outputParams, function(param){
          if(param.ignore !== true) {
            this.gp.getResultData(jobInfo.jobInfo.jobId, param.name);
          }
        }, this);
      }
    },

    onJonCancel: function(){
      this.loading.hide();
      this.infoTextNode.innerHTML = 'Canceled';

      html.removeClass(this.exeNode, 'jimu-state-disabled');
      this._clearMessageInterval();
    },

    onStatusUpdate: function(jobInfo){
      this.jobId = jobInfo.jobInfo.jobId;
      if(jobInfo.jobInfo.jobStatus === JobInfo.STATUS_SUCCEEDED){
        this._hideLoading();
        this._clearMessageInterval();
      }else{
        this._showLoading(jobInfo.jobInfo.jobStatus);
      }
      if(!this.messageInterval && this.jobId) {
        this._setupMessageInterval();
      }
    },

    onGetResultDataComplate: function(result){
      //the result.result contains only one ParameterValue
      this._createOutputNode(this._getOutputParamByName(result.result.paramName), result.result);
    },

    onGetResultImageLayerComplete: function(result){
      var lyr = result.layer;
      if (lyr) {
        var layerName = lyr.url.substring(lyr.url.lastIndexOf('/') + 1);
        var outputParam = {
          name: layerName,
          title: layerName,
          tooltip: layerName,
          dataType: 'result map service'
        };
        lyr._wab_type = 'ArcGISDynamicMapServiceLayer';
        var resultMapServiceParam = this._getResultMapServiceParam();
        if (resultMapServiceParam) {
          outputParam.label = resultMapServiceParam.label;
          outputParam.tooltip = resultMapServiceParam.tooltip;
          outputParam.layerInvisible = resultMapServiceParam.layerInvisible;
          lyr.title = resultMapServiceParam.label;
          lyr.setVisibility(resultMapServiceParam.layerInvisible !== true);
        }
        var outputNode = this._createOutputNode(outputParam, lyr);

        if(outputNode !== null) {
          this.resultLayers.push(lyr);
          var layerInfos = LayerInfos.getInstanceSync();
          var addLayerHandle = on(layerInfos, 'layerInfosChanged', lang.hitch(this, function() {
            var layerInfo = layerInfos.getLayerInfoById(lyr.id);
            if (layerInfo) {
              addLayerHandle.remove();
              if (!outputParam.label) {
                var labelNode = query('.output-label', outputNode);
                if (labelNode && labelNode.length > 0 && layerInfo.title) {
                  labelNode[0].innerHTML = layerInfo.title;
                }
              }
              layerInfo.getExtent().then(lang.hitch(this, function(ext) {
                if (lang.isArray(ext) && ext.length > 0) {
                  this.resultExtentMap[resultMapServiceParam.name] = ext[0];
                  this._updateResultExtent();
                } else if(ext) {
                  this.resultExtentMap[resultMapServiceParam.name] = ext;
                  this._updateResultExtent();
                }
              }));
            }
          }));
        }
      }
    },

    onError: function(error){
      this.loading.hide();
      this.infoTextNode.innerHTML = utils.sanitizeHTML(error.error.message);

      html.removeClass(this.exeNode, 'jimu-state-disabled');
      this._clearMessageInterval();
    },

    _updateJobMessage: function() {
      // Send request to get job messages
      esriRequest({
        url: this.config.taskUrl + '/jobs/' + this.jobId,
        content: {
          f: 'json',
          returnMessages: true
        },
        handleAs : "json",
        callbackParamName:'callback'
      }).then(lang.hitch(this, function(res) {
        if (res.messages && res.messages.length > 0) {
          html.empty(this.infoTextNode);
          array.forEach(res.messages, function(message) {
            html.create('div', {
              'class': 'job-message',
              innerHTML: utils.sanitizeHTML(message.description)
            }, this.infoTextNode);
          }, this);
        }
      }));
    },

    _setupMessageInterval: function() {
      this.messageInterval = setInterval(lang.hitch(this, this._updateJobMessage), 3000);
    },

    _clearMessageInterval: function() {
      this.jobId = '';
      if (this.messageInterval) {
        clearInterval(this.messageInterval);
        this.messageInterval = null;
      }
    },

    destroy: function(){
      this._clearLastInput();
      this._clearLastResult();
      this._clearMessageInterval();
      this.inherited(arguments);
    },

    _generateUniqueID: function(){
      this.uniqueID = this.id.replace(/[\/\.]/g, '_');
    },

    _showLoading: function(){
      this.loading.show();
      html.setStyle(this.infoNode, 'display', 'block');
    },

    _hideLoading: function(){
      html.setStyle(this.infoNode, 'display', 'none');
      this.loading.hide();
    },

    _getOutputParamByName: function(paramName){
      for(var i = 0; i < this.config.outputParams.length; i ++){
        if(this.config.outputParams[i].name === paramName){
          return this.config.outputParams[i];
        }
      }
    },

    _getInputParamValues: function(){
      var retDef = new Deferred(), retValues = {}, defs = [], def, errorMessage = '';
      array.forEach(this.inputNodes, function(node){
        def = node.inputEditor.getGPValue();
        def.param = node.param;
        defs.push(def);
      }, this);

      all(defs).then(lang.hitch(this, function(values){
        for(var i = 0; i < values.length; i++){
          if(defs[i].param.required && (values[i] === null || values[i] === undefined)){
            errorMessage = defs[i].param.label + ' ' + this.nls.requiredInfo;
            new Message({
              message: errorMessage
            });
            retDef.reject(errorMessage);
            return;
          }else{
            retValues[defs[i].param.name] = values[i];
          }
        }
        retDef.resolve(retValues);
      }), function(err) {
        retDef.reject(err);
      });
      return retDef;
    },

    _createInputNodes: function(){
      array.forEach(this.config.inputParams, function(param){
        this._createInputNode(param);
      }, this);
    },

    _clearLastInput: function(){
      array.forEach(this.inputNodes, function(node){
        if(node.inputEditor.clear && lang.isFunction(node.inputEditor.clear)){
          node.inputEditor.clear();
        }
      }, this);
    },

    _clearLastResult: function(){
      html.empty(this.infoTextNode);
      array.forEach(this.resultNodes, function(node){
        html.destroy(node.labelNode);
        if(node.resultRenderer){
          node.resultRenderer.destroy();
        }
        html.destroy(node);
      });
      array.forEach(this.resultLayers, function(layer){
        if(layer !== null){
          this.map.removeLayer(layer);
        }
      }, this);

      this.resultNodes = [];
      this.resultLayers = [];
      this.resultExtentMap = {};
    },

    _createErrorMessages: function(messages){
      this.infoTextNode.innerHTML = '';

      var ulNode = html.create('ul', {
        'class': 'output-node'
      }, this.outputSectionNode);

      this.resultNodes.push(ulNode);

      array.forEach(messages, lang.hitch(this, function(msg){
        html.create('li', {
          'class': 'error-message',
          innerHTML: utils.sanitizeHTML(msg.description)
        }, ulNode);
      }));
    },

    _createOutputNodes: function(values){
      var nodes = [];
      array.forEach(this.config.outputParams, function(param, i){
        nodes.push(this._createOutputNode(param, values[i]));
      }, this);

      var hasVisibleParam = array.some(nodes, function(node) {
        return node !== null;
      });

      if(hasVisibleParam) {
        var allFeatures = [];
        array.forEach(values, lang.hitch(this, function(valueObj){
          if(valueObj.dataType === "GPFeatureRecordSetLayer"){
            var features = valueObj.value && valueObj.value.features;
            if(features && features.length > 0){
              allFeatures = allFeatures.concat(features);
            }
          }
        }));
        if(allFeatures.length > 0){
          utils.featureAction.zoomTo(this.map, allFeatures);
        }
      }
    },

    _onExecuteClick: function(){
      if(html.hasClass(this.exeNode, 'jimu-state-disabled')){
        return;
      }
      this.executeGP();
    },

    _createInputNode: function(param) {
      var node = html.create('div', {
        'class': 'input-node'
      }, this.inputSectionNode);
      var labelNode = html.create('div', {
        'class': 'input-label',
        title: param.tooltip || param.label || ''
      }, node);
      html.create('span', {
        'class': 'label-text',
        innerHTML: utils.sanitizeHTML(param.label)
      }, labelNode);
      if(param.required){
        html.create('span', {
          'class': 'label-star',
          innerHTML: '*'
        }, labelNode);
      }

      var editorContainerNode = html.create('div', {
        'class': 'editor-container'
      }, node);

      var inputEditor = editorManager.createEditor(param, 'input', 'widget', {
        uid:this.uniqueID,
        config: this.config,
        appConfig: this.appConfig
      });
      inputEditor.placeAt(editorContainerNode);

      if(inputEditor.editorName === 'SelectFeatureSetFromDraw'){
        this.drawTools.push(inputEditor.drawBox);
      }

      node.param = param;
      node.inputEditor = inputEditor;
      this.inputNodes.push(node);

      if(param.visible === false){
        html.setStyle(node, 'display', 'none');
      }
      return node;
    },

    _createOutputNode: function(param, value) {
      var resultRenderer;

      if(param.ignore !== true){
        try{
          resultRenderer = resultRendererManager.createResultRenderer(param, value, {
            uid: this.uniqueID,
            config: this.config
          });
          if (param.dataType === 'GPFeatureRecordSetLayer') {
            if (resultRenderer.resultLayer && resultRenderer.resultLayer.fullExtent) {
              this.resultExtentMap[param.name] = resultRenderer.resultLayer.fullExtent;
            } else {
              this.resultExtentMap[param.name] = 'empty';
            }
            this._updateResultExtent();
          }
        }catch(err){
          console.error(err);
          resultRenderer = resultRendererManager.createResultRenderer('error', value, {
            uid: this.uniqueID,
            config: this.config
          });
        }

        var node = html.create('div', {
          'class': 'output-node'
        }, this.outputSectionNode);

        this.resultNodes.push(node);

        var labelNode = html.create('div', {
          'class': 'output-label',
          title: param.tooltip || param.label || '',
          innerHTML: utils.sanitizeHTML(param.label)
        }, node);

        node.param = param;
        node.labelNode = labelNode;

        var rendererContainerNode = html.create('div', {
          'class': 'renderer-container'
        }, node);

        resultRenderer.placeAt(rendererContainerNode);
        resultRenderer.startup();
        node.resultRenderer = resultRenderer;

        // update datasource
        if(!this.config.useResultMapServer &&
          (param.dataType === 'GPFeatureRecordSetLayer' || param.dataType === 'GPRecordSet') &&
          param.defaultValue && param.defaultValue.fields) {
          if(!gputils.useDynamicSchema(param, this.config)) {
            this.updateDataSourceData('filter-' + param.name, {
              features: value.value.features
            });
          }
        }
        return node;
      }else{
        return null;
      }
    },

    _getResultMapServiceParam: function() {
      var resultMapServiceParam;
      array.some(this.config.outputParams, function(param) {
        if (param.dataType === 'MapServiceLayer') {
          resultMapServiceParam = param;
          return true;
        }
      });
      return resultMapServiceParam;
    },

    _updateResultExtent: function() {
      var allResultLoaded = array.every(this.visibleOutputNames, lang.hitch(this, function(paramName) {
        return this.resultExtentMap[paramName] !== undefined;
      }));
      if (allResultLoaded) {
        var extent;
        array.forEach(this.visibleOutputNames, lang.hitch(this, function(paramName) {
          if (this.resultExtentMap[paramName] !== 'empty') {
            if (!extent) {
              extent = this.resultExtentMap[paramName];
            } else {
              extent = extent.union(this.resultExtentMap[paramName]);
            }
          }
        }));
        if (extent) {
          zoomToUtils.zoomToExtent(this.map, extent);
        }
      }
    },

    /**
     * Use selected feature set as input for GP
     */
    useSelectionAsInput: function(featureSet, layer) {
      array.forEach(this.inputNodes, function(node){
        if (node.param.dataType === 'GPFeatureRecordSetLayer' &&
            node.param.defaultValue &&
            utils.getTypeByGeometryType(node.param.defaultValue.geometryType) ===
            featureSet.geometryType) {
          node.inputEditor.setFeatureSet(featureSet, layer);
        }
      }, this);

      this.tab.selectTab(this.nls.input);
    }
  });

  return clazz;
});
