/** Generic function for success & error message */
export function success<T>(meta: object,data : object) {
    let response : object= {meta,data} ;
    return response;
}

export function error<T>(meta: object,data: object) {
    let response : object= {meta,data} ;
    return response;
}

export const dataArray: object = {};