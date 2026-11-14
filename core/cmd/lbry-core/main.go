// Command lbry-core is the Go replacement for the lbrynet daemon, built up one method at a time
// (#689). For now it is a pass-through: it listens on the port the app uses and forwards to lbrynet,
// which has to be started on a different port (for example `lbrynet start --api 127.0.0.1:5280`).
package main

import (
	"flag"
	"log"
	"net/http"
	"net/url"
	"time"

	"github.com/bitcoinbrisbane/lbry-desktop/core/internal/proxy"
)

func main() {
	listen := flag.String("listen", "127.0.0.1:5279", "address to serve the JSON-RPC API on (the app expects 5279)")
	upstream := flag.String("upstream", "http://127.0.0.1:5280", "lbrynet's JSON-RPC URL")
	flag.Parse()

	target, err := url.Parse(*upstream)
	if err != nil || target.Scheme == "" || target.Host == "" {
		log.Fatalf("invalid -upstream %q", *upstream)
	}

	srv := &http.Server{
		Addr:              *listen,
		Handler:           proxy.New(target, nil),
		ReadHeaderTimeout: 10 * time.Second,
	}
	log.Printf("lbry-core: serving %s, forwarding to %s", *listen, target)
	log.Fatal(srv.ListenAndServe())
}
