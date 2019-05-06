const fs = require('fs')
require('dotenv').config()
const errorHandler = require('./errorHandler')
const globalConstants = require('./globalConstants')
var path = require('path')
var im = require('imagemagick')
 
let fileProcesser = async (event) => {
    console.log('event started')
    process.env.PATH = process.env.PATH + ':' + process.env.LAMBDA_TASK_ROOT + ':/tmp'
    let response = {}
    try {

        if (!event || !event.inputName || !event.outputName || !event.file || !event.imageArguments) {
            let err = errorHandler.setParamsValidationError(req.body, 'inputName', 'outputName', 'file', 'imageArguments')
            response = err
            return response
        } else {
            let supportedFormats = ['.png', '.jpg']
            let inputFileExtension = path.extname(req.body.inputName).toLowerCase()
            let outputFileExtension = path.extname(req.body.outputName).toLowerCase()
            var base64Data = req.body.file.replace(/^data:image\/png;base64,/, "");

            fs.writeFileSync(req.body.inputName, base64Data, globalConstants.STRING_FORMATS.BASE64)

            if(_.includes(supportedFormats, inputFileExtension) && _.includes(supportedFormats, outputFileExtension)) {
                let data = await convertAndUploadImage(res, req.body.inputname, req.body.outputname, req.body.imageArguments)
                response.data = data
            }
        }
        
        response.statusCode = 200
    } catch (err) {
        console.log('err is at end is : ', err)
        response = {
            statusCode: 500,
            body: JSON.stringify('An error occurred ' + err.message),
        };
        return response
    }
};

function convertAndUploadImage (res, filename, outputName, args)
{
    
    return Promise((resolve, reject) => {
        args.unshift(filename)
        args.push(outputName)

        im.convert(args, function(err, stdout, stderr) {
            if(err)
                console.log('err in im conv : ', err)

            let outfile = fs.readFileSync(outputName)
           resolve(outfile)
        });
    })
    
}
exports.handler = fileProcesser

