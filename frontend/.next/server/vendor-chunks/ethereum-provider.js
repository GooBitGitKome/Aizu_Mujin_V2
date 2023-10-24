"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/ethereum-provider";
exports.ids = ["vendor-chunks/ethereum-provider"];
exports.modules = {

/***/ "(ssr)/./node_modules/ethereum-provider/dist/index.js":
/*!******************************************************!*\
  !*** ./node_modules/ethereum-provider/dist/index.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst events_1 = __importDefault(__webpack_require__(/*! events */ \"events\"));\nconst payload_1 = __webpack_require__(/*! ./payload */ \"(ssr)/./node_modules/ethereum-provider/dist/payload.js\");\nclass Provider extends events_1.default {\n    constructor(connection) {\n        super();\n        this.promises = {};\n        this.attemptedSubscriptions = new Set();\n        this.subscriptions = [];\n        this.checkConnectionRunning = false;\n        this.nextId = 1;\n        this.connected = false;\n        this.accounts = [];\n        this.selectedAddress = undefined;\n        this.coinbase = undefined;\n        this.enable = this.enable.bind(this);\n        this.doSend = this.doSend.bind(this);\n        this.send = this.send.bind(this);\n        this.sendBatch = this.sendBatch.bind(this);\n        this.subscribe = this.subscribe.bind(this);\n        this.unsubscribe = this.unsubscribe.bind(this);\n        this.resumeSubscriptions = this.resumeSubscriptions.bind(this);\n        this.sendAsync = this.sendAsync.bind(this);\n        this.sendAsyncBatch = this.sendAsyncBatch.bind(this);\n        this.isConnected = this.isConnected.bind(this);\n        this.close = this.close.bind(this);\n        this.request = this.request.bind(this);\n        this.connection = connection;\n        this.on('connect', this.resumeSubscriptions);\n        this.connection.on('connect', () => this.checkConnection(1000));\n        this.connection.on('close', () => {\n            this.connected = false;\n            this.attemptedSubscriptions.clear();\n            this.emit('close');\n            this.emit('disconnect');\n        });\n        this.connection.on('payload', payload => {\n            const { id, method, error, result } = payload;\n            if (typeof id !== 'undefined') {\n                if (this.promises[id]) { // Fulfill promise\n                    const requestMethod = this.promises[id].method;\n                    if (requestMethod && ['eth_accounts', 'eth_requestAccounts'].includes(requestMethod)) {\n                        const accounts = result || [];\n                        this.accounts = accounts;\n                        this.selectedAddress = accounts[0];\n                        this.coinbase = accounts[0];\n                    }\n                    payload.error ? this.promises[id].reject(error) : this.promises[id].resolve(result);\n                    delete this.promises[id];\n                }\n            }\n            else if (method && method.indexOf('_subscription') > -1) { // Emit subscription result\n                // Events: connect, disconnect, chainChanged, chainsChanged, accountsChanged, assetsChanged, message\n                this.emit(payload.params.subscription, payload.params.result);\n                this.emit(method, payload.params); // Older EIP-1193\n                this.emit('message', {\n                    type: payload.method,\n                    data: {\n                        subscription: payload.params.subscription,\n                        result: payload.params.result\n                    }\n                });\n                this.emit('data', payload); // Backwards Compatibility\n            }\n        });\n        this.on('newListener', event => {\n            if (Object.keys(this.eventHandlers).includes(event)) {\n                if (!this.attemptedSubscription(event) && this.connected) {\n                    this.startSubscription(event);\n                    if (event === 'networkChanged') {\n                        console.warn('The networkChanged event is being deprecated, use chainChanged instead');\n                    }\n                }\n            }\n        });\n        this.eventHandlers = {\n            networkChanged: netId => {\n                this.networkVersion = (typeof netId === 'string') ? parseInt(netId) : netId;\n                this.emit('networkChanged', this.networkVersion);\n            },\n            chainChanged: chainId => {\n                this.providerChainId = chainId;\n                if (!this.manualChainId) {\n                    this.emit('chainChanged', chainId);\n                }\n            },\n            chainsChanged: chains => {\n                this.emit('chainsChanged', chains);\n            },\n            accountsChanged: (accounts) => {\n                this.selectedAddress = accounts[0];\n                this.emit('accountsChanged', accounts);\n            },\n            assetsChanged: assets => {\n                this.emit('assetsChanged', assets);\n            }\n        };\n    }\n    get chainId() {\n        return this.manualChainId || this.providerChainId;\n    }\n    async checkConnection(retryTimeout = 4000) {\n        if (this.checkConnectionRunning || this.connected)\n            return;\n        clearTimeout(this.checkConnectionTimer);\n        this.checkConnectionTimer = undefined;\n        this.checkConnectionRunning = true;\n        try {\n            this.networkVersion = await this.doSend('net_version', [], undefined, false);\n            this.providerChainId = await this.doSend('eth_chainId', [], undefined, false);\n            this.connected = true;\n        }\n        catch (e) {\n            this.checkConnectionTimer = setTimeout(() => this.checkConnection(), retryTimeout);\n            this.connected = false;\n        }\n        finally {\n            this.checkConnectionRunning = false;\n            if (this.connected) {\n                this.emit('connect', { chainId: this.providerChainId });\n            }\n        }\n    }\n    attemptedSubscription(event) {\n        return this.attemptedSubscriptions.has(event);\n    }\n    setSubscriptionAttempted(event) {\n        this.attemptedSubscriptions.add(event);\n    }\n    async startSubscription(event) {\n        console.debug(`starting subscription for ${event} events`);\n        this.setSubscriptionAttempted(event);\n        try {\n            const eventId = await (this.subscribe('eth_subscribe', event));\n            this.on(eventId, this.eventHandlers[event]);\n        }\n        catch (e) {\n            console.warn(`Unable to subscribe to ${event}`, e);\n        }\n    }\n    resumeSubscriptions() {\n        Object.keys(this.eventHandlers).forEach(event => {\n            if (this.listenerCount(event) && !this.attemptedSubscription(event))\n                this.startSubscription(event);\n        });\n    }\n    async enable() {\n        const accounts = await this.doSend('eth_accounts');\n        if (accounts.length > 0) {\n            this.accounts = accounts;\n            this.selectedAddress = accounts[0];\n            this.coinbase = accounts[0];\n            this.emit('enable');\n            return accounts;\n        }\n        else {\n            const err = new Error('User Denied Full Provider');\n            err.code = '4001';\n            throw err;\n        }\n    }\n    doSend(rawPayload, rawParams = [], targetChain = this.manualChainId, waitForConnection = true) {\n        const sendFn = (resolve, reject) => {\n            const method = (typeof rawPayload === 'object') ? rawPayload.method : rawPayload;\n            const params = (typeof rawPayload === 'object') ? rawPayload.params : rawParams;\n            const chainTarget = ((typeof rawPayload === 'object') && rawPayload.chainId) || targetChain;\n            if (!method) {\n                return reject(new Error('Method is not a valid string.'));\n            }\n            try {\n                const payload = (0, payload_1.create)(method, params, this.nextId++, chainTarget);\n                this.promises[payload.id] = {\n                    resolve: (result) => resolve(result),\n                    reject,\n                    method: payload.method\n                };\n                this.connection.send(payload);\n            }\n            catch (e) {\n                reject(e);\n            }\n        };\n        if (this.connected || !waitForConnection) {\n            return new Promise(sendFn);\n        }\n        return new Promise((resolve, reject) => {\n            const resolveSend = () => {\n                clearTimeout(disconnectTimer);\n                return resolve(new Promise(sendFn));\n            };\n            const disconnectTimer = setTimeout(() => {\n                this.off('connect', resolveSend);\n                reject(new Error('Not connected'));\n            }, 5000);\n            this.once('connect', resolveSend);\n        });\n    }\n    async send(methodOrPayload, callbackOrArgs) {\n        if (typeof methodOrPayload === 'string' &&\n            (!callbackOrArgs || Array.isArray(callbackOrArgs))) {\n            const params = callbackOrArgs;\n            return this.doSend(methodOrPayload, params);\n        }\n        if (methodOrPayload &&\n            typeof methodOrPayload === 'object' &&\n            typeof callbackOrArgs === 'function') {\n            // a callback was passed to send(), forward everything to sendAsync()\n            const cb = callbackOrArgs;\n            return this.sendAsync(methodOrPayload, cb);\n        }\n        return this.request(methodOrPayload);\n    }\n    sendBatch(requests) {\n        return Promise.all(requests.map(payload => {\n            return this.doSend(payload.method, payload.params);\n        }));\n    }\n    async subscribe(type, method, params = []) {\n        const id = await this.doSend(type, [method, ...params]);\n        this.subscriptions.push(id);\n        return id;\n    }\n    async unsubscribe(type, id) {\n        const success = await this.doSend(type, [id]);\n        if (success) {\n            this.subscriptions = this.subscriptions.filter(_id => _id !== id); // Remove subscription\n            this.removeAllListeners(id); // Remove listeners\n            return success;\n        }\n    }\n    async sendAsync(rawPayload, cb) {\n        if (!cb || typeof cb !== 'function')\n            return new Error('Invalid or undefined callback provided to sendAsync');\n        if (!rawPayload)\n            return cb(new Error('Invalid Payload'));\n        // sendAsync can be called with an array for batch requests used by web3.js 0.x\n        // this is not part of EIP-1193's backwards compatibility but we still want to support it\n        if (Array.isArray(rawPayload)) {\n            const payloads = rawPayload.map(p => ({ ...p, jsonrpc: '2.0' }));\n            const callback = cb;\n            return this.sendAsyncBatch(payloads, callback);\n        }\n        else {\n            const payload = { ...rawPayload, jsonrpc: '2.0' };\n            const callback = cb;\n            try {\n                const result = await this.doSend(payload.method, payload.params);\n                callback(null, { id: payload.id, jsonrpc: payload.jsonrpc, result });\n            }\n            catch (e) {\n                callback(e);\n            }\n        }\n    }\n    async sendAsyncBatch(payloads, cb) {\n        try {\n            const results = await this.sendBatch(payloads);\n            const result = results.map((entry, index) => {\n                return { id: payloads[index].id, jsonrpc: payloads[index].jsonrpc, result: entry };\n            });\n            cb(null, result);\n        }\n        catch (e) {\n            cb(e);\n        }\n    }\n    isConnected() {\n        return this.connected;\n    }\n    close() {\n        if (this.connection && this.connection.close)\n            this.connection.close();\n        this.off('connect', this.resumeSubscriptions);\n        this.connected = false;\n        const error = new Error('Provider closed, subscription lost, please subscribe again.');\n        this.subscriptions.forEach(id => this.emit(id, error)); // Send Error objects to any open subscriptions\n        this.subscriptions = []; // Clear subscriptions\n        this.manualChainId = undefined;\n        this.providerChainId = undefined;\n        this.networkVersion = undefined;\n        this.selectedAddress = undefined;\n        this.coinbase = undefined;\n    }\n    async request(payload) {\n        return this.doSend(payload.method, payload.params, payload.chainId);\n    }\n    setChain(chainId) {\n        if (typeof chainId === 'number')\n            chainId = '0x' + chainId.toString(16);\n        const chainChanged = (chainId !== this.chainId);\n        this.manualChainId = chainId;\n        if (chainChanged) {\n            this.emit('chainChanged', this.chainId);\n        }\n    }\n}\nexports[\"default\"] = Provider;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZXRoZXJldW0tcHJvdmlkZXIvZGlzdC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBYTtBQUNiO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGlDQUFpQyxtQkFBTyxDQUFDLHNCQUFRO0FBQ2pELGtCQUFrQixtQkFBTyxDQUFDLHlFQUFXO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxvQkFBb0IsNEJBQTRCO0FBQ2hEO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1RUFBdUU7QUFDdkU7QUFDQTtBQUNBLG1EQUFtRDtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsNENBQTRDO0FBQzVDO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsK0JBQStCO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELE9BQU87QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELE1BQU07QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRUFBK0U7QUFDL0UseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0Qsc0JBQXNCO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxrREFBa0Q7QUFDbkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdFQUFnRTtBQUNoRSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBZSIsInNvdXJjZXMiOlsid2VicGFjazovL2Zyb250ZW5kLy4vbm9kZV9tb2R1bGVzL2V0aGVyZXVtLXByb3ZpZGVyL2Rpc3QvaW5kZXguanM/OWNiMCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGV2ZW50c18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJldmVudHNcIikpO1xuY29uc3QgcGF5bG9hZF8xID0gcmVxdWlyZShcIi4vcGF5bG9hZFwiKTtcbmNsYXNzIFByb3ZpZGVyIGV4dGVuZHMgZXZlbnRzXzEuZGVmYXVsdCB7XG4gICAgY29uc3RydWN0b3IoY29ubmVjdGlvbikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnByb21pc2VzID0ge307XG4gICAgICAgIHRoaXMuYXR0ZW1wdGVkU3Vic2NyaXB0aW9ucyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gW107XG4gICAgICAgIHRoaXMuY2hlY2tDb25uZWN0aW9uUnVubmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLm5leHRJZCA9IDE7XG4gICAgICAgIHRoaXMuY29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYWNjb3VudHMgPSBbXTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEFkZHJlc3MgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuY29pbmJhc2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZW5hYmxlID0gdGhpcy5lbmFibGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5kb1NlbmQgPSB0aGlzLmRvU2VuZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnNlbmQgPSB0aGlzLnNlbmQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zZW5kQmF0Y2ggPSB0aGlzLnNlbmRCYXRjaC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnN1YnNjcmliZSA9IHRoaXMuc3Vic2NyaWJlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUgPSB0aGlzLnVuc3Vic2NyaWJlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucmVzdW1lU3Vic2NyaXB0aW9ucyA9IHRoaXMucmVzdW1lU3Vic2NyaXB0aW9ucy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnNlbmRBc3luYyA9IHRoaXMuc2VuZEFzeW5jLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc2VuZEFzeW5jQmF0Y2ggPSB0aGlzLnNlbmRBc3luY0JhdGNoLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0aGlzLmlzQ29ubmVjdGVkLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuY2xvc2UgPSB0aGlzLmNsb3NlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucmVxdWVzdCA9IHRoaXMucmVxdWVzdC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICAgICAgICB0aGlzLm9uKCdjb25uZWN0JywgdGhpcy5yZXN1bWVTdWJzY3JpcHRpb25zKTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLm9uKCdjb25uZWN0JywgKCkgPT4gdGhpcy5jaGVja0Nvbm5lY3Rpb24oMTAwMCkpO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24ub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYXR0ZW1wdGVkU3Vic2NyaXB0aW9ucy5jbGVhcigpO1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdjbG9zZScpO1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdkaXNjb25uZWN0Jyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24ub24oJ3BheWxvYWQnLCBwYXlsb2FkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgaWQsIG1ldGhvZCwgZXJyb3IsIHJlc3VsdCB9ID0gcGF5bG9hZDtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvbWlzZXNbaWRdKSB7IC8vIEZ1bGZpbGwgcHJvbWlzZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0TWV0aG9kID0gdGhpcy5wcm9taXNlc1tpZF0ubWV0aG9kO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdE1ldGhvZCAmJiBbJ2V0aF9hY2NvdW50cycsICdldGhfcmVxdWVzdEFjY291bnRzJ10uaW5jbHVkZXMocmVxdWVzdE1ldGhvZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjY291bnRzID0gcmVzdWx0IHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hY2NvdW50cyA9IGFjY291bnRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEFkZHJlc3MgPSBhY2NvdW50c1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29pbmJhc2UgPSBhY2NvdW50c1swXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkLmVycm9yID8gdGhpcy5wcm9taXNlc1tpZF0ucmVqZWN0KGVycm9yKSA6IHRoaXMucHJvbWlzZXNbaWRdLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMucHJvbWlzZXNbaWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1ldGhvZCAmJiBtZXRob2QuaW5kZXhPZignX3N1YnNjcmlwdGlvbicpID4gLTEpIHsgLy8gRW1pdCBzdWJzY3JpcHRpb24gcmVzdWx0XG4gICAgICAgICAgICAgICAgLy8gRXZlbnRzOiBjb25uZWN0LCBkaXNjb25uZWN0LCBjaGFpbkNoYW5nZWQsIGNoYWluc0NoYW5nZWQsIGFjY291bnRzQ2hhbmdlZCwgYXNzZXRzQ2hhbmdlZCwgbWVzc2FnZVxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChwYXlsb2FkLnBhcmFtcy5zdWJzY3JpcHRpb24sIHBheWxvYWQucGFyYW1zLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KG1ldGhvZCwgcGF5bG9hZC5wYXJhbXMpOyAvLyBPbGRlciBFSVAtMTE5M1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnbWVzc2FnZScsIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogcGF5bG9hZC5tZXRob2QsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbjogcGF5bG9hZC5wYXJhbXMuc3Vic2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBwYXlsb2FkLnBhcmFtcy5yZXN1bHRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZGF0YScsIHBheWxvYWQpOyAvLyBCYWNrd2FyZHMgQ29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbignbmV3TGlzdGVuZXInLCBldmVudCA9PiB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5ldmVudEhhbmRsZXJzKS5pbmNsdWRlcyhldmVudCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYXR0ZW1wdGVkU3Vic2NyaXB0aW9uKGV2ZW50KSAmJiB0aGlzLmNvbm5lY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0U3Vic2NyaXB0aW9uKGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50ID09PSAnbmV0d29ya0NoYW5nZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1RoZSBuZXR3b3JrQ2hhbmdlZCBldmVudCBpcyBiZWluZyBkZXByZWNhdGVkLCB1c2UgY2hhaW5DaGFuZ2VkIGluc3RlYWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVycyA9IHtcbiAgICAgICAgICAgIG5ldHdvcmtDaGFuZ2VkOiBuZXRJZCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXR3b3JrVmVyc2lvbiA9ICh0eXBlb2YgbmV0SWQgPT09ICdzdHJpbmcnKSA/IHBhcnNlSW50KG5ldElkKSA6IG5ldElkO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnbmV0d29ya0NoYW5nZWQnLCB0aGlzLm5ldHdvcmtWZXJzaW9uKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFpbkNoYW5nZWQ6IGNoYWluSWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvdmlkZXJDaGFpbklkID0gY2hhaW5JZDtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMubWFudWFsQ2hhaW5JZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2NoYWluQ2hhbmdlZCcsIGNoYWluSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFpbnNDaGFuZ2VkOiBjaGFpbnMgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnY2hhaW5zQ2hhbmdlZCcsIGNoYWlucyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWNjb3VudHNDaGFuZ2VkOiAoYWNjb3VudHMpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkQWRkcmVzcyA9IGFjY291bnRzWzBdO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnYWNjb3VudHNDaGFuZ2VkJywgYWNjb3VudHMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFzc2V0c0NoYW5nZWQ6IGFzc2V0cyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdhc3NldHNDaGFuZ2VkJywgYXNzZXRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgZ2V0IGNoYWluSWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hbnVhbENoYWluSWQgfHwgdGhpcy5wcm92aWRlckNoYWluSWQ7XG4gICAgfVxuICAgIGFzeW5jIGNoZWNrQ29ubmVjdGlvbihyZXRyeVRpbWVvdXQgPSA0MDAwKSB7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQ29ubmVjdGlvblJ1bm5pbmcgfHwgdGhpcy5jb25uZWN0ZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmNoZWNrQ29ubmVjdGlvblRpbWVyKTtcbiAgICAgICAgdGhpcy5jaGVja0Nvbm5lY3Rpb25UaW1lciA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5jaGVja0Nvbm5lY3Rpb25SdW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMubmV0d29ya1ZlcnNpb24gPSBhd2FpdCB0aGlzLmRvU2VuZCgnbmV0X3ZlcnNpb24nLCBbXSwgdW5kZWZpbmVkLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLnByb3ZpZGVyQ2hhaW5JZCA9IGF3YWl0IHRoaXMuZG9TZW5kKCdldGhfY2hhaW5JZCcsIFtdLCB1bmRlZmluZWQsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5jaGVja0Nvbm5lY3Rpb25UaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5jaGVja0Nvbm5lY3Rpb24oKSwgcmV0cnlUaW1lb3V0KTtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrQ29ubmVjdGlvblJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbm5lY3RlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnY29ubmVjdCcsIHsgY2hhaW5JZDogdGhpcy5wcm92aWRlckNoYWluSWQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXR0ZW1wdGVkU3Vic2NyaXB0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF0dGVtcHRlZFN1YnNjcmlwdGlvbnMuaGFzKGV2ZW50KTtcbiAgICB9XG4gICAgc2V0U3Vic2NyaXB0aW9uQXR0ZW1wdGVkKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuYXR0ZW1wdGVkU3Vic2NyaXB0aW9ucy5hZGQoZXZlbnQpO1xuICAgIH1cbiAgICBhc3luYyBzdGFydFN1YnNjcmlwdGlvbihldmVudCkge1xuICAgICAgICBjb25zb2xlLmRlYnVnKGBzdGFydGluZyBzdWJzY3JpcHRpb24gZm9yICR7ZXZlbnR9IGV2ZW50c2ApO1xuICAgICAgICB0aGlzLnNldFN1YnNjcmlwdGlvbkF0dGVtcHRlZChldmVudCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBldmVudElkID0gYXdhaXQgKHRoaXMuc3Vic2NyaWJlKCdldGhfc3Vic2NyaWJlJywgZXZlbnQpKTtcbiAgICAgICAgICAgIHRoaXMub24oZXZlbnRJZCwgdGhpcy5ldmVudEhhbmRsZXJzW2V2ZW50XSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgVW5hYmxlIHRvIHN1YnNjcmliZSB0byAke2V2ZW50fWAsIGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlc3VtZVN1YnNjcmlwdGlvbnMoKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuZXZlbnRIYW5kbGVycykuZm9yRWFjaChldmVudCA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5saXN0ZW5lckNvdW50KGV2ZW50KSAmJiAhdGhpcy5hdHRlbXB0ZWRTdWJzY3JpcHRpb24oZXZlbnQpKVxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRTdWJzY3JpcHRpb24oZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYXN5bmMgZW5hYmxlKCkge1xuICAgICAgICBjb25zdCBhY2NvdW50cyA9IGF3YWl0IHRoaXMuZG9TZW5kKCdldGhfYWNjb3VudHMnKTtcbiAgICAgICAgaWYgKGFjY291bnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuYWNjb3VudHMgPSBhY2NvdW50cztcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRBZGRyZXNzID0gYWNjb3VudHNbMF07XG4gICAgICAgICAgICB0aGlzLmNvaW5iYXNlID0gYWNjb3VudHNbMF07XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2VuYWJsZScpO1xuICAgICAgICAgICAgcmV0dXJuIGFjY291bnRzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKCdVc2VyIERlbmllZCBGdWxsIFByb3ZpZGVyJyk7XG4gICAgICAgICAgICBlcnIuY29kZSA9ICc0MDAxJztcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBkb1NlbmQocmF3UGF5bG9hZCwgcmF3UGFyYW1zID0gW10sIHRhcmdldENoYWluID0gdGhpcy5tYW51YWxDaGFpbklkLCB3YWl0Rm9yQ29ubmVjdGlvbiA9IHRydWUpIHtcbiAgICAgICAgY29uc3Qgc2VuZEZuID0gKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gKHR5cGVvZiByYXdQYXlsb2FkID09PSAnb2JqZWN0JykgPyByYXdQYXlsb2FkLm1ldGhvZCA6IHJhd1BheWxvYWQ7XG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSAodHlwZW9mIHJhd1BheWxvYWQgPT09ICdvYmplY3QnKSA/IHJhd1BheWxvYWQucGFyYW1zIDogcmF3UGFyYW1zO1xuICAgICAgICAgICAgY29uc3QgY2hhaW5UYXJnZXQgPSAoKHR5cGVvZiByYXdQYXlsb2FkID09PSAnb2JqZWN0JykgJiYgcmF3UGF5bG9hZC5jaGFpbklkKSB8fCB0YXJnZXRDaGFpbjtcbiAgICAgICAgICAgIGlmICghbWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ01ldGhvZCBpcyBub3QgYSB2YWxpZCBzdHJpbmcuJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gKDAsIHBheWxvYWRfMS5jcmVhdGUpKG1ldGhvZCwgcGFyYW1zLCB0aGlzLm5leHRJZCsrLCBjaGFpblRhcmdldCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9taXNlc1twYXlsb2FkLmlkXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZTogKHJlc3VsdCkgPT4gcmVzb2x2ZShyZXN1bHQpLFxuICAgICAgICAgICAgICAgICAgICByZWplY3QsXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogcGF5bG9hZC5tZXRob2RcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbi5zZW5kKHBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3RlZCB8fCAhd2FpdEZvckNvbm5lY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShzZW5kRm4pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXNvbHZlU2VuZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoZGlzY29ubmVjdFRpbWVyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShuZXcgUHJvbWlzZShzZW5kRm4pKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBkaXNjb25uZWN0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9mZignY29ubmVjdCcsIHJlc29sdmVTZW5kKTtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdOb3QgY29ubmVjdGVkJykpO1xuICAgICAgICAgICAgfSwgNTAwMCk7XG4gICAgICAgICAgICB0aGlzLm9uY2UoJ2Nvbm5lY3QnLCByZXNvbHZlU2VuZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhc3luYyBzZW5kKG1ldGhvZE9yUGF5bG9hZCwgY2FsbGJhY2tPckFyZ3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2RPclBheWxvYWQgPT09ICdzdHJpbmcnICYmXG4gICAgICAgICAgICAoIWNhbGxiYWNrT3JBcmdzIHx8IEFycmF5LmlzQXJyYXkoY2FsbGJhY2tPckFyZ3MpKSkge1xuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gY2FsbGJhY2tPckFyZ3M7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kb1NlbmQobWV0aG9kT3JQYXlsb2FkLCBwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZXRob2RPclBheWxvYWQgJiZcbiAgICAgICAgICAgIHR5cGVvZiBtZXRob2RPclBheWxvYWQgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICB0eXBlb2YgY2FsbGJhY2tPckFyZ3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIC8vIGEgY2FsbGJhY2sgd2FzIHBhc3NlZCB0byBzZW5kKCksIGZvcndhcmQgZXZlcnl0aGluZyB0byBzZW5kQXN5bmMoKVxuICAgICAgICAgICAgY29uc3QgY2IgPSBjYWxsYmFja09yQXJncztcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmRBc3luYyhtZXRob2RPclBheWxvYWQsIGNiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1ldGhvZE9yUGF5bG9hZCk7XG4gICAgfVxuICAgIHNlbmRCYXRjaChyZXF1ZXN0cykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocmVxdWVzdHMubWFwKHBheWxvYWQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZG9TZW5kKHBheWxvYWQubWV0aG9kLCBwYXlsb2FkLnBhcmFtcyk7XG4gICAgICAgIH0pKTtcbiAgICB9XG4gICAgYXN5bmMgc3Vic2NyaWJlKHR5cGUsIG1ldGhvZCwgcGFyYW1zID0gW10pIHtcbiAgICAgICAgY29uc3QgaWQgPSBhd2FpdCB0aGlzLmRvU2VuZCh0eXBlLCBbbWV0aG9kLCAuLi5wYXJhbXNdKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goaWQpO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfVxuICAgIGFzeW5jIHVuc3Vic2NyaWJlKHR5cGUsIGlkKSB7XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBhd2FpdCB0aGlzLmRvU2VuZCh0eXBlLCBbaWRdKTtcbiAgICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IHRoaXMuc3Vic2NyaXB0aW9ucy5maWx0ZXIoX2lkID0+IF9pZCAhPT0gaWQpOyAvLyBSZW1vdmUgc3Vic2NyaXB0aW9uXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhpZCk7IC8vIFJlbW92ZSBsaXN0ZW5lcnNcbiAgICAgICAgICAgIHJldHVybiBzdWNjZXNzO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIHNlbmRBc3luYyhyYXdQYXlsb2FkLCBjYikge1xuICAgICAgICBpZiAoIWNiIHx8IHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgb3IgdW5kZWZpbmVkIGNhbGxiYWNrIHByb3ZpZGVkIHRvIHNlbmRBc3luYycpO1xuICAgICAgICBpZiAoIXJhd1BheWxvYWQpXG4gICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKCdJbnZhbGlkIFBheWxvYWQnKSk7XG4gICAgICAgIC8vIHNlbmRBc3luYyBjYW4gYmUgY2FsbGVkIHdpdGggYW4gYXJyYXkgZm9yIGJhdGNoIHJlcXVlc3RzIHVzZWQgYnkgd2ViMy5qcyAwLnhcbiAgICAgICAgLy8gdGhpcyBpcyBub3QgcGFydCBvZiBFSVAtMTE5MydzIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IGJ1dCB3ZSBzdGlsbCB3YW50IHRvIHN1cHBvcnQgaXRcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmF3UGF5bG9hZCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWRzID0gcmF3UGF5bG9hZC5tYXAocCA9PiAoeyAuLi5wLCBqc29ucnBjOiAnMi4wJyB9KSk7XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGNiO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZEFzeW5jQmF0Y2gocGF5bG9hZHMsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB7IC4uLnJhd1BheWxvYWQsIGpzb25ycGM6ICcyLjAnIH07XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGNiO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmRvU2VuZChwYXlsb2FkLm1ldGhvZCwgcGF5bG9hZC5wYXJhbXMpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHsgaWQ6IHBheWxvYWQuaWQsIGpzb25ycGM6IHBheWxvYWQuanNvbnJwYywgcmVzdWx0IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBzZW5kQXN5bmNCYXRjaChwYXlsb2FkcywgY2IpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCB0aGlzLnNlbmRCYXRjaChwYXlsb2Fkcyk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSByZXN1bHRzLm1hcCgoZW50cnksIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgaWQ6IHBheWxvYWRzW2luZGV4XS5pZCwganNvbnJwYzogcGF5bG9hZHNbaW5kZXhdLmpzb25ycGMsIHJlc3VsdDogZW50cnkgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2IobnVsbCwgcmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY2IoZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaXNDb25uZWN0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3RlZDtcbiAgICB9XG4gICAgY2xvc2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb24gJiYgdGhpcy5jb25uZWN0aW9uLmNsb3NlKVxuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uLmNsb3NlKCk7XG4gICAgICAgIHRoaXMub2ZmKCdjb25uZWN0JywgdGhpcy5yZXN1bWVTdWJzY3JpcHRpb25zKTtcbiAgICAgICAgdGhpcy5jb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ1Byb3ZpZGVyIGNsb3NlZCwgc3Vic2NyaXB0aW9uIGxvc3QsIHBsZWFzZSBzdWJzY3JpYmUgYWdhaW4uJyk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKGlkID0+IHRoaXMuZW1pdChpZCwgZXJyb3IpKTsgLy8gU2VuZCBFcnJvciBvYmplY3RzIHRvIGFueSBvcGVuIHN1YnNjcmlwdGlvbnNcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gW107IC8vIENsZWFyIHN1YnNjcmlwdGlvbnNcbiAgICAgICAgdGhpcy5tYW51YWxDaGFpbklkID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnByb3ZpZGVyQ2hhaW5JZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5uZXR3b3JrVmVyc2lvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEFkZHJlc3MgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuY29pbmJhc2UgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGFzeW5jIHJlcXVlc3QocGF5bG9hZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kb1NlbmQocGF5bG9hZC5tZXRob2QsIHBheWxvYWQucGFyYW1zLCBwYXlsb2FkLmNoYWluSWQpO1xuICAgIH1cbiAgICBzZXRDaGFpbihjaGFpbklkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2hhaW5JZCA9PT0gJ251bWJlcicpXG4gICAgICAgICAgICBjaGFpbklkID0gJzB4JyArIGNoYWluSWQudG9TdHJpbmcoMTYpO1xuICAgICAgICBjb25zdCBjaGFpbkNoYW5nZWQgPSAoY2hhaW5JZCAhPT0gdGhpcy5jaGFpbklkKTtcbiAgICAgICAgdGhpcy5tYW51YWxDaGFpbklkID0gY2hhaW5JZDtcbiAgICAgICAgaWYgKGNoYWluQ2hhbmdlZCkge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdjaGFpbkNoYW5nZWQnLCB0aGlzLmNoYWluSWQpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gUHJvdmlkZXI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/ethereum-provider/dist/index.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/ethereum-provider/dist/payload.js":
/*!********************************************************!*\
  !*** ./node_modules/ethereum-provider/dist/payload.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.create = void 0;\nfunction create(method, params = [], id, targetChain) {\n    const payload = {\n        id, method, params, jsonrpc: '2.0'\n    };\n    if (targetChain) {\n        payload.chainId = targetChain;\n    }\n    if (payload.method === 'eth_sendTransaction') {\n        const mismatchedChain = isChainMismatch(payload);\n        if (mismatchedChain) {\n            throw new Error(`Payload chainId (${mismatchedChain}) inconsistent with specified target chainId: ${targetChain}`);\n        }\n        return updatePayloadChain(payload);\n    }\n    return payload;\n}\nexports.create = create;\nfunction isChainMismatch(payload) {\n    if (payload.method !== 'eth_sendTransaction')\n        return false;\n    const tx = payload.params[0] || {};\n    const chainId = tx.chainId;\n    return ('chainId' in tx) && parseInt(chainId) !== parseInt(payload.chainId || chainId);\n}\nfunction updatePayloadChain(payload) {\n    const tx = payload.params[0] || {};\n    return { ...payload, params: [{ ...tx, chainId: tx.chainId || payload.chainId }, ...payload.params.slice(1)] };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZXRoZXJldW0tcHJvdmlkZXIvZGlzdC9wYXlsb2FkLmpzIiwibWFwcGluZ3MiOiJBQUFhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxnQkFBZ0IsZ0RBQWdELFlBQVk7QUFDNUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLHVCQUF1QiwrQ0FBK0M7QUFDbkYiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mcm9udGVuZC8uL25vZGVfbW9kdWxlcy9ldGhlcmV1bS1wcm92aWRlci9kaXN0L3BheWxvYWQuanM/YTc4ZCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY3JlYXRlID0gdm9pZCAwO1xuZnVuY3Rpb24gY3JlYXRlKG1ldGhvZCwgcGFyYW1zID0gW10sIGlkLCB0YXJnZXRDaGFpbikge1xuICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGlkLCBtZXRob2QsIHBhcmFtcywganNvbnJwYzogJzIuMCdcbiAgICB9O1xuICAgIGlmICh0YXJnZXRDaGFpbikge1xuICAgICAgICBwYXlsb2FkLmNoYWluSWQgPSB0YXJnZXRDaGFpbjtcbiAgICB9XG4gICAgaWYgKHBheWxvYWQubWV0aG9kID09PSAnZXRoX3NlbmRUcmFuc2FjdGlvbicpIHtcbiAgICAgICAgY29uc3QgbWlzbWF0Y2hlZENoYWluID0gaXNDaGFpbk1pc21hdGNoKHBheWxvYWQpO1xuICAgICAgICBpZiAobWlzbWF0Y2hlZENoYWluKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFBheWxvYWQgY2hhaW5JZCAoJHttaXNtYXRjaGVkQ2hhaW59KSBpbmNvbnNpc3RlbnQgd2l0aCBzcGVjaWZpZWQgdGFyZ2V0IGNoYWluSWQ6ICR7dGFyZ2V0Q2hhaW59YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVwZGF0ZVBheWxvYWRDaGFpbihwYXlsb2FkKTtcbiAgICB9XG4gICAgcmV0dXJuIHBheWxvYWQ7XG59XG5leHBvcnRzLmNyZWF0ZSA9IGNyZWF0ZTtcbmZ1bmN0aW9uIGlzQ2hhaW5NaXNtYXRjaChwYXlsb2FkKSB7XG4gICAgaWYgKHBheWxvYWQubWV0aG9kICE9PSAnZXRoX3NlbmRUcmFuc2FjdGlvbicpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCB0eCA9IHBheWxvYWQucGFyYW1zWzBdIHx8IHt9O1xuICAgIGNvbnN0IGNoYWluSWQgPSB0eC5jaGFpbklkO1xuICAgIHJldHVybiAoJ2NoYWluSWQnIGluIHR4KSAmJiBwYXJzZUludChjaGFpbklkKSAhPT0gcGFyc2VJbnQocGF5bG9hZC5jaGFpbklkIHx8IGNoYWluSWQpO1xufVxuZnVuY3Rpb24gdXBkYXRlUGF5bG9hZENoYWluKHBheWxvYWQpIHtcbiAgICBjb25zdCB0eCA9IHBheWxvYWQucGFyYW1zWzBdIHx8IHt9O1xuICAgIHJldHVybiB7IC4uLnBheWxvYWQsIHBhcmFtczogW3sgLi4udHgsIGNoYWluSWQ6IHR4LmNoYWluSWQgfHwgcGF5bG9hZC5jaGFpbklkIH0sIC4uLnBheWxvYWQucGFyYW1zLnNsaWNlKDEpXSB9O1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/ethereum-provider/dist/payload.js\n");

/***/ })

};
;