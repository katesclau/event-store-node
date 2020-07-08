#!/bin/sh

eventStore () {
  response=$(curl --write-out '%{http_code}' --silent --output /dev/null http://127.0.0.1:2113/stats)
}
eventStore
while [ $response -ne 200 ]; do
  >&2 echo "EventStore is unavailable - sleeping"
  sleep 5
  eventStore
done

>&2 echo "EventStore is up"
exit 0
