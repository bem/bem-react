'use strict';

const rimraf = require('rimraf');

function asyncRimRaf(filepath) {
    return new Promise((resolve, reject) => {
        rimraf(filepath, (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        })
    });
}

module.exports.asyncRimRaf = asyncRimRaf;
