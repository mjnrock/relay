# **`Relay`**
Below is an index of of the **Relay** assets.
|Object|Type|
|-|-|
|[Message](#message)|`Class`|
|[MessageCollection](#messagecollection)|`Class`|
|[Service](#messagebus)|`Class`|
|[Subscription](#subscription)|`Class`|
|[Channel](#channel)|`Class`|
|[Network](#network)|`Class`|

---

## Message [^](#relay)

The **Message** is used to package a payload and attach relevant metadata, such as `tags` or message `type`.  The *first (1st)* tag in the set acts as the `type`.

### Class Properties
|Property|Type|Optional|
|-|-|-|
|`data`|`any`|❌|
|`emitter`|`UUID`|❌|
|`type`|`string`|✅|
|`tags`|`string[]`|✅|
|`meta`|`Object`|✅|

#### Example
	const message = new Message({
		data: Date.now(),
		emitter: `4c28504e-735a-418e-a597-f46544ee48c8`,
	});

---

## MessageCollection [^](#relay)

The **MessageCollection** is a registry of `Messages`.  As such, it maintains an ordered record of inserted messages that can be iterated over or retrieved.  It is used under the hood by `Channel` to maintain a historical record of sent messages.

#### Example
	const messageCollection = new MessageCollection([
		message1,
		message2,
		message3,
	]);

---

## Service [^](#relay)

The **Service** is a handler object that can invoke handlers based on `Message.type`.  If a `MessageCollection` is passed to the receiver, the `Service` will recurse through the collection and receive each message individually, exactly as though those messages were originally sent serially to the `Service`; if a `Channel` is sent, it will use the contained `MessageCollection`.

> A `MessageCollection` will invoke the universal handlers *on each message* and can therefore short-circuit at any point in the collection, if a filter is invoked.

#### Example
	const bus = new Service({
		test: (message) => {
			console.log(message)
		},
	});

---

## Subscription [^](#relay)

A **Subscription** is a wrapper-class that holds a *subscribor* (the object that is subscribing) and a *subscribee* (the object to which the subscribor is subscribing) and a *callback* function that can be executed on-demand via `.send`.  If a `callback` is an `Agent`, `.send` will instead invoke `.emit(...args)` on the agent.

### Class Properties
|Property|Type|Optional|
|-|-|-|
|`subscribor`|`UUID`|❌|
|`subscribee`|`UUID`|❌|
|`callback`|`fn`|❌|
|`tags`|`string[]`|✅|

#### Example
	const subscribor = new Agent();		// Example only, not required to be an `Agent`
	const subscribee = new Agent();		// Example only, not required to be an `Agent`
	const callback = (...args) => console.log(...args);

	const subscription = new Subscription(subscribor.id, subscribee.id, callback);

> Note that `subscribor` and `subscribee` are `UUID` values, _not_ `Objects`.  If an `Object` is passed for either, the subscription will attempt to find `.id` on the object -- if it _does_, then `.id` will be used (but it still must be a valid `UUID`); if it _does not_, then the instantiation will fail with an error.  As such, `null` values are not allowed.

> For cases where this causes issues, or where the `Subscription` is being used purely as a callback wrapper, use the static method `Subscription.CreateAnonymous` method to seed randomly-generated `UUIDs`.

Optionally, a `mutator` function be passed that can alter the arguments that will be sent to the `callback` function when invoking `.send`.

---

## Channel [^](#relay)

A **Channel** maintains a list of `Subscriptions` to itself as the `subscribee`, and accordingly creates *aliases* to each `subscribor` (the `UUID`) -- this allows for a subscription to be retrieved more easily.

### Class Properties
|Property|Type|Optional|
|-|-|-|
|`id`|`UUID`|✅|
|`tags`|`string[]`|✅|
|`config`|`Object`|✅|

#### `.config` Options
|Option|Default|Description|
|-|-|-|
|`retainHistory`|`false`|Determines whether or not the channel maintains a record of messages that it sends|
|`maxHistory`|`100`|The maximum amount of messages that the channel will hold|
|`atMaxReplace`|`true`|If message size is at the maximum, should it 1) ignore the message entirely (`false`); or instead should it 2) remove the earliest message in its history (i.e. first index) and add the most recent one to the end of the stack (i.e. last index)|

#### Example
	const channel = new Channel({
		config: {
			retainHistory: false,
			maxHistory: 2,
			atMaxReplace: false,
		},
	});

---

## Network [^](#relay)

The **Network** is simply a collection of `Channels`, that additionally adds some channel-specific targeting functions to facilitate messaging to a specific channel.  Optionally, a network can broadcast to all registered channels via `.broadcast`.

### Class Properties
|Property|Type|Optional|
|-|-|-|
|`channels`|`Array<Channel>`|✅|

#### Example
	const network = new Network([
		[ "alias1", channel1 ],
		[ "alias2", channel2 ],
	]);

---