---
id: pprof
title: Pprof
sidebar_position: 5
---

CrowdSec exposes a pprof endpoint on `http://127.0.0.1:6060/debug/pprof`. It  provides real-time state of the application. It is useful for finding issues like memory leaks, excessive CPU usage etc.

Following are some of the common usage of this endpoint. Note that you need to have `golang` installed for the visualizations to work.

## Visualize goroutines:

```bash
go tool pprof -http=:8081 http://localhost:6060/debug/pprof/goroutine
```

You can also navigate to `http://localhost:6060/debug/pprof/goroutine?debug=1` to get live state of all goroutines.

## Visualize memory usage:

```bash
go tool pprof -http=:8081 http://localhost:6060/debug/pprof/heap
```

You can also navigate to `http://localhost:6060/debug/pprof/goroutine?debug=1` to get live memory usage.

## Visualize CPU usage:

```bash
go tool pprof -http=:8081 http://localhost:6060/debug/pprof/profile
```


For more advanced usages see [pprof docs](https://pkg.go.dev/net/http/pprof)