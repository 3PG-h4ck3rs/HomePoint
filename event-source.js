function EventSource(res) {
    this.res = res;
    this.res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    });
    res.write("\n");
}

EventSource.prototype.send = function(eventName, data)
{
    this.res.write("event: " + eventName + "\n");
    this.res.write("data: " + JSON.stringify(data) + "\n\n");
};

module.exports = EventSource;