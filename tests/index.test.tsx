const Relay = require("./../dist/index.js").default;

describe("Relay", () => {
	const msg = new Relay.Message({
		data: "test",
		emitter: "cats",
	});

	test("Message should be 'test' ", () => {
		expect(msg.data).toBe("test");
	});
});