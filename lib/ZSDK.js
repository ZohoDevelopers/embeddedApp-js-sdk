var ZSDKUtil = (function(ZSDKUtil) {

  var QueryParams = GetQueryParams();

  // Global Logger instance which will be acquired and shared by other modules.
  var GlobalLogger;

  // minimal Logging utility.
  function ZLogger(mode) {}
  ZLogger.prototype.Info = function() {
    if (ZSDKUtil.isDevMode() || ZSDKUtil.isLogEnabled()) {
        window.console.info.apply(null, arguments);
    }
  }
  ZLogger.prototype.Error = function() {
    if (ZSDKUtil.isDevMode() || ZSDKUtil.isLogEnabled()) {
        window.console.error.apply(null, arguments);
    }
  }
  function getLogger() {
    if( !GlobalLogger || !(GlobalLogger instanceof ZLogger)) {
      GlobalLogger = new ZLogger(); // Logging instance for Core Framework
    }

    return GlobalLogger;
  }
  
  function GetQueryParams(URL) {
    //TODO: Handle hash case too.
    var qParams = {};
    URL = URL || window.location.href;
    var splittedParams = URL.substr(URL.indexOf('?') + 1).split("&");
    splittedParams.forEach(function (ele, idx) {
      var miniSplit = ele.split('=');
      qParams[miniSplit[0]] = miniSplit[1];
    });

    // decoding serviceOrigin URL
    if( qParams.hasOwnProperty('serviceOrigin') ) {
      qParams['serviceOrigin'] = decodeURIComponent(qParams['serviceOrigin']);
    }
    
    return qParams;
  }
  function isDevMode() {
    return QueryParams && QueryParams['isDevMode'];
  }
  function isLogEnabled() {
    return QueryParams && QueryParams['isLogEnabled'];
  }
  
  
  // Sleep
  function Sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while( (startTime + milliSeconds) > new Date().getTime()) {};
  }
  ZSDKUtil.GetQueryParams = GetQueryParams;
  ZSDKUtil.isDevMode = isDevMode;
  ZSDKUtil.isLogEnabled = isLogEnabled;
  ZSDKUtil.getLogger = getLogger;
  ZSDKUtil.Sleep = Sleep;

  return ZSDKUtil;

})(window.ZSDKUtil || {});

var ZSDKMessageManager = (function(ZSDKMessageManager) {

  var SDKContext;
  var Logger = ZSDKUtil.getLogger();
  var defaultPromiseTimeout = 10000; // Promise timeout
  var promiseIDCtr = 100;
  var PromiseQueue = {}; // Queue holding all the GetRequest promises

  var AllowedOrigins = new RegExp("^https?:\/\/[a-zA-Z0-9-_]*.(sandbox.crm-oem.com|csez.zohocorpin.com|zoho.com|zoho.eu|zohoplatform.com|zohosandbox.com)(:[0-9]{0,4})?$");
  
  var AuthParentWindow, AuthParentOrigin;

  function Init(ctx, config) { // Config is for future use
    if( !ctx || typeof ctx !== 'object' ) {
      throw Error('Invalid Context object passed');
    }
    if( config && typeof config !== 'object') {
      throw Error('Invalid Configuration Passed to MessageManager');
    }
    
    SDKContext = ctx;

    return MessageHandler.bind(ZSDKMessageManager);
  }

  // Authorization Check in SDK side.
  function isAuthorizedMessage(MEvent) {
    var incomingSource = MEvent.source;
    var incomingOrigin = MEvent.origin;

    if( SDKContext.isAppRegistered() && AuthParentWindow === incomingSource && AuthParentOrigin === incomingOrigin ) {
      return true;
    }

    return new Error('Un-Authorized Message.');
  }
  function MessageHandler(MessageEvent) {
    /* Added for backward compatibility support */
    try {
      var data = typeof MessageEvent.data === 'string' ? JSON.parse(MessageEvent.data) : MessageEvent.data;
    } catch(e) {
      var data = MessageEvent.data;
    }
    var messageType = data.type;
    var eventName = data.eventName; 

    try {

      if( eventName === 'SET_CONTEXT' || isAuthorizedMessage(MessageEvent)) {
        switch(messageType) {
          
          case 'FRAMEWORK.EVENT':
            HandleEvent(MessageEvent, data);
            break;

          default:
            SDKContext.MessageInterceptor(MessageEvent, data); // Future Use.
            break;

        }
      }
    } catch(e) {
      Logger.Error('[SDK.MessageHandler] => ', e.stack);
    }
  }

  function HandleEvent(MessageEvent, payload) {
    var data = payload.data;
    var eventName = payload.eventName;

    var eventHandlers = {
      'SET_CONTEXT': HandleSetContext,
      'UPDATE_CONTEXT': HandleUpdateContext,
      'EVENT_RESPONSE': HandleEventResponse,
      'EVENT_RESPONSE_FAILURE': HandleEventFailure
    };

    var eventHandler = eventHandlers[eventName];
    if( eventHandler && typeof eventHandler === 'function' ) {
      eventHandler(MessageEvent, payload);
    } else {
      HandleCustomEvent(MessageEvent, payload);
    }
  }
  function HandleSetContext(MessageEvent, payload) {

    var parentOrigin = MessageEvent.origin;
    AuthParentWindow = window.parent; //MessageEvent.source;
    AuthParentOrigin = SDKContext.QueryParams.serviceOrigin; //parentOrigin;

    SDKContext.SetContext(payload.data);
    SDKContext.ExecuteLoadHandler();
  }
  function HandleUpdateContext(MessageEvent, payload) {
    //SDKContext.UpdateContext(payload.data);
    //SDKContext.ExecuteLoadHandler();
  }
  function HandleCustomEvent(MessageEvent, payload) {
    ZSDKEventManager.NotifyEventListeners(SDKContext.AppContext, payload.eventName, payload.data);
  }

  function HandleEventResponse(MessageEvent, payload) {
    var promiseID = payload.promiseid;
    var response = payload.data;
    HandlePromiseCallback(promiseID, true, response);
  }
  function HandleEventFailure(MessageEvent, payload) {
    var promiseID = payload.promiseid;
    var response = payload.data;
    HandlePromiseCallback(promiseID, false, response);
  }
  function HandlePromiseCallback(promiseID, isSuccess, response) {
    if (PromiseQueue.hasOwnProperty(promiseID)) {
      
      if(isSuccess){
        PromiseQueue[promiseID]['resolve'](response);
      }
      else{
        PromiseQueue[promiseID]['reject'](response); 
      }
      

      PromiseQueue[promiseID] = undefined;
      delete PromiseQueue[promiseID];
    } else {
      //TODO: Handle if there is no promiseID present
    }
  }
  function SendRequest(options) {
    if (!options || typeof options !== 'object') {
      throw new Error('Invalid Options passed');
    }

    return SendEvent('HTTP_REQUEST', options, true);
  }
  function TriggerEvent(eventName, payload, isPromiseEvent) {

    if(!eventName) {
      throw new Error('Invalid Eventname : ', eventName);
    }

    var PromiseID = !!isPromiseEvent ? getNextPromiseID() : undefined;
    var eventObject = {
      /* Default Event Props */
      type: 'SDK.EVENT',
      eventName: eventName,
      uniqueID : SDKContext.getUniqueID(),
      time: new Date().getTime(),
      promiseid: PromiseID,

      /* User data */
      data: payload
    };

    PostMessage(eventObject);

    if( isPromiseEvent ) {
      return AddToPromiseQueue(PromiseID);
    }
  }

  // Sends the event to the Framework.
  function SendEvent(eventName, payload, isPromiseEvent) {

    if(!eventName) {
      throw new Error('Invalid Eventname : ', eventName);
    }

    var PromiseID = !!isPromiseEvent ? getNextPromiseID() : undefined;
    var eventObject = {
      /* Default Event Props */
      type: 'SDK.EVENT',
      eventName: eventName,
      uniqueID : SDKContext.getUniqueID(),
      time: new Date().getTime(),
      promiseid: PromiseID,

      /* User data */
      data: payload
    };

    PostMessage(eventObject);

    if( isPromiseEvent ) {
      return AddToPromiseQueue(PromiseID);
    }
  }
  function getNextPromiseID() {
    return 'Promise' + promiseIDCtr++;
  }
  function AddToPromiseQueue(promiseID) {

    var promise = new Promise(function (resolve, reject) {

      // Adding the promise to queue.
      PromiseQueue[promiseID] = {
        resolve: resolve,
        reject: reject,
        time: new Date().getTime()
      };
    });

    /*
     * Currently the Timeout case is disabled. Need to revisit.
    setTimeout(function () {
      if (PromiseQueue.hasOwnProperty(PromiseId)) {

        PromiseQueue[PromiseId].reject('timeout'); // TODO: Better timeout message.
        delete PromiseQueue[PromiseId];

      }
    }, defaultPromiseTimeout); // Have to define as common config props
    */

    return promise;
  }

  function RegisterApp() {

    var registerSDKClient = {
      type: 'SDK.EVENT',
      eventName: 'REGISTER',
      appOrigin: encodeURIComponent(getCurrentURLPath())
    };

    // Initiating the Client Handshake
    window.parent.postMessage(registerSDKClient, SDKContext.QueryParams.serviceOrigin);
  }
  function DERegisterApp() {
    var deRegisterSDKClient = {
      type: 'SDK.EVENT',
      eventName: 'DEREGISTER',
      uniqueID : SDKContext.getUniqueID()
    };

    PostMessage(deRegisterSDKClient);
  }
  
  // Helpers
  function PostMessage(data) {

    if( typeof data === 'object' ) {
      data['appOrigin'] = encodeURIComponent(getCurrentURLPath());
    }

    if( !AuthParentWindow ) {
      throw new Error('Parentwindow reference not found.');
    }
    AuthParentWindow.postMessage(data, SDKContext.QueryParams.serviceOrigin);

  }
  function getCurrentURLPath() {
    return window.location.protocol + '//' + window.location.host + window.location.pathname;
  }
  ZSDKMessageManager.Init = Init;
  ZSDKMessageManager.RegisterApp = RegisterApp;
  ZSDKMessageManager.DERegisterApp = DERegisterApp;

  ZSDKMessageManager.SendRequest = SendRequest;
  ZSDKMessageManager.TriggerEvent = TriggerEvent;

  return ZSDKMessageManager;
})(window.ZSDKMessageManager || {});

var ZSDKEventManager = (function(ZSDKEventManager) {

  var Logger = ZSDKUtil.getLogger();
  // Private var's
  var EventListeners = {}; // Map storing all the eventnames and their Listeners 

  // Public API's
  function AttachEventListener(eventName, fn) {
    if( typeof fn !== 'function' ) {
      //TODO: Using Logger log an error message as invalid params passed. fn is expected.
      return;
    }

    if(!Array.isArray(EventListeners[eventName])) {
      EventListeners[eventName] = [];
    }
    EventListeners[eventName].push(fn);
  }

  function NotifyEventListeners(AppContext, eventName, eventData) {
    var internalEventCheck = eventName.match(/^\__[A-Za-z_]+\__$/gi);
    var isInternalEvent = Array.isArray(internalEventCheck) && internalEventCheck.length > 0;

    var bindedListeners = EventListeners[eventName];
    if (bindedListeners && Array.isArray(bindedListeners) ) {
      for (var i = 0; i < bindedListeners.length; i++) {
        var fn = bindedListeners[i];
        fn.call(AppContext, eventData);
      }
    } else {
      Logger.Info('Cannot find EventListeners for Event : ', eventName);
    }
  }
  
  function NotifyInternalEventHandler(SDKContext, payload) {
    var eventName = payload.eventName;

    if( eventName === '__APP_INIT__' ) {
      SDKContext.SetContext(payload.data);
      SDKContext.ExecuteLoadHandler();

    } else if( eventName === '__APP_CONTEXT_UPDATE__' ) {
      SDKContext.UpdateContext(payload.data);
      SDKContext.ExecuteContextUpdateHandler();
    }
  }


  ZSDKEventManager.AttachEventListener = AttachEventListener;
  ZSDKEventManager.NotifyEventListeners = NotifyEventListeners;
  ZSDKEventManager.NotifyInternalEventHandler = NotifyInternalEventHandler;

  return ZSDKEventManager;
})(window.ZSDKEventManager || {});

;function ZSDK() { // TODO: Replace console with Logger

  /* Private variables */
  var that = this;
  var AppCode; // Fn which gets executed on OnLoad 
  var ContextUpdateHandler; // Fn which executed on OnContextUpdate
  var connectors;
  var QueryParams;
  var uniqueID;
  var paramsObj = {}; //TODO: Pass params from Framework to patchString in API Request call
  var localeResource = {};

  var version = '0.7.0'; // Version

  var Logger = ZSDKUtil.getLogger();

  var _isAppRegistered = false;
  var isOnLoadTriggered = false;

  /* Instance variables */
  this.isContextReady = false;
  this.HelperContext = {}; // Helper context for helper js files
  this.isDevMode = false;
  this.getContext = function() {
    return AppContext;
  }

  var AppContext = {}; // App context having all the 

  AppContext.Model = {}; // Modeldata store

  AppContext.Event = {}; // Event API's
  AppContext.Event.Listen = AttachEventListener;
  AppContext.Event.Trigger = TriggerEvent; // TODO: Need to check with API name and handler mechanism.

  AppContext.GetRequest = GetRequest;
  AppContext.QueryParams = QueryParams;
  AppContext.Translate = Translate;

  this.OnLoad = function (AppLoadHandler) {

    //TODO: Have to check whether AppCode has been executed. Throw Error when trying to Again bind fn to Init.
    if (typeof AppLoadHandler !== 'function') {
      throw new Error('Invalid Function value is passed');
    }
    AppCode = AppLoadHandler;
    if( _isAppRegistered ) { ExecuteLoadHandler(); }
  }
  this.OnUnLoad = function(AppUnLoadHandler) {
    // TODO: Yet to impl
  }
  this.OnContextUpdate = function(AppCtxUpdateHandler) {
    // TODO: Yet to impl
    ContextUpdateHandler = AppCtxUpdateHandler;
  }

  function ExecuteLoadHandler() {
    if( typeof AppCode !== 'function' ) { Logger.Error('No OnLoad Handler provided to execute.'); return; }
    if(isOnLoadTriggered) { Logger.Error('OnLoad event already triggered.'); return; }

    AppCode.call(AppContext, AppContext);
    isOnLoadTriggered = true;
  }
  function ExecuteContextUpdateHandler() {
    ContextUpdateHandler.call(AppContext, AppContext);
  }
  function isAppRegistered() {
    return _isAppRegistered;
  }

  //TODO: Add support for Setting custom headers and other error handling cases.
  function GetRequest(options) {
    return ZSDKMessageManager.SendRequest(options);
  }

  // TODO: Need to revisit
  function TriggerEvent(eventName, payload, isPromise) {
    return ZSDKMessageManager.TriggerEvent(eventName, payload, isPromise);
  }
  function RegisterClient() {
    ZSDKMessageManager.RegisterApp();
  }

  // LoadContext object
  function SetContext(contextData) {
    Logger.Info('Setting AppContext data');

    var modelData = (contextData && contextData['model']) || {};
    var local = contextData && contextData['locale'];
    var localResource = contextData && contextData['localeResource'];

    if(isDevMode) {
      if( contextData.locale && contextData.localeResource && 
          Object.keys(contextData.localeResource).length === 0 && 
          contextData.localeResource.constructor === Object) {
        if(contextData.locale) {
          LoadLocaleResource(contextData.locale);
        }
      }
    }

    if( typeof ZSDKModelManager !== 'undefined' ) { // No I18n

      for (var key in modelData) {
        ZSDKModelManager.AddModel(key, modelData[key]);
      }
      AppContext.Model = ZSDKModelManager.GetModelStore();
    }

    // Setting the uniqueID
    uniqueID = contextData.uniqueID;

    //TODO: Need to check wheather needed or move to respective place.
    connectors = contextData.connectors;
    Logger.Info('App Connectors ', connectors);

    _isAppRegistered = true;
  }
  function getUniqueID() {
    return uniqueID;
  }
  function UpdateContext(contextData) {
    //Logger.Info('Context Update Event Data ', contextData); 
  }
  function AttachEventListener(eventName, eventHandlerFn) {
    ZSDKEventManager.AttachEventListener(eventName, eventHandlerFn);
  }

  function GetConnectors() {
    return connectors;
  }

  function LoadLocaleResource(locale) {
    _loadJSON('/app-translations/'+ locale +'.json', function(response) {
      // Parse JSON string into object
      localeResource = JSON.parse(response);
      InitI18n();
    });
  }

  function _loadJSON(filepath, callback) {
    var xobj = new XMLHttpRequest();
    //xobj.overrideMimeType("application/json");
    xobj.open('GET', filepath, false); //make 3rd param true for asynchronous mode
    xobj.onreadystatechange = function () { 
      if (xobj.readyState == 4 && xobj.status == "200") {
        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        callback(xobj.responseText);
      }
    };
    
    xobj.send(null);  
  }

  function Translate(key, options) {
    var valStr = '';
    if(key) {
      valStr = _getKeyByString(localeResource, key);
    } 
   
    if( ! valStr) {
      return false;
    }

    if(options) {
      var key;
      var translateOptions = JSON.parse(JSON.stringify(eval(options)));
      var keysArr = Object.keys(translateOptions);
      for(key in keysArr) {
        valStr = _replaceString(valStr, '${'+ keysArr[key] +'}', translateOptions[keysArr[key]]);
      }
    }

    return valStr;
  }

  function _replaceString(str, find, replace) {
    var $r="";
    while($r!=str){ 
        $r = str;
        str = str.replace(find, replace);
    }
    return str;
  }

  function _getKeyByString(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
  }

  function InitI18n() {
    var all = document.querySelectorAll('[data-i18n]');  
    for (var i in all) {
      if (all.hasOwnProperty(i)) {
        var valStr = _getKeyByString(localeResource, all[i].getAttribute('data-i18n')); 
        if( ! valStr) {
          return false;
        }

        if(all[i].hasAttribute('data-options')) {
          var options = JSON.parse(JSON.stringify(eval("(" + all[i].getAttribute('data-options') + ")")));
          var keysArr = Object.keys(options);
          var key;
          for(key in keysArr) {
            valStr = _replaceString(valStr, '${'+ keysArr[key] +'}', options[keysArr[key]]);
          }
        }
        all[i].innerHTML = valStr;
      }
    }
  }

  function Bootstrap() {
    QueryParams = ZSDKUtil.GetQueryParams();

    // Intialize variables
    isDevMode = !!QueryParams.isDevMode;
    
    var SDKContext = {};
    SDKContext.isDevMode = isDevMode;
    SDKContext.ExecuteLoadHandler = ExecuteLoadHandler;
    SDKContext.SetContext = SetContext;
    SDKContext.UpdateContext = UpdateContext;
    SDKContext.QueryParams = QueryParams;
    SDKContext.GetConnectors = GetConnectors;
    SDKContext.TriggerEvent = TriggerEvent;
    SDKContext.ExecuteContextUpdateHandler = ExecuteContextUpdateHandler;
    SDKContext.getUniqueID = getUniqueID;
    SDKContext.isAppRegistered = isAppRegistered;

    // Initiating Message Manager
    var MessageHandler = ZSDKMessageManager.Init(SDKContext);
    window.addEventListener('message', MessageHandler);
    window.addEventListener('unload', function() {
      ZSDKMessageManager.DERegisterApp();
    });

    if( typeof ZSDKModelManager !== 'undefined' ) {
      ZSDKModelManager.Init(SDKContext);
    }

    RegisterClient();
  }

  Bootstrap(); // Bootstrap for SDK
};

