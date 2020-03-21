const json = require('./mock.json');
const fse = require('fs-extra');
const util = require('util');
const path = require('path');
const scriptExecutionOutFolder = path.join(process.cwd(), "output");
const _fileNameTemplate = "%s.json";
var admin = require("firebase-admin");
var serviceAccount = require("./key/admin-key.json");

var result = [];

//mock data from https://www.mockaroo.com/
function parseData() {
    for (var i = 0; i < json.length; i++) {
        var obj = json[i];
        var r =
        {
            "id": obj.id,
            "name": obj.name,
            "surName": obj.surName,
            "address": obj.address,
            "phone": obj.phone,
            "skypeId": obj.skypeId,
            "position": {
                "lat": obj.lat,
                "lng": obj.lng

            },

            "photoURL": obj.photoURL,
            "isHelper": true,
            "capabilities": [
                {
                    "available": obj.Food,
                    "type": "food"
                },
                {
                    "available": obj.Company,
                    "type": "company"
                },
                {
                    "available": obj.Mail,
                    "type": "mail"
                },
                {
                    "available": obj.Pharmacy,
                    "type": "pharmacy"
                },
            ]
        };
        result.push(r);
    }
}

function writeToFile() {
    try {
        if (!fse.existsSync(scriptExecutionOutFolder)) {
            fse.mkdirSync(scriptExecutionOutFolder);
        }
        const fileName = util.format(_fileNameTemplate, "mock");
        const fullFilePath = path.join(scriptExecutionOutFolder, fileName);
        fse.writeFileSync(fullFilePath, JSON.stringify(result, null, "\t"), {
            flag: 'a'
        });
    } catch (error) {
        console.error("Exception occurred while saving execution res: " + error.message);
        process.exit(1);
    }
}

function pushToFirebase() {
    //parseData();
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://okja-e6a08.firebaseio.com"
    });

    for (var i = 0; i < result.length; i++) {
        admin
            .firestore()
            .collection("active_profiles")
            .add(result[i])
            .then(createdProduct => {
                console.log("Successfully created new user_profiles:", createdProduct.id);
            })
            .catch(error => {
                console.log("Error creating test user_profiles:", error);
                process.exit(1);
            });
    }
}

parseData();
writeToFile();
pushToFirebase();
