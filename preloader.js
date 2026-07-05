(function() {
    window.nodestorage = {};

    var fs = require('fs');
    var path = require('path');
    var writeFileAtomic = require('write-file-atomic')

    var currentlyWriting = {};

    var saveFilePath = path.join(nw.App.dataPath, "saves");

    if (! fs.existsSync(saveFilePath)) {
        fs.mkdirSync(saveFilePath);
    }

    window.nodestorage.getItem = function(key, onSuccess, itemEncoding) {
        fs.readFile(path.join(saveFilePath, key + ".sav"), {encoding: itemEncoding}, (err, dat) => {
            if (err) {
                if (onSuccess != null)
                    onSuccess(err, undefined);
                return;
            }
            if (onSuccess != null) {
                if (itemEncoding == null)
                    onSuccess(undefined, dat);
                else if (dat == "")
                    onSuccess(undefined, "");
                else
                    onSuccess(undefined, JSON.parse(dat));
            }
        });
    };

    window.nodestorage.getItemParsed = function(key, onSuccess) {
        window.nodestorage.getItem(key, onSuccess, "utf8");
        return true;
    }

    window.nodestorage.getItemBuffer = function(key, onSuccess) {
        window.nodestorage.getItem(key, onSuccess, null);
        return true;
    }

    window.nodestorage.setItem = function(key, value, onSuccess) {
        var castValue = value;
        if (!(value instanceof Uint8Array))
            castValue = JSON.stringify(value);

        var fileName = path.join(saveFilePath, key + ".sav");

        if (currentlyWriting[fileName] == undefined) {
            currentlyWriting[fileName] = {thenWriteContent: null};

            writeFileAtomic(fileName, castValue, {}, (err) => {
                if (currentlyWriting[fileName] != undefined) {
                    if (currentlyWriting[fileName].thenWriteContent != null) {
                        var nowWriteThis = currentlyWriting[fileName].thenWriteContent;
                        currentlyWriting[fileName] = undefined;
                        window.nodestorage.setItem(key, nowWriteThis, null);
                    } else currentlyWriting[fileName] = undefined;
                }

                if (!err && onSuccess != null)
                    onSuccess();
            });
        } else {
            currentlyWriting[fileName].thenWriteContent = value;
        }
    };

    window.nodestorage.removeItem = function(key, onSuccess) {
        fs.unlink(path.join(saveFilePath, key + ".sav"), (err) => {
            if (err) return;
            
            if (onSuccess != null)
                onSuccess();
        })
    };

    window.nodestorage.clear = function(onSuccess) {
        fs.readdir(saveFilePath, (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
                fs.unlink(path.join(saveFilePath, file), err => {
                    if (err) throw err;
                });
            }
        });
    };

    //Always ready
    window.nodestorage.ready = function() {
        return new Promise((resolve, reject) => {
            resolve();
        });
    };

    window.storeScreenshot = function(fileName, castValue, then) {
        var screenshotFilePath = path.join(nw.App.dataPath, "screenshots");

        if (! fs.existsSync(screenshotFilePath)) {
            fs.mkdirSync(screenshotFilePath);
        }

        writeFileAtomic(path.join(screenshotFilePath, fileName), castValue, {}, (err) => {
            then();
        });
    }
})();