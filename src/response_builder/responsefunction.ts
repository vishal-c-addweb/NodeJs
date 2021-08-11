
//Generic function for success message
export function success<T>(meta: object,data : object) {
    let response : object= {meta,data} ;
    return response;
}

//Generic function for error message
export function error<T>(meta: object) {
    let response : object= {meta} ;
    return response;
}