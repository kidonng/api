<img width="50%" src="https://img.shields.io/badge/%F0%9F%94%A2%20Gist-Counter-blue?&style=flat-square" alt="Gist Counter">

Use your gist as counters. Support multiple counters in a single gist.

## Setup

1. Configure the following environment variables in [`vercel.json`](vercel.json):

   - `GH_TOKEN`: GitHub token with `gist` scope. [Click here](https://github.com/settings/tokens/new?description=gist-counter&scopes=gist) to create one.
   - `GIST_ID`: Gist ID. [Click here](https://gist.github.com/) to create a gist (with any content).

2. [Deploy to Vercel](https://vercel.com/import/project?template=https://github.com/kidonng/gist-counter).
3. Your counter is now live at `<Deployment Domain>/api` 🚀

## Create a badge

The most common usage of Gist Counter is to create a badge (like this one ![](https://img.shields.io/badge/dynamic/json?label=Hits&query=$['gist-counter']&url=https://counter.xuann.wang/api?name=gist-counter)) using [Shields.io](https://shields.io/).

**tl;dr** `https://img.shields.io/badge/dynamic/json?label=<label>&query=$.<name>&url=<counter URL>`

1. Open [dynamic badge creator](https://shields.io/#dynamic-badge).
2. Set `data type` to `json`
3. Enter the text you want to display in `label`
4. Put counter URL in `data url`
5. Set `query` to `$.<name>` (by default it's `$.count`)
6. Optionally config color, prefix and suffix.
7. Click `Make Badge` and voila! You've got a counter badge 🎉

## Multiple counters

The default counter is named `count`. You can create and use new counters by appending a query string `?name=<counter name>` to your counter URL.

## Modify the data

The data is just plain JSON, so you can use whatever method to modify it.

Note that if the data is invalid JSON (or just empty), it will be reset on next request. This is useful if you want to reset the data, just leave your gist blank.

## See also

- [Hits](https://github.com/dwyl/hits)
- [visitor-badge](https://github.com/jwenjian/visitor-badge)
