/**Callback */

import { readFile } from 'node:fs';

readFile('./data.txt', "utf-8", (err, data) => {
    if(err) {
        console.error("Erreur: ", err)
        return;
    }
    console.log("Contenu du fichier: ", data)
})

/**Promises */

const wait = (ms) => new Promise((resolve) => {
    setTimeout(() => resolve(`Attendu ${ms}ms`), ms)
});


/**Async Await */

const run = async () => {
    console.log("Début")
    const result = await wait(1000)
    console.log(result)
    console.log("Fin")

}

run()


/**
 * Task 1: 5min
 * Task 2: 2min
 * Task 3: dépend de Task 2 et dure 3min
 * 
 * Task 1 se fait en même temps que Task 2 et Task 3 attend que Task 2 soit fini pour s'exécuter
 */