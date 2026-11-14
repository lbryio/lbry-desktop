package proxy

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"sync/atomic"
	"testing"
)

// fakeLbrynet records what reaches it and answers with a canned body.
type fakeLbrynet struct {
	srv    *httptest.Server
	hits   atomic.Int32
	method string
	rawURL string
	host   string
	header http.Header
	body   string
}

func newFake(t *testing.T, status int, reply string) *fakeLbrynet {
	t.Helper()
	f := &fakeLbrynet{}
	f.srv = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		f.hits.Add(1)
		b, _ := io.ReadAll(r.Body)
		f.method, f.rawURL, f.host, f.header, f.body = r.Method, r.URL.RequestURI(), r.Host, r.Header.Clone(), string(b)
		w.Header().Set("Content-Type", "application/json-rpc")
		w.WriteHeader(status)
		_, _ = io.WriteString(w, reply)
	}))
	t.Cleanup(f.srv.Close)
	return f
}

func serve(t *testing.T, f *fakeLbrynet, overrides map[string]MethodFunc) *httptest.Server {
	t.Helper()
	u, _ := url.Parse(f.srv.URL)
	s := httptest.NewServer(New(u, overrides))
	t.Cleanup(s.Close)
	return s
}

func post(t *testing.T, s *httptest.Server, path, body string, hdr map[string]string) (int, string) {
	t.Helper()
	req, _ := http.NewRequest(http.MethodPost, s.URL+path, strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json-rpc")
	for k, v := range hdr {
		req.Header.Set(k, v)
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	b, _ := io.ReadAll(resp.Body)
	return resp.StatusCode, string(b)
}

const statusCall = `{"jsonrpc":"2.0","method":"status","params":{},"id":1700000000000}`

func TestForwardsUnchanged(t *testing.T) {
	f := newFake(t, 200, `{"jsonrpc":"2.0","result":{"is_running":true},"id":1700000000000}`)
	s := serve(t, f, map[string]MethodFunc{"other": nil})

	code, body := post(t, s, "/?m=status", statusCall, map[string]string{"X-Lbry-Auth-Token": "tok"})

	if code != 200 || body != `{"jsonrpc":"2.0","result":{"is_running":true},"id":1700000000000}` {
		t.Fatalf("got %d %q", code, body)
	}
	if f.method != http.MethodPost || f.rawURL != "/?m=status" {
		t.Errorf("upstream saw %s %s", f.method, f.rawURL)
	}
	if f.body != statusCall {
		t.Errorf("upstream body changed: %q", f.body)
	}
	if f.header.Get("X-Lbry-Auth-Token") != "tok" || f.header.Get("Content-Type") != "application/json-rpc" {
		t.Errorf("upstream headers: %v", f.header)
	}
	u, _ := url.Parse(f.srv.URL)
	if f.host != u.Host {
		t.Errorf("upstream Host = %q, want %q", f.host, u.Host)
	}
}

// The app treats both shapes as failures, so both must reach it unchanged, status included.
func TestErrorShapesPassThrough(t *testing.T) {
	for name, reply := range map[string]string{
		"error object":    `{"jsonrpc":"2.0","error":{"code":-32500,"message":"boom"},"id":1}`,
		"error string":    `{"jsonrpc":"2.0","error":"boom","id":1}`,
		"error in result": `{"jsonrpc":"2.0","result":{"error":"wallet locked"},"id":1}`,
		"http error":      `not json at all`,
	} {
		t.Run(name, func(t *testing.T) {
			status := 200
			if name == "http error" {
				status = 502
			}
			f := newFake(t, status, reply)
			s := serve(t, f, map[string]MethodFunc{"x": nil})
			code, body := post(t, s, "/", statusCall, nil)
			if code != status || body != reply {
				t.Fatalf("got %d %q, want %d %q", code, body, status, reply)
			}
		})
	}
}

func TestOverrideAnswersWithoutUpstream(t *testing.T) {
	f := newFake(t, 200, `{}`)
	var gotParams string
	s := serve(t, f, map[string]MethodFunc{
		"version": func(_ context.Context, p json.RawMessage) (any, *RPCError) {
			gotParams = string(p)
			return map[string]string{"lbrynet_version": "go-core"}, nil
		},
	})

	code, body := post(t, s, "/?m=version", `{"jsonrpc":"2.0","method":"version","params":{"a":1},"id":7}`, nil)

	if f.hits.Load() != 0 {
		t.Fatal("override still reached upstream")
	}
	if code != 200 || body != `{"jsonrpc":"2.0","result":{"lbrynet_version":"go-core"},"id":7}`+"\n" {
		t.Fatalf("got %d %q", code, body)
	}
	if gotParams != `{"a":1}` {
		t.Errorf("params = %q", gotParams)
	}
}

func TestOverrideError(t *testing.T) {
	s := serve(t, newFake(t, 200, `{}`), map[string]MethodFunc{
		"resolve": func(context.Context, json.RawMessage) (any, *RPCError) {
			return nil, &RPCError{Code: -32000, Message: "nope"}
		},
	})
	_, body := post(t, s, "/", `{"jsonrpc":"2.0","method":"resolve","params":{},"id":"abc"}`, nil)
	if body != `{"jsonrpc":"2.0","error":{"code":-32000,"message":"nope"},"id":"abc"}`+"\n" {
		t.Fatalf("got %q", body)
	}
}

func TestNonObjectBodiesGoUpstream(t *testing.T) {
	for name, body := range map[string]string{
		"batch":     `[{"jsonrpc":"2.0","method":"version","id":1}]`,
		"not json":  `hello`,
		"empty":     ``,
		"no method": `{"jsonrpc":"2.0","id":1}`,
	} {
		t.Run(name, func(t *testing.T) {
			f := newFake(t, 200, `{"jsonrpc":"2.0","result":1,"id":1}`)
			s := serve(t, f, map[string]MethodFunc{
				"version": func(context.Context, json.RawMessage) (any, *RPCError) { return "wrong", nil },
			})
			post(t, s, "/", body, nil)
			if f.hits.Load() != 1 || f.body != body {
				t.Fatalf("hits=%d upstream body=%q", f.hits.Load(), f.body)
			}
		})
	}
}

func TestNonPostGoesUpstream(t *testing.T) {
	f := newFake(t, 200, `ok`)
	s := serve(t, f, map[string]MethodFunc{"version": nil})
	resp, err := http.Get(s.URL + "/health")
	if err != nil {
		t.Fatal(err)
	}
	resp.Body.Close()
	if f.hits.Load() != 1 || f.method != http.MethodGet {
		t.Fatalf("hits=%d method=%s", f.hits.Load(), f.method)
	}
}

func TestOversizedBodyRejected(t *testing.T) {
	f := newFake(t, 200, `{}`)
	s := serve(t, f, map[string]MethodFunc{"version": nil})
	code, _ := post(t, s, "/", strings.Repeat("a", maxBody+1), nil)
	if code != http.StatusRequestEntityTooLarge || f.hits.Load() != 0 {
		t.Fatalf("code=%d hits=%d", code, f.hits.Load())
	}
}
