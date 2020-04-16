const db = require('../data/data-config.js'); 

module.exports = {
    find, 
    findById, 
    findSteps, 
    add, 
    update, 
    remove, 
}

function find(){ 
    return db("schemes")    
    // -   Calling find returns a promise that resolves to an array of all schemes in the database.
    // -   No steps are included.
}

function findById(id){
//     -   `findById(id)`:
//     -   Expects a scheme `id` as its only parameter.
//     -   Resolve to a single scheme object.
//     -   On an invalid `id`, resolves to `null`.
    return db("schemes")
    .select("*")
    .where({ id })
    .then(response => {
        if(response.length){
            return response; 
        } else { 
            return null; 
        }
    })
}

function findSteps(id){
//     -   `findSteps(id)`:
//     -   Expects a scheme `id`.
//     -   Resolves to an array of all correctly ordered step for the given scheme: `[ { id: 17, scheme_name: 'Find the Holy Grail', step_number: 1, instructions: 'quest'}, { id: 18, scheme_name: 'Find the Holy Grail', step_number: 2, instructions: '...and quest'}, etc. ]`.
//     -   This array should include the `scheme_name` _not_ the `scheme_id`.

    return db("steps")
        .join('schemes', 'steps.scheme_id', 'schemes.id')
        .where({ scheme_id: id })
        .select('steps.id', 'schemes.scheme_name', 'steps.step_number', 'steps.instructions')
}

function add(scheme){
//     -   `add(scheme)`:
//     -   Expects a scheme object.
//     -   Inserts scheme into the database.
//     -   Resolves to the newly inserted scheme, including `id`.
    return db("schemes")
        .insert(scheme)
        // .then(id => {
        //     return db("schemes")
        //         .select("*")    
        //         .where({ id })
        // })
}

function update(changes, id){
//     -   `update(changes, id)`:
//     -   Expects a changes object and an `id`.
//     -   Updates the scheme with the given id.
//     -   Resolves to the newly updated scheme object.
    return  db("schemes")
    .where({ id })
    .update(changes)
    .then(response => {
        return db("schemes")
                .where({ id }).select().first()
    })
}

function remove(id){
//     -   `remove(id)`:
//     -   Removes the scheme object with the provided id.
//     -   Resolves to the removed scheme
//     -   Resolves to `null` on an invalid id.
//     -   (Hint: Only worry about removing the `scheme`. The database is configured to automatically remove all associated steps.)
    return db("schemes")
    .where({ id })    
    .select("*").first().then(response => {
        if(response){
            return db("schemes")
            .where({ id })
            .del()
            .then(deletee => {
                return response; 
            })
        } else {
            return null; 
        }
    })
}