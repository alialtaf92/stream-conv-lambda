'use strict'

const HttpStatus = require('http-status-codes')

let errorHandler = {}

errorHandler.setParamsValidationError = function (params, ...attributes) {
    let message = ''
    for (let attribute of attributes) {
        if (message !== '') {
            message += ','
        }
        message = !params[attribute] ? message + ' ' + attribute + ' missing' : message
    }

    return {
        status: HttpStatus.BAD_REQUEST,
        message: message
    }
}

errorHandler.setCustomError = function (message, status) {
    return {
        status: status,
        message: message
    }
}

module.exports = errorHandler
