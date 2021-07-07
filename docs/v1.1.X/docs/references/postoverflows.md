# Post Overflows

PostOverflows is secondary parsing phase that happens *after* a bucket overflowed.
It behaves exactly like a [Normal Parsing](/Crowdsec/v11/references/parsers/). However, instead of receiving {{v11X.event.htmlname}} with logs, the parser receive events with {{v11X.alert.htmlname}} representing the overflows.

The configuration resides in `/etc/crowdsec/postoverflows/`.

