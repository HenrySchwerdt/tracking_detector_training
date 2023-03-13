const funker = require('funker');
const express = require('express');
var Minio = require('minio')


const app = express();


app.get("/", (req, res) => {
    funker.call("training", {x: 3,y: 5}, (err, res) => {
        console.log(err, res);
    })
    res.send("Hello World");
})

// app.get("/test", (req, res) => {
//     var minioClient = new Minio.Client({
//         endPoint: 'minio',
//         port: 9000,
//         useSSL: false,
//         accessKey: 'trackingDetector',
//         secretKey: 'Strong#Pass#2022'
//     });

//     minioClient.makeBucket("training", "eu-central-1", (err) => {
//         if (err) {
//             console.log("error");
//         }
//         minioClient.putObject("training", "Test.txt", "Hello World",(err, res) => {
//             console.log(err, res)
//         });
//     })

//     res.send("Bucket test")

// })

app.get("/static/:bucket/:fileName", (req, res) => {
    var minioClient = new Minio.Client({
                endPoint: 'minio',
                port: 9000,
                useSSL: false,
                accessKey: 'trackingDetector',
                secretKey: 'Strong#Pass#2022'
            });
    minioClient.getObject(req.params.bucket, req.params.fileName, (err, result) => {
        let data = ""
        if (err) {
            res.send("Error")
          }
          result.on('data', function(chunk) {
            data += chunk
          })
          result.on('end', function() {
            res.send(data)
          })
          result.on('error', function(err) {
            res.send("Error")
          })
    })
        
            // minioClient.makeBucket("training", "eu-central-1", (err) => {
            //     if (err) {
            //         console.log("error");
            //     }
            //     minioClient.putObject("training", "Test.txt", "Hello World",(err, res) => {
            //         console.log(err, res)
            //     });
            // })
        
})

app.listen(3000, () => {
    console.log("Server running");
})
