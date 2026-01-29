#!/usr/bin/awk -f

/^\|/ && /`[^`]+`/ {
    # Find the first backticked token: `...`
    if (match($0, /`[^`]+`/)) {
        token = substr($0, RSTART, RLENGTH)   # includes backticks
        key = token
        gsub(/`/, "", key)                    # remove backticks -> image.pullSecrets

        id = key
        # lowercase (portable-ish: works in most modern awks; if not, see note below)
        id = tolower(id)
        gsub(/\./, "-", id)                   # dots -> dashes

        anchor = token "<a id=\"" id "\"></a>"
        sub(token, anchor)                    # replace first token only
    }
}

{ print }

