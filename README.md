<img width="50%" src="https://img.shields.io/badge/%F0%9F%94%A2%20Gist-Counter-blue?&style=flat-square" alt="Gist Counter">

Use your gist as counters. Support multiple counters in a single gist.

## Setup

1. Add the following secrets to your Vercel account (or [create one](https://vercel.com/signup)):

   - `gist_counter_gh_token`: GitHub token with `gist` scope. [Click here](https://github.com/settings/tokens/new?description=gist-counter&scopes=gist) to create one.
   - `gist_counter_gist_id`: Gist ID. [Click here](https://gist.github.com/) to create a gist (with any content).

2. [Deploy to Vercel](https://vercel.com/import/project?template=https://github.com/kidonng/gist-counter)
3. Your counter is now live at `<Deployment Domain>/api` 🚀

## Counter badge

The most common usage is creating a counter badge (like this one ![](https://img.shields.io/badge/Counter-42-green)) using [Shields.io](https://shields.io/#dynamic-badge).

**tl;dr** `https://img.shields.io/badge/dynamic/json?label=<label>&query=$.<name>&url=<counter URL>`

1. Click the URL above to open Dynamic badge creator.
2. Set `data type` to `json`
3. Enter the text you want to display in `label`
4. Put counter URL in `data url`
5. Set `query` to `$.<name>` (you should use `$.count` by default)
6. Optionally, config color, prefix and suffix.
7. Click `Make Badge` and voila! Your new counter badge is there 🎉

## Multiple counters

The counter is named `count` by default. You can create a new counter by appending a query string `?name=<counter name>` to your badge URL.

## Modify the data

The data is just plain JSON, so you can use whatever method to modify it.

Note that if the data is invalid JSON (or empty), it will be reset on next request. This is useful if you want to reset the data: just remove all the content.
