Hacky implementations/solutions in the codebase that might not make the most sense at first glance. The writing goes over the problem, the solution, and the reasoning behind the solution.

---

### Entries

1. **Revalidating paths from the client**: `revalidatePath` from '`next/cache`' doesn't seem to be working when called from the client. I get this error: `Error: Invariant: static generation store missing in revalidatePath /`. But works perfectly when called from the server (server action/server component). The only time I seem to want to do this -- call revalidatePath from the client -- is when I am doing auth stuff. So i wrote a dummy server action that just calls revalidatePath from the server. Works for now. I might revisit this later. the server function is `revalidatePathFromClient` in `server.ts`.

2. **Using tsvector, postgres triggers and GIN indexes**: Currently unsupported by drizzle-orm. The solution to the first part was pretty easy. I made a custom type in drizzle.

```ts
const tsvector = customType<{ data: string }>({
	dataType() {
		return `tsvector`;
	},
});
```

The other 2 not so much so. Since drizzle does not support either natively, I had to write the sql code for both then add it to a migration file. This means if the migrations were to be lost, One would have to manually add the triggers and indexes again. I left them as a comment in the schema file. The migration file is: `/supabase/migrations/0014_elite_wolfpack.sql`

On top of it all. The generated migration file ("when the tsvector column is added") always generates with quotes around `tsvector` ("tsvector"). This is not valid sql. So I had to manually remove the quotes from the migration file (`supabase/migrations/0013_superb_agent_zero.sql`). Just a heads up for anyone who might run into this issue.

3. **Redirects after email confirmation link**: Unfortunately, supabase does not allow query params in redirect URLs. So I had to do a workaround. The solution is to create a catchall route handler that handles the redirect. The catchall route is `/auth/callback/[...next]/route.ts`. it will match the following:

| Path                                      | Params                                      |
| ----------------------------------------- | ------------------------------------------- |
| `/auth/callback`                          | `{ next: undefined }`                       |
| `/auth/callback/someAccountType`          | `{ next: ['someAccountType'] }`             |
| `/auth/callback/someAccountType/somePlan` | `{ next: ['someAccountType', 'somePlan'] }` |

Solution from https://github.com/orgs/supabase/discussions/21110#discussioncomment-11020419

4. **Using kv in middleware**: ioredis does not work in middleware. [link to issue](https://github.com/vercel/next.js/issues/73424#issuecomment-2520244687). We use redis (a kv db) to store subscription and usage data. So we need to use kv in middleware for acess control. I considered pollyfilling `process.version` which is missing in the edge runtime using an env variable. But that would be a hacky solution. So I decided to use the `@upstash/redis` client which is compatible with the edge runtime. The only downside is that it does not support all the features of ioredis and it is slower. But it works for our use case.
