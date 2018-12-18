# Javascript client side storage

Javascript APIs that allow you to store data on client side
- ~~Cookies~~ : _Will be deprecated soon in all the browsers_
- Web Storage _(simple)_ : 
    - LocalStorage : Supports both JSON datatype / strings
    - SessionStorage : Supports both JSON datatype / strings
- Web Storage _(complex)_ :
    -  IndexedDB : which is a complete database with support for images and videos, allows you to do complex queries and supports all kinds of types of data
- Service Workers _(offline)_
- Cache API : 

# Local Storage

The following keywords are for CRUD operations of `localStorage`

```js
localStorage.setItem('name','Pramod'); // Will set the local storage key value pair
localStorage.getItem('name'); // Will retrieve a stored value
localStorage.removeItem('name'); //Will delete the key value pair
```

# Session Storage

Just like Local-storage, `Session-storage` follows similar syntax.

```js
sessionStorage.setItem('name','Pramod'); // Will set the session storage key value pair
sessionStorage.getItem('name'); // Will retrieve a stored value
sessionStorage.removeItem('name'); //Will delete the key value pair
```

### When to use one over another ?

| `LocalStorage` | `SessionStorage` |
|:--------------|-------------:|
| 1. Local Storage persists data until removed using script | 1. Session storage persists data until browser is closed |
| 2. When working with shopping cart (with timers) | 2. Shopping cart (temporary) |
| 3. Nonprivacy related info like - name, site (preferences) | 3. Use Session storage when the privacy of the user is a concern |
| | 4. Temporary information |

---

# Indexed DB

Indexed DB is literally a full database available on the client side.

### Pros
- Bit more complex than Web Storage _(ie., localStorage / sessionStorage)_
- Able to store - Arrays, objects, videos, images
- Structured data indexed with a key
- Object oriented - Key/Value store
- Asynchronous _(to allow application operations)_

### Cons
- Can't sync with a server back-end Database
- At the mercy of the browser data wipeout
- No use if the browser is run in private / incognito mode
- At the mercy of browser limit / browser rules

---

## Setting up Indexed DB connection & Add Items

```js
let db; //setting up indexed DB
// This is the only way the index DB runs, on windows load.
window.onload = ()=>{
    let request = window.indexedDB.open('contacts',1);

    // If there were errors while creating the DB
    request.onerror = ()=>{
        console.log('DB failed to open');
    };

    // If the DB was created successfully
    request.onsuccess = ()=>{
        console.log('DB created successfully');
        db = request.result; // Passing the database reference first time
    };

    // Lifecycle which runs only once - first time the DB was created
    // It will run again if the DB was destroyed and the application runs again
    request.onupgradeneeded = (e)=>{
        db = e.target.result; // Passing the database reference once again

        // Create a objectStore / table with Primary key as Id
        let objectStore = db.createObjectStore('contacts', {keyPath: 'id', autoIncrement: true});

        // Create a schema / column definition for the table
        objectStore.createIndex('firstName','firstName',{unique:false}); // column #1
        objectStore.createIndex('lastName','lastName',{unique:false}); //column #2

        // Create a model first
        let newItem = {firstName: 'Pramod', lastName: 'Jingade'};

        // Create a transaction
        let transaction = db.transaction(['contacts'], 'readwrite');

        // Create a objectstore
        objectStore = transaction.objectStore('contacts');

        // Create a request - Add Item
        let request = objectStore.add(newItem);

        // Checking if add item as was successful
        request.onsuccess = ()=>{
            console.log('DB was added successfully');
            newItem = {firstName: '', lastName: ''};
        }

        // Closing the transaction
        transaction.oncomplete = () => {
            console.log('Transaction completed on the database');
        }

        transaction.onerror = () => {
            console.log('Error while performing transaction');
        }

        console.log('Database created successfully');
    };

};
```
## Retrieving Added Items

```js

function displayData() {
    // Get the reference to the indexedDB 
let objectStore = db.transaction('contacts').objectStore('contacts');

// to Read from the DB we need a cursor / pointer / iterator
objectStore.openCursor().onsuccess = (e)=>{
    let cursor = e.target.result;

    if(cursor) {
        console.log('PK of the record is: ', cursor.value.id);
        console.log('First name is: ', cursor.value.firstName);
        console.log('Last name is: ', cursor.value.lastName);
        cursor.continue(); // Iterates through the next record
    } else {
        console.log('Sorry, DB is empty!');
    }
}
}
```

Now `displayData()`  function can be called in two places

- `request.onsuccess()` - Whenever the connection to the DB is successful OR
- `transaction.oncomplete()` - Whenever we add new record to the DB
