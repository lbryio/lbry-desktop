# lbry-core

The Go replacement for the `lbrynet` daemon, built one method at a time (#681, epic #689). Today it
is a pass-through:

```
app  ->  lbry-core :5279  ->  lbrynet :5280
```

## Run it

Start `lbrynet` on the upstream port, then:

```
cd core
go run ./cmd/lbry-core -listen 127.0.0.1:5279 -upstream http://127.0.0.1:5280
```

## How it works

- `internal/proxy` forwards every request unchanged: method, path and query, headers, body, status.
  Errors in either shape the app understands (`error`, or `result.error`) pass through as lbrynet wrote them.
- Methods in `Handler.Overrides` are answered in Go instead of being forwarded. The map is empty in
  `cmd/lbry-core` for now; the first overrides come from #682 (resolve and search).
- Bodies that are not a single JSON-RPC object (batches, non-JSON), non-POST requests and unknown
  methods always go to `lbrynet`, so the shim is never stricter than lbrynet was.
- Request bodies are capped at 32 MiB (`sync_apply` and `publish` are the largest calls).

## Not done yet (#681)

- Spawning it from `electron/Daemon.ts`. The app still starts `lbrynet` directly on 5279.
- Contract tests recorded from a real `lbrynet`. The tests here use a fake upstream.

## Test

```
cd core && go test -race ./...
```

CI runs this in the `go-core` job, plus `gofmt -l` and `go vet`.
