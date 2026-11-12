// Package proxy is the JSON-RPC shim from #681: it listens where the app expects lbrynet and
// forwards every call to the real lbrynet unless a method has an override.
//
// The app (ui/lbry.ts) POSTs a single JSON-RPC 2.0 object to the daemon with the method name
// repeated in the query string. Anything the shim does not understand is forwarded untouched, so
// the shim can never be stricter than lbrynet was.
package proxy

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httputil"
	"net/url"
)

// maxBody caps how much of a request is buffered to read its method. lbrynet calls in the app are
// a few KB; the largest are sync_apply (a wallet blob) and publish.
const maxBody = 32 << 20

// RPCError is the JSON-RPC error object an override can return.
type RPCError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// MethodFunc handles one method itself instead of forwarding it. params is the raw "params" value
// (an object, an array, or absent).
type MethodFunc func(ctx context.Context, params json.RawMessage) (result any, rpcErr *RPCError)

// Handler forwards JSON-RPC calls to Upstream, except methods present in Overrides.
type Handler struct {
	Overrides map[string]MethodFunc
	rp        *httputil.ReverseProxy
}

// New returns a Handler that forwards to upstream, for example http://127.0.0.1:5280.
func New(upstream *url.URL, overrides map[string]MethodFunc) *Handler {
	rp := httputil.NewSingleHostReverseProxy(upstream)
	// NewSingleHostReverseProxy rewrites the URL but leaves Host as the client sent it. lbrynet
	// checks Host, so present the upstream's own.
	director := rp.Director
	rp.Director = func(r *http.Request) {
		director(r)
		r.Host = upstream.Host
	}
	return &Handler{Overrides: overrides, rp: rp}
}

type request struct {
	JSONRPC string          `json:"jsonrpc"`
	Method  string          `json:"method"`
	Params  json.RawMessage `json:"params"`
	ID      json.RawMessage `json:"id"`
}

type response struct {
	JSONRPC string          `json:"jsonrpc"`
	Result  any             `json:"result,omitempty"`
	Error   *RPCError       `json:"error,omitempty"`
	ID      json.RawMessage `json:"id"`
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost || len(h.Overrides) == 0 {
		h.rp.ServeHTTP(w, r)
		return
	}

	body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, maxBody))
	if err != nil {
		http.Error(w, "request body too large or unreadable", http.StatusRequestEntityTooLarge)
		return
	}
	// Whatever happens next, the upstream (if used) must see exactly the bytes the app sent.
	r.Body = io.NopCloser(bytes.NewReader(body))
	r.ContentLength = int64(len(body))

	var req request
	if json.Unmarshal(body, &req) != nil {
		h.rp.ServeHTTP(w, r) // a batch, or not JSON: let lbrynet answer it
		return
	}
	fn, ok := h.Overrides[req.Method]
	if !ok || fn == nil {
		h.rp.ServeHTTP(w, r)
		return
	}

	result, rpcErr := fn(r.Context(), req.Params)
	resp := response{JSONRPC: "2.0", ID: req.ID}
	if rpcErr != nil {
		resp.Error = rpcErr
	} else {
		resp.Result = result
	}
	w.Header().Set("Content-Type", "application/json-rpc")
	// JSON-RPC errors travel in the body; the app reads response.error, not the HTTP status.
	_ = json.NewEncoder(w).Encode(resp)
}
