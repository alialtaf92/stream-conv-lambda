'use strict'

require('dotenv').config()
const AWS = require('aws-sdk')
AWS.config.loadFromPath('./awsConfig.json')
const S3 = new AWS.S3()

let multimedia = {}


multimedia.getFile = async (s3Key, s3Region, s3Bucket) => {
        let bucket = s3Region + '-' + s3Bucket
        let params = {
            Bucket: bucket,
            Key: s3Key
        }

        let retVal = await S3.getObject(params).promise()
        return retVal
}

multimedia.uploadFile = async (fileData, awsKey, s3Region) => {
try {
    let bucket = s3Region + '-' + process.env.BUCKET_NAME

    let params = {
        Bucket: bucket,
        Key: awsKey,
        Body: fileData
    }
    console.log('params are : ', params)
    let retVal = await S3.putObject(params).promise()
    console.log('retVal is : ', retVal)
    return retVal
} catch(err) {
    console.log('err is : ', err)
}
}

module.exports = multimedia
