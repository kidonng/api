<img width="50%" src="https://img.shields.io/badge/%F0%9F%94%A2%20Gist-Counter-blue?&style=flat-square" alt="Gist Counter">

Use your gist as counters. Support multiple counters in a single gist.

## Setup

1. Configure the following environment variables in [`vercel.json`](vercel.json):

   - `GH_TOKEN`: GitHub token with `gist` scope. [Click here](https://github.com/settings/tokens/new?description=gist-counter&scopes=gist) to create one.
   - `GIST_ID`: Gist ID. [Click here](https://gist.github.com/) to create a gist:

      ```json
      {
        "count": 0
      }
      ```

2. [Deploy to Vercel](https://vercel.com/import/project?template=https://github.com/kidonng/gist-counter).
3. 🚀 Your counter is now live at `<Deployment Domain>/api?name=count`. When you visit it, the updated counter will be returned:

   ```json
   {
      "count": 1
   }
   ```
4. To add, modify and remove counters, just edit the gist.

## API

| Params  | Type     | Required | Description                                                                                                                                                                |
| ------- | -------- | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`  | *string* |    ✔     | Name of the counter                                                                                                                                                        |
| `step`  | *number* |    ❌     | Step of the counter, can be any number (thus `0` makes it read-only), defaults to `1`                                                                                      |
| `label` | *string* |    ❌     | Return a badge via [Shields.io](https://shields.io/) if specified. You can use other [dynamic label parameters](https://shields.io/#dynamic-badge) such as `color` as well |

## Usage

- As a lightweight analytics
- Track and show your project or profile visits, like this one ![Hits](https://counter.xuann.wang/api?name=gist-counter&label=Hits)

   ```md
   ![Hits](https://counter.xuann.wang/api?name=gist-counter&label=Hits)
   ```
- ...unleash your imagination!

## See also

- [Hits](https://github.com/dwyl/hits)
- [visitor-badge](https://github.com/jwenjian/visitor-badge)
