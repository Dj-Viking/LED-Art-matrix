/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IGif } from "../types";
export type IDBRequestMethod = "put" | "getAll" | "delete" | "deleteAll";
class LocalGifHelper {
    /**
     * inaccessible
     */
    #storeName: string;
    /**
     * inaccessible
     */
    #dbName: string;
    private version = 1;

    public constructor(_dbName: string, _storeName: string) {
        this.#dbName = _dbName;
        this.#storeName = _storeName;
        this.#initializeHelper();
    }

    #initializeHelper(): void {
        // open a connection to the database `led-matrix` with
        // the version of 1
        this.#openConnection().then((request) => {
            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                console.info("on upgrade needed called with new version change", event);

                let tempDb = request!.result;

                tempDb.createObjectStore(this.#storeName, { keyPath: "_id" as keyof IGif });
            };
            request.onerror = (event: Event) => {
                console.error("an error occurred during the open request", event);
            };
            request.onsuccess = (event: Event) => {
                console.info("indexed db open request succeeded", event);
                // start saving references to the database to the `db` variable
                const tempDb = request!.result;

                // open a transaction to whatever we pass into `storeName`
                // must match one of the object store names in this promise
                const tempTransaction = tempDb.transaction(this.#storeName, "readwrite");

                // save a reference to that object store that we passed as
                // the storename string
                tempTransaction.objectStore(this.#storeName);

                tempDb.onerror = (event: Event) => {
                    console.error("An error occurred during the onsuccess callback", event);
                };

                tempTransaction.oncomplete = (event: Event) => {
                    console.info("transaction complete - closing idb connection", event);
                    tempDb?.close();
                };
            };
        });
    }

    async #openConnection(): Promise<IDBOpenDBRequest> {
        console.info("opening connection for a transaction to idb");
        return new Promise((res) => {
            res(window.indexedDB.open(this.#dbName, this.version));
        });
    }

    #openStore(reqResult: IDBRequest): Promise<[IDBObjectStore, IDBTransaction]> {
        console.info("indexed db open request succeeded");
        return new Promise((res) => {
            // start saving references to the database to the `db` variable
            const tempDb = reqResult.result;

            // open a transaction to whatever we pass into `storeName`
            // must match one of the object store names in this promise
            const tempTransaction = tempDb.transaction(this.#storeName, "readwrite");

            // save a reference to that object store that we passed as
            // the storename string
            const store = tempTransaction.objectStore(this.#storeName);

            res([store, tempTransaction]);
        });
    }

    public async handleRequest(method: IDBRequestMethod, gif?: IGif): Promise<void | IGif[]> {
        return new Promise<void | IGif[]>((resolve) => {
            this.#openConnection().then((request) => {
                request.onsuccess = () => {
                    this.#openStore(request).then(([store, transaction]) => {
                        let gifsRequest: IDBRequest<IGif[]>;

                        switch (method) {
                            case "deleteAll":
                                gifsRequest = store.getAll() as IDBRequest<IGif[]>;
                                gifsRequest.onsuccess = () => {
                                    if (gifsRequest.result.length > 0) {
                                        store.clear();
                                    }
                                    resolve();
                                };
                                break;
                            case "put":
                                store.put(gif);
                                resolve();
                                break;
                            case "getAll":
                                gifsRequest = store.getAll() as IDBRequest<IGif[]>;
                                gifsRequest.onsuccess = () => {
                                    const gifs = gifsRequest.result as IGif[];
                                    resolve(gifs);
                                };
                                break;
                            case "delete":
                                if (!gif) {
                                    throw new Error(
                                        "cannot delete a gif without passing a gif object to the class \n usage: class.handleRequest('delete', gif);"
                                    );
                                }
                                store.delete(gif!._id);
                                resolve();
                                break;
                            default:
                                break;
                        }

                        transaction.oncomplete = () => {
                            console.info("transaction complete");
                        };
                    });
                };
            });
        });
    }
}

const localGifHelper = new LocalGifHelper("led-matrix", "gifs");

export { localGifHelper };