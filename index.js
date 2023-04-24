const protocol = "http";
const DAPR_HOST = "localhost";
const port = 3500;
const DAPR_STATE_STORE_NAME = 'statestore';
const stateStoreBaseUrl = `${protocol}://${DAPR_HOST}:${port}/v1.0/state/${DAPR_STATE_STORE_NAME}`;
const orderId = 257;

function _start() {
    let r =
        router.post(
            router.get(router.new(),
                "/get/order", "handle_get"),
            "/post/order", "handle_post");

    console.log("Server listening on port 3000...");
    let s = server.serve("0.0.0.0:3000", r);
}

function handle_get(req) {
    console.log("I just got a request @ uri: ", req.uri, ", w/ method: ", req.method);
    let res = http_client.request(
        {
            method: "GET",
            uri: `${stateStoreBaseUrl}/${orderId}`,
            headers: {
                "Content-Type": "application/json",
                "dapr-app-id": "slightjs-dapr-poc"
            },
            body: null,
            params: []
        }
    );
    console.log("Retrieved item from statestore...");

    return JSON.stringify(
        {
            headers: null,
            body: JSON.stringify(res),
            status: 200
        }
    );
}

function handle_post(req) {
    console.log("I just got a request @ uri: ", req.uri, ", w/ method: ", req.method);
    const orders = [{
        key: `${orderId}`,
        value: { orderId: orderId }
    }];

    console.log(http_client.request(
        {
            method: "POST",
            uri: `${stateStoreBaseUrl}`,
            headers: {
                "dapr-app-id": "slightjs-dapr-poc"
            },
            body: JSON.stringify(orders),
            params: []
        }
    ));
    console.log("Saved item to statestore...");

    return JSON.stringify(
        {
            headers: null,
            body: null,
            status: 200
        }
    );
}
