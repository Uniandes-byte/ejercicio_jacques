async function loadJacques() {
    const response = await fetch("https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json");
    const data = await response.json();
    return data;
}

async function correlacionArdilla() {
    const ardillaPromise = loadJacques();
    let eventsArdillas = {}
    let totalEvents = []
    let mcc = {}
    let mccList = []
    const ardillas = await ardillaPromise;
    for (let i = 0; i < ardillas.length; i++) {
        for (let j = 0; j < ardillas[i]["events"].length; j++) {
            if (!(totalEvents.includes(ardillas[i]["events"][j]))) {
                totalEvents.push(ardillas[i]["events"][j]);
                eventsArdillas[ardillas[i]["events"][j]] = { "TP": 0, "FP": 0, "FN": 0, "TN": 0 };
            }
        }
    }
    for (let i_1 = 0; i_1 < ardillas.length; i_1++) {
        for (let j_1 = 0; j_1 < totalEvents.length; j_1++) {
            if (ardillas[i_1]["events"].includes(totalEvents[j_1])) {
                if (ardillas[i_1]["squirrel"] == true) {
                    eventsArdillas[totalEvents[j_1]]["TP"] += 1;
                }
                else {
                    eventsArdillas[totalEvents[j_1]]["FN"] += 1;
                }
            }
            else {
                if (ardillas[i_1]["squirrel"] == true) {
                    eventsArdillas[totalEvents[j_1]]["FP"] += 1;
                }
                else {
                    eventsArdillas[totalEvents[j_1]]["TN"] += 1;
                }
            }
        }
    }
    let keys = Object.keys(eventsArdillas);
    keys.forEach(key => {
        let TP = eventsArdillas[key]["TP"];
        let FP = eventsArdillas[key]["FP"];
        let FN = eventsArdillas[key]["FN"];
        let TN = eventsArdillas[key]["TN"];
        let mccValue = (TP * TN - FP * FN) / Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN));
        mcc[key] = mccValue;
    });
    //Organizar en lista de objetos
    for (let key_1 in mcc) {
        let correlacionObjeto = { "event": key_1, "correlation": mcc[key_1] };
        mccList.push(correlacionObjeto);
    }
    mccList.sort((a, b) => b.correlation - a.correlation);
    return mccList;
}

const main = async () => {
    const result = await correlacionArdilla();
    console.log(result);
}

main();