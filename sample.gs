
var tableId = '1XhX79O03mdDoEGnOHbyGW2D5HxqYrNcR3SSWep1l'; //作成したFusionTableのurlに含まれるdocidを指定します

function createBL(e, content) {
  return content;
}
routerData.logicMapping['create'] = createBL;


function getContent(e, content) {
  // 更新・削除画面の表示
  //ROWID, code, price, userid, scope, name, type, content, timestamp
  var sql = 'SELECT ROWID, name, type, timestamp, userid, scope, content FROM ' + tableId + ' WHERE ROWID = ' + e.parameters.row_id;
  var result = FusionTables.Query.sqlGet(sql);
  
  content.result = {"columns":result.columns,"length":result.rows.length};
  if( result.rows.length > 0 ) {
    var row = result.rows[0];
    content.result.row_id = row[0];
    content.result.name = row[1];
    content.result.type = row[2];
    content.result.scope = row[5];
    content.result.content = Utilities.newBlob(Utilities.base64Decode( row[6], Utilities.Charset.UTF_8)).getDataAsString();
  }
  return content;
}
routerData.logicMapping['content'] = getContent;
routerData.logicMapping['update'] = getContent;

function publicList(e, content) {
  // 一覧画面の表示
  //ROWID, code, price, userid, scope, name, type, content, timestamp
  var sql = 'SELECT ROWID, name, type, timestamp, userid, scope FROM ' + tableId 
    + ' WHERE '
    + " scope NOT EQUAL TO 'private' "
    + ' LIMIT 100';
  var result = FusionTables.Query.sqlGet(sql);
  content.result = {"columns":result.columns,"rows":result.rows};
  return content;
}
routerData.logicMapping['default'] = publicList;

function mylist(e, content) {
  // 一覧画面の表示
  //ROWID, code, price, userid, scope, name, type, content, timestamp
  var sql = 'SELECT ROWID, name, type, timestamp, userid, scope FROM ' + tableId 
    + ' WHERE '
    + " userid = '" + e.userid + "'"
    + ' LIMIT 100';
  var result = FusionTables.Query.sqlGet(sql);
  content.result = {"columns":result.columns,"rows":result.rows};
  return content;
}
routerData.logicMapping['mylist'] = mylist;


// レコード追加
function createRecordBL(e, content) {
  var form = { name :e.parameters.name || ""
              ,type :e.parameters.name || "txt"
              ,timestamp :formatDate(new Date())
              ,scope :e.parameters.scope || "public"
              ,content :Utilities.base64Encode(e.parameters.content, Utilities.Charset.UTF_8) || ""
             }
  var sql = "INSERT INTO " + tableId
   + " ('name','type','timestamp','userid','scope','content')"
   + " VALUES ('" + form.name + "','" + form.type + "','" + form.timestamp + "','" + e.userid + "','" + form.scope + "','" + form.content + "')";
  FusionTables.Query.sql(sql);
}
routerData.logicMapping['createRecord'] = createRecordBL;

// レコード追加
function createRecord(form) {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":form,"pathInfo":"createRecord.json"};
  makeResponse(e,"GET");
}

// レコード更新
function updateRecordBL(e, content) {
  var form = { row_id : e.parameters.row_id
              ,name :e.parameters.name || ""
              ,type :e.parameters.name || "txt"
              ,timestamp :formatDate(new Date())
              ,scope :e.parameters.scope || "public"
              ,content :Utilities.base64Encode(e.parameters.content, Utilities.Charset.UTF_8)|| ""
             }
  var sql = "UPDATE " + tableId
   + " SET name='" + form.name + "', type='" + form.type + "', timestamp='" + form.timestamp + "', userid='" + e.userid + "', scope='" + form.scope + "', content='" + form.content + "'"
   + " WHERE ROWID = '" + form.row_id + "'";
   //+ " and userid = '" + e.userid + "'";
  Logger.log(sql);
  FusionTables.Query.sql(sql);
}
routerData.logicMapping['updateRecord'] = updateRecordBL;
// レコード更新
function updateRecord(form) {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":form,"pathInfo":"updateRecord.json"};
  makeResponse(e,"GET");
}


// レコード削除
function deleteRecordBL(e, content) {
  var form = { row_id :e.parameters.row_id || ""};
  var sql = "DELETE FROM " + tableId + " WHERE ROWID = '" + form.row_id + "'";
  // + " WHERE userid = '" + e.userid + "'";
  FusionTables.Query.sql(sql);
}
routerData.logicMapping['deleteRecord'] = deleteRecordBL;

// レコード削除
function deleteRecord(form) {
  var e ={"parameter":{},"contextPath":"","contentLength":-1,"queryString":"","parameters":form,"pathInfo":"deleteRecord.json"};
  makeResponse(e,"GET");
}
