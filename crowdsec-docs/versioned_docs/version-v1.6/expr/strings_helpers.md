---
id: strings_helpers
title: Strings helpers
sidebar_position: 2
---

## Strings

### `Atof(string) float64`

Parses a string representation of a float number to an actual float number (binding on `strconv.ParseFloat`)

> `Atof(evt.Parsed.tcp_port)`

### `Upper(string) string`

Returns the uppercase version of the string

> `Upper("yop")`

### `Lower(string) string`

Returns the lowercase version of the string

> `Lower("YOP")`


### `ParseUri(string) map[string][]string`

Parses an URI into a map of string list.

`ParseURI("/foo?a=1&b=2")` would return :

```
{
  "a": []string{"1"}, 
  "b": []string{"2"}
}
```

### `PathUnescape(string) string`

`PathUnescape` does the inverse transformation of PathEscape, converting each 3-byte encoded substring of the form "%AB" into the hex-decoded byte 0xAB. It returns an error if any % is not followed by two hexadecimal digits.

### `PathEscape(string) string`

`PathEscape` escapes the string so it can be safely placed inside a URL path segment, replacing special characters (including /) with %XX sequences as needed.

### `QueryUnescape(string) string`

`QueryUnescape` does the inverse transformation of QueryEscape, converting each 3-byte encoded substring of the form "%AB" into the hex-decoded byte 0xAB. It returns an error if any % is not followed by two hexadecimal digits.

### `QueryEscape(string) string`

`QueryEscape` escapes the string so it can be safely placed inside a URL query.

### `Sprintf(format string, a ...interface{}) string`

[Official doc](https://pkg.go.dev/fmt#Sprintf) : Sprintf formats according to a format specifier and returns the resulting string.

> `Sprintf('%dh', 1)` returns `1h`

### `Match(pattern string, object string) bool`

`Match` returns true if the object string matches the pattern. Pattern only supports wildcard :
 - `*` multi-character wildcard (including zero-length)
 - `?` single character wildcard

> `Match('to?o*', 'totoooooo')` returns `true`

### `Fields(s string) []string`

`Fields` splits the string s around each instance of one or more consecutive white space characters, as defined by unicode.IsSpace, returning a slice of substrings of s or an empty slice if s contains only white space.

### `Index(s string, substr string) int`

Index returns the index of the first instance of substr in s, or -1 if substr is not present in s.

### `IndexAny(s string, chars string) int`

IndexAny returns the index of the first instance of any Unicode code point from chars in s, or -1 if no Unicode code point from chars is present in s.

### `Join(elems []string, sep string) string`

Join concatenates the elements of its first argument to create a single string. The separator string sep is placed between elements in the resulting string.

### `Split(s string, sep string) []string`

Split slices s into all substrings separated by sep and returns a slice of the substrings between those separators.

If s does not contain sep and sep is not empty, Split returns a slice of length 1 whose only element is s.

If sep is empty, Split splits after each UTF-8 sequence. If both s and sep are empty, Split returns an empty slice.

It is equivalent to SplitN with a count of -1.

To split around the first instance of a separator, see Cut.

### `SplitAfter(s string, sep string) []string`

SplitAfter slices s into all substrings after each instance of sep and returns a slice of those substrings.

If s does not contain sep and sep is not empty, SplitAfter returns a slice of length 1 whose only element is s.

If sep is empty, SplitAfter splits after each UTF-8 sequence. If both s and sep are empty, SplitAfter returns an empty slice.

It is equivalent to SplitAfterN with a count of -1.

### `SplitAfterN(s string, sep string, n int) []string `

SplitAfterN slices s into substrings after each instance of sep and returns a slice of those substrings.

The count determines the number of substrings to return:

```
n > 0: at most n substrings; the last substring will be the unsplit remainder.
n == 0: the result is nil (zero substrings)
n < 0: all substrings
```

Edge cases for s and sep (for example, empty strings) are handled as described in the documentation for SplitAfter.

### `SplitN(s string, sep string, n int) []string`


SplitN slices s into substrings separated by sep and returns a slice of the substrings between those separators.

The count determines the number of substrings to return:

```
n > 0: at most n substrings; the last substring will be the unsplit remainder.
n == 0: the result is nil (zero substrings)
n < 0: all substrings
```

Edge cases for s and sep (for example, empty strings) are handled as described in the documentation for Split.

To split around the first instance of a separator, see Cut.

### `Replace(s string, old string, new string, n int) string` 

Replace returns a copy of the string s with the first n non-overlapping instances of old replaced by new. If old is empty, it matches at the beginning of the string and after each UTF-8 sequence, yielding up to k+1 replacements for a k-rune string. If n < 0, there is no limit on the number of replacements.

### `ReplaceAll(s string, old string, new string) string`

ReplaceAll returns a copy of the string s with all non-overlapping instances of old replaced by new. If old is empty, it matches at the beginning of the string and after each UTF-8 sequence, yielding up to k+1 replacements for a k-rune string.

### `Trim(s string, cutset string) string`

Trim returns a slice of the string s with all leading and trailing Unicode code points contained in cutset removed.

### `TrimLeft(s string, cutset string) string`

TrimLeft returns a slice of the string s with all leading Unicode code points contained in cutset removed.

To remove a prefix, use TrimPrefix instead.

### `TrimRight(s string, cutset string) string`

TrimRight returns a slice of the string s, with all trailing Unicode code points contained in cutset removed.

To remove a suffix, use TrimSuffix instead.

### `TrimSpace(s string) string`

TrimSpace returns a slice of the string s, with all leading and trailing white space removed, as defined by Unicode.

### `TrimPrefix(s string, prefix string) string`

TrimPrefix returns s without the provided leading prefix string. If s doesn't start with prefix, s is returned unchanged.

### `TrimSuffix(s string, suffix string) string`

TrimSuffix returns s without the provided trailing suffix string. If s doesn't end with suffix, s is returned unchanged.

### `ToString(s) string`

Returns the string representation of s, if available (does a `s.(sttring)`).

### `LogInfo(format string, ...)`

Performs a logging call with the provided parameters, see [logrus reference](https://pkg.go.dev/github.com/sirupsen/logrus#Infof) for formatting info.