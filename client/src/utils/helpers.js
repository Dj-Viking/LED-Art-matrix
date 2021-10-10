/**
 * 
 * @param {Number} _min 
 * @param {Number} _max 
 * @returns {Number} random number between the range given between min and max
 */
export function getRandomIntLimit(_min, _max) {
  let min = Math.ceil(_min);
  let max = Math.floor(_max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

/**
 * 
 * @param {String} storeName a string to match against to choose which object store to select you want to place an action on
 * @param {String} method a string to match against to determine which action to perform on the selected storeName
 * @param {{[key: string]: any}} object for put and delete static actions: Some object we pass in to manipulate in or out of the object store
 */
export function idbPromise(storeName, method, object) {
  return new Promise ((resolve, reject) => {
    //open a connection to the database `led-matrix` with
    // the version of 1
    const request = window.indexedDB.open('led-matrix', 1);

    //initialize the variables we want to use to reference
    // different methods with different names i guess? once we get them
    // from the original api and rename them...thats why I think we do this.
    let db, transaction, store;
    
    // if version has changed or if this is the first time using
    // the database, run this method and create your object stores for your
    // project

    //basically we set the value of the request property method which was the request
    // to open an indexedDB place of memory with the name and version
    request.onupgradeneeded = function(event) {
      const db = request.result;
      //create the object store for each type of data and set 
      //"primary" key index to be the `_id` of the data
      db.createObjectStore('presets', { keyPath: '_id' });
      db.createObjectStore('gifs', { keyPath: '_id' });
      db.createObjectStore('defaultPreset', { keyPath: '_id' })
    };
    //if any errors happened while connecting to idb
    request.onerror = (event) => {
      console.log(event);
      console.log('error creating object store for idb...');
    }



    //on database creation success
    /// set the value of the .onsuccess() method to
    // the value of a function that executes some other code
    request.onsuccess = (event) => {
      //start saving references to the database to the `db` variable
      db = request.result;

      //open a transaction to whatever we pass into `storeName`
      // must match one of the object store names in this promise
      transaction = db.transaction(storeName, 'readwrite');

      //save a reference to that object store that we passed as 
      // the storename string
      store = transaction.objectStore(storeName);

      //if error
      db.onerror = (error) => {
        console.log('there was an error on success instance method upon execution', error);
      };

      //now we try to resolve the promise object to be returned
      // by this function and the action/method string
      // that we want to match against...hmm looks like redux a bit

      switch(method) {
        case 'put': 
          store.put(object);
          resolve(object);
        break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = () => {
            return resolve(all.result);
          };
        break;
        case 'delete':
          //console.log('object passed into delete action');
          //console.log(object);
          store.delete(object._id);
        break;
        default: 
          all.onerror = () => {
            console.log('Not a valid method passed into the function executing this code...')
          };
        break;
      }
      //when transaction withe the indexedDB is complete
      // close the connection
      transaction.oncomplete = function() {
        db.close();
      };
    };
  });
}