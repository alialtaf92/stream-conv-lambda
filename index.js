const fs = require('fs')
require('dotenv').config()
const errorHandler = require('./errorHandler')
const globalConstants = require('./globalConstants')
var path = require('path')
var im = require('imagemagick')
 
let fileProcesser = async (event) => {
    console.log('event started')
    let response = {}
    try {

        if (!event || !event.inputName || !event.outputName || !event.file || !event.imageArguments) {
            let err = errorHandler.setParamsValidationError(event, 'inputName', 'outputName', 'file', 'imageArguments')
            response = err
            return response
        } else {
            let supportedFormats = ['.png', '.jpg']
            let inputFileExtension = path.extname(event.inputName).toLowerCase()
            let outputFileExtension = path.extname(event.outputName).toLowerCase()
            var base64Data = event.file.replace(/^data:image\/png;base64,/, "");

            fs.writeFileSync('/tmp/' + event.inputName, base64Data, globalConstants.STRING_FORMATS.BASE64)

            if(_.includes(supportedFormats, inputFileExtension) && _.includes(supportedFormats, outputFileExtension)) {
                let data = await convertAndUploadImage(event.inputname, event.outputname, event.imageArguments)
                response.data = data
            }
        }
        
        response.statusCode = 200
        return response
    } catch (err) {
        console.log('err is at end is : ', err)
        response = {
            statusCode: 500,
            body: JSON.stringify('An error occurred ' + err.message),
        };
        return response
    }
};

function convertAndUploadImage (filename, outputName, args)
{
    
    return Promise((resolve, reject) => {
        args.unshift('/tmp/' + filename)
        args.push('/tmp/' + outputName)

        im.convert(args, function(err, stdout, stderr) {
            if(err)
                console.log('err in im conv : ', err)

            let outfile = fs.readFileSync('/tmp/' + outputName)
           resolve(outfile)
        });
    })
    
}
exports.handler = fileProcesser

