function makeFailedResponse(res, code, message) {
    const status = code === 500 ? 'error' : 'fail';
    return res.status(code).send({
        status,
        message,
    });
}

function makeSuccessResponse(res, code, message) {
    const response = {
        status: 'success',
        message,
    };
    return res.status(code).send(response);
}

function makeSuccessResponseWithData(res, code, data, message) {
    const response = {
        status: 'success',
    };
    if (message) response.message = message;
    response.data = data;
    return res.status(code).send(response);
}

module.exports = { makeFailedResponse, makeSuccessResponse, makeSuccessResponseWithData };
