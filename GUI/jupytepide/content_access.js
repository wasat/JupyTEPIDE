// file source_UI/content_access.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017 .....
//
//  Distributed under the terms of the BSD License.
// ---------------------------------------------------------------------------
// Files and directories access through ajax

define([
    'contents',
    'base/js/utils',
    'jquery'
], function (contents_service, utils,$) {
    "use strict";

    var base_url = utils.get_body_data("baseUrl");

    //*** createFile ***
    //tworzenie pliku tekstowego o nazwie untitled.txt
    function createFile() {
        // var contents = new contents_service.Contents({
        //     base_url: common_options.base_url,
        //     common_config: common_config
        // });

        var contents = new contents_service.Contents({
            base_url: base_url
        });

        contents.new_untitled('', {type: 'file', ext: '.txt'});
    }

    //*** delete2 ***
    //Additional method added to Contents.prototype class contained in Jupyter's "content.js" module
    //deleting files and folders recursively
    contents_service.Contents.prototype.delete2 = function(path){
        contents_service.delete(path);
    };

    //*** save2 ***
    //Additional method added to Contents.prototype class contained in Jupyter's "content.js" module
    //UWAGA:PUT (HTTP) nie jest obsługiwany przez wszystkie przeglądarki - może być, że nie zapiszemy snippetów - pomyśleć o PHP - ale najpierw testować
    //trzeba zrobić tak: każde dodanie snippeta wymaga pobrania całej zawartości pliku, modyfikacji i ponownego zapisu, z tego jak działa AJAX inaczej się nie da, chyba, że będziemy używać bazy danych...
    contents_service.Contents.prototype.save2 = function (path, model) {

        var settings = {
            processData: false,
            type: "PUT",
            dataType: "json",
            data: JSON.stringify(model),
            contentType: 'application/json',
        };
        var url = this.api_url(path);
        //the below is similar to $.ajax():
        //alert(url);
        return utils.promising_ajax(url, settings);

    };

    contents_service.Contents.prototype.read2 = function (path) {
//todo: zrobić tak z Contents.get(), żeby czytać zawartość katalogu
        var settings = {
            processData: false,
            type: "GET",
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
            processData: false,
            cache: false,
            type: "GET",
            dataType: "json",
        };
        var url = this.api_url(path);
        var params = {};
        if (options.type) {
            params.type = options.type;
        }
        if (options.format) {
            params.format = options.format;
        }
        if (options.content === false) {
            params.content = '0';
        }
        //return utils.promising_ajax(url + '?' + $.param(params), settings);
        return utils.ajax(url + '?' + $.param(params), settings);
    };

    /**
     * **/
    contents_service.Contents.prototype.delete2 = function(path) {
        var settings = {
            processData : false,
            type : "DELETE",
            dataType : "json",
        };
        var url = this.api_url(path);
        //return utils.promising_ajax(url, settings).catch(
        return utils.ajax(url, settings);
        // .catch(
        //     // Translate certain errors to more specific ones.
        //     function(error) {
        //         // TODO: update IPEP27 to specify errors more precisely, so
        //         // that error types can be detected here with certainty.
        //         if (error.xhr.status === 400) {
        //             throw new Contents.DirectoryNotEmptyError();
        //         }
        //         throw error;
        //     }
        // );
    };

    //** getFiles ***
    //The simplest: getFiles("",{}) will return objest containig all files and dirs from base_url dir
    //it can be used to read file contents or to list any dir
    function getFiles(path, options) {
        var contents = new contents_service.Contents({
            base_url: base_url
        });
        return contents.get2(path, options);
    }

    //** getFilesList ***
    //returns array of objects with content of directory (path)
    function getFilesList(path, options) {
        try {
            var filesList = getFiles(path, options);
            //return filesList;
            var returnFilesList = filesList.responseJSON.content;
        }
        catch (err) {
            console.log(err);
            filesList=[];
            return filesList;
        }

        if (options.filter) {
            var filteredFilesList = [];
            var filterArray = options.filter.toString();
            filterArray = filterArray.split(";");
            for (var i = 0; i < returnFilesList.length; i++) {
                for (var j = 0; j < filterArray.length; j++) {
                    if (returnFilesList[i].type == filterArray[j]) {
                        filteredFilesList.push(returnFilesList[i]);
                    }
                }

            }
            return filteredFilesList;
        }
        else return returnFilesList;
    }

    //Function to use in file browser tab "Files" - to load content
    function get_FilesListDir(path) {
        //to wyłącza działanie asynchroniczne funkcji $getJSON i mozna wtedy poza nią przekazać wartość zmiennej

        $.ajaxSetup({
            async: false
        });

        var FilesList = getFilesList(path, {filter: ""});
        return FilesList;
    }

    //** saveFile ***
    //Saves data into file located in user's HOME directory
    //if file doesn't exist, it will be created. Use carefully!
    function saveFile(fname, data) {
        var contents = new contents_service.Contents({
            base_url: base_url
        });
        //contents.save('untitled.txt',{path:'',type:'file', format:'text', content:"{ x: 5, y: 6 }"});
        contents.save2(fname, {path: '', type: 'file', format: 'text', content: JSON.stringify(data)});
    }

    //** deleteFile ***
    function deleteFile(fname){
        var contents = new contents_service.Contents({
            base_url: base_url
        });
        return contents.delete2(fname);
    };

    function deleteFolderContent(fname){

    };

    //** recursiveDelete ***
    function recursiveDelete(fname){

        var dirname = fname;
        var filesList = getFilesList(fname,{});
        //var paths=[];
        for (var i=0;i<filesList.length;i++){
            //paths.push(filesList[i].path);
            if (filesList[i].type=='file'||filesList[i].type=='notebook') deleteFile(filesList[i].path);
            if (filesList[i].type=='directory') {
                var fname1 = fname+'/'+filesList[i].name;
                console.log(fname1);
                recursiveDelete(fname1);
                deleteFile(filesList[i].path);
            }
        }
        return deleteFile(dirname);

    };

    //** recursiveDeleteSelected ***
    function recursiveDeleteSelected() {
        var i=0,count=0;
        var path_this="";
        //go through all elements on files (and folders) list
        $('div.list_item.row').each(function(){
            var checked = $($('div.list_item.row div input[type=checkbox]')[i]).is(':checked');
            if (checked){
                //var fname = $(this).text();
                var fname = $('.item_name')[i].attributes['path'].value; //read the "path" attribute value which is first in element (index 0)
                console.log("fname: "+fname);
                recursiveDelete(fname);
                count++

                if (fname.search("/")!=-1){
                    path_this=fname.slice(0,fname.lastIndexOf("/"));
                }
                else path_this="";
            }
            i++
        });

        console.log(path_this);

        //Refresh tab contents
        if ($('li.active').text()=="Files"){
            Jupytepide.readDir({DOMelement:"#4karta",path:path_this,contents:"files"});
        }

        if($('li.active').text()=="Notebooks"){
            Jupytepide.readDir({DOMelement:"#3karta",path:path_this,contents:"notebooks"});
        }
        if(count==0){
            alert("Nothing deleted, probably no items selected.");
        }

    };

    //** readFile **
    function readFile(fname, option_fn) {
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
            console.log('Failed to load data from: ' + fname);
            console.log(err);
            //throw 'Unable to read file';
            return false;

        }

    }

    //** readJupytepideJSONFile **
    //this is to read json file from direstory where Jupytepide extension is installed (Jupytepide local dir)
    function readJupytepideJSONFile(fName) {
        //to wyłącza działanie asynchroniczne funkcji $getJSON i mozna wtedy poza nią przekazać wartość zmiennej
         //$.ajaxSetup({
         //    async: false
         //});
        var file_url = fName;//require.toUrl('./'+fName);
        //  $.getJSON(file_url, function (data) {
        //      $.each(data['positions'], function (key, position) {
        //          //snippetsNames.push(snippet['name']);
        //          //snippetsNames.push([{name:'Example 1',link:'#',time:'yesterday',snippet_name:'Example1',on_click:insert_cell1}]);
        //      });
        //  });
        return $.getJSON(file_url).responseJSON;
    }

    // return public methods
    return {
        saveFile: saveFile,
        readFile: readFile,
        getFiles: getFiles,
        getFilesList: getFilesList,
        get_FilesListDir: get_FilesListDir,
        readJupytepideJSONFile:readJupytepideJSONFile,
        deleteFile:deleteFile,
        recursiveDelete:recursiveDelete,
        recursiveDeleteSelected:recursiveDeleteSelected
    };

});