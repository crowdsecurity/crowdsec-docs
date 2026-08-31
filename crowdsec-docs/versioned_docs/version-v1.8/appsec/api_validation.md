---
id: api_validation
title: OpenAPI Schema Validation
sidebar_position: 5
---

The Application Security Component can validate incoming HTTP requests against an [OpenAPI 3](https://swagger.io/specification/) schema you provide. Requests that do not conform to the schema (unknown route, unexpected method, missing or malformed parameters, invalid request body, missing/invalid authentication credentials, …) can be rejected before they ever reach the protected application.

This is a positive-security model layered on top of the negative-security model implemented by the WAF rules: instead of describing what an attacker looks like, you describe what a valid client looks like and reject everything else.

## How it works

Schema validation is exposed through the [hooks](hooks.md) system:

- An `on_load` hook loads one or more OpenAPI schemas at startup, each under a short string `ref`.
- A `pre_eval` hook calls `ValidateRequestWithSchema(ref)` to validate the current request. The function returns `true` when the request is valid, `false` otherwise.
- When validation fails, structured details about the failure are published to `hook_vars` so the same hook (or a later one) can build a meaningful drop reason, enrich an event, etc.

## Storing schemas

Schemas are loaded from the `schemas/` subdirectory of the CrowdSec [`data_dir`](/configuration/crowdsec_configuration.md#data_dir) (typically `/var/lib/crowdsec/data/schemas/`).

Filenames passed to the loader **must be relative** to that directory.

```
/var/lib/crowdsec/data/schemas/
├── users-api.yaml
└── billing-api.yaml
```

OpenAPI 3.0 and Swagger schemas in YAML or JSON are both accepted.

## Loading schemas (`on_load`)

Loading is done from an `on_load` hook using one of two helpers:

| Helper                                                        | Description                                                                              |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `LoadAPISchemaWithName(ref str, filename str)`                | Load `<data_dir>/schemas/<filename>` and register it under `ref`, with default policies. |
| `LoadAPISchemaWithOptions(ref str, filename str, opts map)`   | Same as above, but lets you override per-schema policies (see below).                    |
| `RegisterAPISchemaBodyDecoder(content_type str, decoder str)` | Enable a non-default body decoder for a given Content-Type (see below).                  |

`ref` is an arbitrary string you choose; you will use it later in `pre_eval` to refer to this schema. A schema name cannot be loaded twice.

```yaml
name: custom/my-appsec-config
inband_rules:
  - crowdsecurity/base-config
on_load:
  - apply:
      - LoadAPISchemaWithName("users_api", "users-api.yaml")
      - LoadAPISchemaWithName("billing_api", "billing-api.yaml")
```

If the schema file is missing, malformed, or not a valid OpenAPI 3 document, the datasource will fail to start and log the underlying error.

### Schema options

`LoadAPISchemaWithOptions` accepts the following keys, all strings:

| Key                              | Values            | Default | Effect                                                                                                                                                             |
| -------------------------------- | ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `on_route_not_found`             | `drop` / `ignore` | `drop`  | What to do when no path in the schema matches the request URL.                                                                                                     |
| `on_method_not_allowed`          | `drop` / `ignore` | `drop`  | What to do when a path matches but the method does not (e.g. schema only declares `GET`, request is `POST`).                                                       |
| `on_unsupported_security_scheme` | `drop` / `ignore` | `drop`  | What to do when an unsupported security schema is encountered (`openid`, `oauth2`). If `ignore`, the security schema will not be validated when checking a request |

`drop` (the default) treats the unmatched route as a validation failure — `ValidateRequestWithSchema` returns `false` and the validation error is surfaced via `hook_vars`. `ignore` lets the request through the validator without inspection (the function returns `true`), which is useful when your schema only covers a subset of your API.

```yaml
on_load:
  - apply:
      - >
        LoadAPISchemaWithOptions("public_api", "public-api.yaml", {
          "on_route_not_found": "ignore",
          "on_method_not_allowed": "drop",
        })
```

### Body decoders

The validator uses the request `Content-Type` to pick a decoder for the body. By default, only the following Content-Types are decoded:

- `application/json` and the JSON variants `application/json-patch+json`, `application/merge-patch+json`, `application/ld+json`, `application/hal+json`, `application/vnd.api+json`, `application/problem+json`
- `application/x-www-form-urlencoded`
- `multipart/form-data`

A request whose Content-Type is not in this list will fail validation if the matching operation in the schema declares a request body.

To enable validation of additional Content-Types, register a decoder from `on_load`:

```yaml
on_load:
  - apply:
      - RegisterAPISchemaBodyDecoder("application/yaml", "yaml")
      - RegisterAPISchemaBodyDecoder("text/csv", "csv")
```

Available decoder names:

| Decoder      | Use for                                               |
| ------------ | ----------------------------------------------------- |
| `json`       | JSON payloads                                         |
| `urlencoded` | `application/x-www-form-urlencoded`                   |
| `multipart`  | `multipart/form-data`                                 |
| `yaml`       | YAML payloads                                         |
| `csv`        | CSV payloads                                          |
| `plain`      | `text/plain`                                          |
| `file`       | Raw binary uploads (`application/octet-stream`, etc.) |

:::warning
Body decoders are registered process-wide. If you run several AppSec datasources in the same CrowdSec process, they share the same set of registered decoders.
:::

## Validating requests (`pre_eval`)

In a `pre_eval` hook, call `ValidateRequestWithSchema(ref)` with the `ref` you used at load time. It returns `true` if the request matches the schema, `false` otherwise.

| Helper                      | Type                 | Description                                                                                        |
| --------------------------- | -------------------- | -------------------------------------------------------------------------------------------------- |
| `ValidateRequestWithSchema` | `func(ref str) bool` | Validate the current request against the schema registered under `ref`. Returns `true` on success. |

A typical pattern is to fail closed — on validation failure, drop the request and use the failure details to build a human-readable reason:

```yaml
name: custom/my-appsec-config
on_load:
  - apply:
      - LoadAPISchemaWithName("users_api", "users-api.yaml")
inband:
  pre_eval:
    - filter: req.URL.Path startsWith "/users" && !ValidateRequestWithSchema("users_api")
      apply:
        - |
          DropRequest("schema validation failed: " + hook_vars.validation_error_message)
```

You can also use the result to pick a softer remediation, send a custom event, etc.

### Validation result variables

When `ValidateRequestWithSchema` returns `false`, the following keys are set on `hook_vars`. They are available to the `apply` block of the same hook, to later hooks in the same request, and to `on_match` / `post_eval` hooks. The same keys are also propagated to the resulting CrowdSec event.

| `hook_vars` key             | Description                                                                                                      |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `validation_error`          | Full human-readable error string (combination of reason, field and message).                                     |
| `validation_error_reason`   | Failure category — `parameter`, `request_body`, `security`, `route_not_found`, `method_not_allowed`, `internal`. |
| `validation_error_field`    | Name of the offending field (e.g. query parameter, header, body property) when applicable.                       |
| `validation_error_message`  | The underlying error message from the validator.                                                                 |
| `validation_error_value`    | The offending value, truncated to 100 characters.                                                                |
| `validation_error_expected` | Short description of what the schema expected (e.g. `type: integer, min: 18`).                                   |

On success these keys are absent.

## Authentication

If your OpenAPI schema declares a `security` requirement on an operation, the validator enforces it as part of validation. Failure to satisfy the security requirement is reported as a `security` reason in `hook_vars`.

| Security scheme           | Supported | Notes                                                                                          |
| ------------------------- | --------- | ---------------------------------------------------------------------------------------------- |
| `http` `basic`            | Yes       | Checks that an `Authorization: Basic …` header is present and non-empty.                       |
| `http` `bearer`           | Yes       | Checks that an `Authorization: Bearer …` header is present and non-empty.                      |
| `apiKey` (`header`)       | Yes       | Checks that the named header is present and non-empty.                                         |
| `apiKey` (`query`)        | Yes       | Checks that the named query parameter is present and non-empty.                                |
| `apiKey` (`cookie`)       | Yes       | Checks that the named cookie is present and non-empty.                                         |
| `oauth2`, `openIdConnect` | No        | A warning is logged at schema load. Any request guarded by such a scheme will fail validation. |

The validator only verifies that the credential **is present and well-formed** — it does not verify the credential against any backing store.

## End-to-end example

`/var/lib/crowdsec/data/schemas/users-api.yaml`:

```yaml
openapi: 3.0.0
info:
  title: Users API
  version: "1.0.0"
paths:
  /users:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [username, email]
              additionalProperties: false
              properties:
                username:
                  type: string
                  minLength: 3
                  maxLength: 20
                email:
                  type: string
                  format: email
      responses:
        "201":
          description: created
```

AppSec configuration:

```yaml
name: custom/my-appsec-config
on_load:
  - apply:
      - LoadAPISchemaWithName("users_api", "users-api.yaml")
inband:
  pre_eval:
    - filter: req.URL.Path startsWith "/users" && !ValidateRequestWithSchema("users_api")
      apply:
        - |
          DropRequest("API schema violation on '" + hook_vars.validation_error_field + "': " + hook_vars.validation_error_message)
```

With this configuration:

- `POST /users` with `{"username": "ab", "email": "x"}` is dropped (`username` too short, `email` malformed).
- `POST /users` with a valid body passes validation and is then evaluated by the WAF rules as usual.
- `GET /users` is dropped with reason `method_not_allowed` (default policy).
- `POST /admin` is dropped with reason `route_not_found` (default policy).

## Metrics

Two Prometheus counters are exposed:

| Metric                              | Labels                                            | Description                                                    |
| ----------------------------------- | ------------------------------------------------- | -------------------------------------------------------------- |
| `cs_appsec_validation_ok_total`     | `source`, `appsec_engine`, `schema_ref`           | Requests that passed schema validation.                        |
| `cs_appsec_validation_failed_total` | `source`, `appsec_engine`, `schema_ref`, `reason` | Requests that failed schema validation, broken down by reason. |

`reason` values match `validation_error_reason`: `parameter`, `request_body`, `security`, `route_not_found`, `method_not_allowed`, `internal`.
