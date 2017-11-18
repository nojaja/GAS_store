
var routerData = {
  pathMapping : {  },
  logicMapping : {  }
}


function Base64Test() {
  
Logger.log(Base64.encode("Base64エンコード")); //=> "QmFzZTY044Ko44Oz44Kz44O844OJ"
Logger.log(Base64.decode("QmFzZTY044OH44Kz44O844OJ")); //=> "Base64デコード"
  
}


function doGetTest() {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":{},"pathInfo":"test/index.html"};
  return makeResponse(e,"GET");
}

function createRecordTest() {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":{"code":"test","name":"test","price":100},"pathInfo":"createRecord.json"};
  return makeResponse(e,"GET");
}


function doPost(e) {
  var params = JSON.stringify(e);
  var timestamp = e.parameters.timestamp;
  var content = e.parameters.content;
  return  makeResponse(e,"POST");
}

function doGet(e) {
  var params = JSON.stringify(e);
  var timestamp = e.parameters.timestamp;
  var content = e.parameters.content;
  return makeResponse(e,"GET");
}

/**
 URLの分割を行います。
 ret [0]:filename [1]:path [2]:file name  [3]:ext
*/
function splitExt(filename) {
  //return filename.split(/\.(?=[^.]+$)/);
  //(.*/)?(.+?)\.([a-z]+)([\?#;].*)?$
  return filename.match("(.*/)?(.+?)\.([a-z]+)([\?#;].*)?$");
}

function makeResponse (e,type) {
  var content  = {type:type,request:e};
   
  var pathInfo = splitExt(e.pathInfo||'index.html');
  e.path = pathInfo[1];
  e.file = pathInfo[2]||'index';
  e.ext = pathInfo[3]||'html';
  e.userid = Session.getActiveUser().getEmail();
  
  e.baseurl = ScriptApp.getService().getUrl();
  
  content = businessLogic(e,content);
  
  if (e.ext=='json') {
      return makeExtJsonContent(e,content);
  }else {
      return makeExtHtmlContent(e,content);
  }
}

function makeExtJsonContent(e, content) {
  var content  = JSON.stringify(content);
  if (!e.parameter.callback) {
    return ContentService.createTextOutput(content).setMimeType(ContentService.MimeType.JSON);
  } else {
    return ContentService.createTextOutput(e.parameter.callback + "(" + content + ");").setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

function makeExtHtmlContent(e, content) {
    var output = HtmlService.createTemplateFromFile(e.file);
    output.content = content;
    return output.evaluate();
}

function businessLogic(e, content) {
  if(routerData.logicMapping[e.file]) {
    return routerData.logicMapping[e.file](e, content);
  }else{
    return routerData.logicMapping['default'](e, content);
  }
}
