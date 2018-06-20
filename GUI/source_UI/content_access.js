// file source_UI/content_access.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017 .....
//
//  Distributed under the terms of the BSD License.
// ---------------------------------------------------------------------------
// Files and directories access through ajax

define([
    'contents',
    'base/js/utils'
], function (contents_service, utils) {
    "use strict";

    var base_url = utils.get_body_data("baseUrl");

    //*** createFile ***
    //tworzenie pliku tekstowego o nazwie untitled.txt
    function createFile(){
        // var contents = new contents_service.Contents({
        //     base_url: common_options.base_url,
        //     common_config: common_config
        // });

        var contents = new contents_service.Contents({
            base_url: base_url
        });

        contents.new_untitled('', {type: 'file', ext: '.txt'});
    };

    //*** save2 ***
    //Additional method added to Contents.prototyme class contained in Jupyter's "content.js" module
    //UWAGA:PUT (HTTP) nie jest obsługiwany przez wszystkie przeglądarki - może być, że nie zapiszemy snippetów - pomyśleć o PHP - ale najpierw testować
    //trzeba zrobić tak: każde dodanie snippeta wymaga pobrania całej zawartości pliku, modyfikacji i ponownego zapisu, z tego jak działa AJAX inaczej się nie da, chyba, że będziemy używać bazy danych...
    contents_service.Contents.prototype.save2 = function(path, model) {

        var settings = {
            processData : false,
            type : "PUT",
            dataType: "json",
            data : JSON.stringify(model),
            contentType: 'application/json',
        };
        var url = this.api_url(path);
        //the below is similar to $.ajax():
        //alert(url);
        return utils.promising_ajax(url, settings);

    };

    contents_service.Contents.prototype.read2 = function(path) {
//todo: zrobić tak z Contents.get(), żeby czytać zawartość katalogu
        var settings = {
            processData : false,
            type : "GET",
            dataType: "json",
            //data : JSON.stringify(model),
            contentType: 'application/json'
        };
        var url = this.api_url(path);
        //the below is similar to $.ajax():
        //alert(url);
        //return utils.promising_ajax(url, settings);
        return utils.ajax(url, settings);
    };

    /**
     * Get a file. Modified version.
     *
     * @method get
     * @param {String} path
     * @param {Object} options
     *    type : 'notebook', 'file', or 'directory'
     *    format: 'text' or 'base64'; only relevant for type: 'file'
     *    content: true or false; // whether to include the content
     */

    contents_service.Contents.prototype.get2 = function (path, options) {
        /**
         * We do the call with settings so we can set cache to false.
         */
        var settings = {
            processData : false,
            cache : false,
            type : "GET",
            dataType : "json",
        };
        var url = this.api_url(path);
        var params = {};
        if (options.type) { params.type = options.type; }
        if (options.format) { params.format = options.format; }
        if (options.content === false) { params.content = '0'; }
        //return utils.promising_ajax(url + '?' + $.param(params), settings);
        return utils.ajax(url + '?' + $.param(params), settings);
    };

    //** getFiles ***
    //The simplest: getFiles("",{}) will return objest containig all files and dirs from base_url dir
    //it can be used to read file contents or to list any dir
    function getFiles(path,options){
        var contents = new contents_service.Contents({
            base_url: base_url
        });
        return contents.get2(path,options);
    }

    //** getFilesList ***
    //returns array of objects with content of directory (path)
    //todo:dorobić filter - do filtrowania po rozszerzeniu
    function getFilesList(path,options) {
       //var filesList=[];
        try {
           var filesList = getFiles(path, options);
           //return filesList;
           return filesList.responseJSON.content;
       }
       catch (err){
           console.log(err);
           return false;
       }
    };

    //** saveFile ***
    //Saves data into file located in user's HOME directory
    //if file doesn't exist, it will be created. Use carefully!
    function saveFile(fname,data){
        var contents = new contents_service.Contents({
            base_url: base_url
        });
        //contents.save('untitled.txt',{path:'',type:'file', format:'text', content:"{ x: 5, y: 6 }"});
        contents.save2(fname,{path:'',type:'file', format:'text', content:JSON.stringify(data)});
    };

    //** readFile **
    function readFile(fname,option_fn){
        var contents = new contents_service.Contents({
            base_url: base_url
        });
        //contents.api_url('code_snippets.json');

        //var promise1 = contents.read2(fname);
        //var returned_data="";
        //promise1.then(function(value){returned_data = value});
        //return returned_data;

        //$.ajaxSetup({
        //    async: false
        //});

        try {
            var a = contents.read2(fname);

            return JSON.parse(a.responseJSON.content);
        }
        catch (err) {
            console.log('Failed to load snippets from: '+fname);
            //throw 'Unable to read file';
            return false;

        }

    };

    // return public methods
    return {
        saveFile:saveFile,
        readFile:readFile,
        getFiles:getFiles,
        getFilesList:getFilesList
    };

});