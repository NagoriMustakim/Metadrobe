const express = require("express");
const serverless = require('serverless-http')
const { metadrobeWomenHelper } = require("./helperStuff");
const { metadrobeMenHelper } = require("./menhelperStuff");
const { singularHelpWomen } = require("./womensingularHelper");
const { singularHelpMen } = require("./mensingularHelper");
const app = express();
const womenCollection = "metawardrobe-virtual-womens-fashion";
const menCollection = "metawardrobe-virtual-mens-fashion";


app.get("/", (req, res) => {
    res.send("HELLO API");

});

const router = express.Router();

router.get(
    "/registry/:collectionName/address/:address/assets/:id",
    async (req, res) => {
        const { address, id, collectionName } = req.params;
        try {
            if (collectionName === womenCollection) {
                const toSend = await singularHelpWomen(id, womenCollection);
                res.send(JSON.stringify(toSend));
            } else if (collectionName === menCollection) {
                const toSend = await singularHelpMen(id, menCollection);
                res.send(JSON.stringify(toSend));
            } else {
                res.send(
                    JSON.stringify({
                        address: "0xe9d35942278ba84303954d18fc91fd7166e70c3b",
                        amount: 0,
                        urn: {
                            decentraland: "",
                        },
                    })
                );
            }
        } catch (err) {
            console.error(err);
            res.send(
                JSON.stringify({
                    address: "0xe9d35942278ba84303954d18fc91fd7166e70c3b",
                    amount: 0,
                    urn: {
                        decentraland: "",
                    },
                })
            );
        }



    }
);




router.get(
    "/registry/:collectionMeme/address/:address/assets",
    async (req, res) => {
        const { address, collectionMeme } = req.params;
        try {
            if (womenCollection === collectionMeme) {
                const toSend = await metadrobeWomenHelper(address, womenCollection);
                res.send(JSON.stringify(toSend));
            } else if (menCollection === collectionMeme) {
                const toSend = await metadrobeMenHelper(address, menCollection);
                res.send(JSON.stringify(toSend));
            } else {
                res.send(
                    JSON.stringify({
                        address: address,
                        assets: [],
                        total: 0,
                        page: 1,
                        next: "",
                    })
                );
            }
        } catch (err) {
            console.error(err);
            res.send(
                JSON.stringify({
                    address: address,
                    assets: [],
                    total: 0,
                    page: 1,
                    next: "",
                })
            );
        }

    }
);






app.use(`/.netlify/functions/api`, router);

//for local server
// app.listen(4000, () => {
//     console.log(`[server]: Server is running at http://localhost:${4000}`);
// });


// Export the app and the serverless function
module.exports = app;
module.exports.handler = serverless(app);
